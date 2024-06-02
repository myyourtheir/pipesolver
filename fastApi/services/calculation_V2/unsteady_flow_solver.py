import numpy as np
import math
import os
from typing import Literal, Union
from services.calculation_V2.basic_functions import Basic_functions
from services.calculation_V2.constants import Constants as C
from services.calculation_V2.vis_otm import Vis_otm
from schemas.unsteady_flow_ws_scheme import (
    Unsteady_data,
    Recieved_element,
    Result_unsteady_data,
    Response_element,
    Cond_params,
    Provider,
    Consumer,
    Pipe_params,
    Pump_params,
    Gate_valve_params,
    Safe_valve_params,
    Response_value_model,
    x_y_dict,
)
from functools import reduce


def find_elements_without_parents(acc: list[str], elem: Recieved_element):
    if len(elem.parents) == 0:
        acc.append(elem.id)
    return acc


def find_first_pipe_diameter(pipeline: dict[str, Recieved_element]):
    start_element_id = reduce(find_elements_without_parents, pipeline.values(), [])[0]
    current_node = pipeline[start_element_id]
    while len(current_node.children) != 0:
        if current_node.value.type == "pipe":
            diameter = current_node.value.diameter
            break
        current_node = pipeline[current_node.children[0]]
    return diameter


class Unsteady_flow_solver(Vis_otm):
    result: Result_unsteady_data
    __moment_result: dict[str, Response_element]
    _dx = 500
    _vis_otm_iter: int = 0
    _cond_params: Cond_params
    _current_time: float = 0
    _current_x = 0
    # TODO Добавить в обработчики для след выражений
    _current_diameter: int

    # TODO Сделать правильное распределение начальных параметров
    @classmethod
    def __make_initial_distribution(
        cls, pipeline: dict[str, Recieved_element]
    ) -> dict[str, Response_element]:
        initial_distribution = {}
        start_element_id = reduce(find_elements_without_parents, pipeline.values(), [])[
            0
        ]
        current_node = pipeline[start_element_id]
        current_x = 0
        while len(current_node.children) != 0:
            initial_distribution[current_node.id] = Response_element(
                **{
                    id: str,
                    "value": Response_value_model(
                        {
                            "Davleniya": [{"x": current_x, "y": 0}],
                            "Skorosty": [{"x": current_x, "y": 0}],
                            "Napory": [{"x": current_x, "y": 0}],
                        }
                    ),
                    "children": list[str],
                    "parents": list[str],
                }
            )
            current_x += cls._dx
            current_node = pipeline[current_node.children[0]]

    def __init__(self, data: Unsteady_data):
        cond_params = data.cond_params
        self.time_to_iter = cond_params.time_to_iter
        self.density = cond_params.density
        self.viscosity = cond_params.viscosity
        self.pipeline = data.pipeline
        self.start_element_ids = reduce(
            find_elements_without_parents, data.pipeline.values(), []
        )  # Учитываем пока как будто в массиве 1 стартовый id
        self.dt = self._dx / C.c
        self.__prev_res = self.__make_initial_distribution(data.pipeline)
        self._current_diameter = find_first_pipe_diameter(data.pipeline)

    def solve(self):
        while self._current_time <= self.time_to_iter:
            # Обнуление всего перед след расчетом
            self._current_x = 0
            self.__prev_res = self.__moment_result
            self.__moment_result = {}
            # _________________________________________
            self.__calculate_the_entire_graph_one_time()
            self._current_time += self.dt
            yield self.result

    def __calculate_the_entire_graph_one_time(self):
        start_element = self.start_element_ids[
            0
        ]  # TODO В дальнейшем заменить, когда будет возможность считать нескольких поставщиков
        current_node = self.pipeline[start_element]

        while len(current_node.children) != 0:

            current_element = current_node.value
            element_result: Response_element

            if current_element.type == "provider":
                element_result = self._provider_method(
                    current_node,
                    child_element=self.__prev_res[current_node.children[0]].value,
                )
            elif current_element.type == "pipe":
                element_result = self._pipe_method(
                    current_node,
                    child_element=self.__prev_res[current_node.children[0]].value,
                    parent_element=self.__prev_res[current_node.parents[0]].value,
                )

            # TODO Добавить расчеты элементов
            elif current_element.type == "pump":
                element_result = self._pump_method()

            elif current_element.type == "gate_valve":
                element_result = self._gate_valve_method()

            elif current_element.type == "safe_valve":
                element_result = self._safe_valve_method()

            # _________________________________________________

            elif current_element.type == "consumer":
                element_result = self._consumer_method(
                    current_node,
                    parent_element=self.__prev_res[current_node.parents[0]].value,
                )
            self.__moment_result[current_node.id] = element_result
            # Сохраняем в результаты текущего времени с id элемента
            current_node = self.pipeline[
                current_node.children[0]
            ]  # TODO Cделать обход по всем элементам
        self.result = Result_unsteady_data(
            t=self._current_time, moment_result=self.__moment_result
        )

    def __find_lyam(self, Re: int, eps: float):
        lyam: float
        if Re == 0:
            return 0
        if Re < 2320:
            lyam = 68 / Re
        elif (10 / eps) > Re >= 2320:
            lyam = 0.3164 / Re**0.25
        elif (10 / eps) <= Re < (500 / eps):
            lyam = 0.11 * (eps + 68 / Re) ** 0.25
        else:
            lyam = 0.11 * (eps) ** 0.25
        return lyam

    def __count_H(
        self,
        p: float,
        V: float,
    ):
        return (
            p / (self.density * C.g)
            + self._vis_otm[self._vis_otm_iter]
            + (V**2) / (2 * C.g)
        )

    def __find_Jb(self, Davleniye: float, Skorost: float):
        Vjb = Skorost
        Re = abs(Vjb) * self.density / self.viscosity
        lyamjb = self.__find_lyam(Re, C.o / self._current_diameter)
        Jb = (
            Davleniye
            - self.density * C.c * Vjb
            + lyamjb
            * self.density
            * Vjb
            * abs(Vjb)
            * self._current_time
            * C.c
            / (2 * self._current_diameter)
            + self._current_time
            * self.density
            * C.c
            * C.g
            * (
                self._vis_otm[self._vis_otm_iter + 1]
                - self._vis_otm[self._vis_otm_iter]
            )
            / 1000
        )
        return Jb

    def __find_Ja(self, Davleniye: float, Skorost: float):
        Vja = Skorost
        Re = abs(Vja) * self.density / self.viscosity
        lyamja = self.__find_lyam(Re, C.o / self.currentd)
        Ja = (
            Davleniye
            + self.density * C.c * Vja
            - lyamja
            * self.density
            * Vja
            * abs(Vja)
            * self._current_time
            * C.c
            / (2 * self._current_diameter)
            - self.T
            * self.density
            * C.c
            * C.g
            * (
                self._vis_otm[self._vis_otm_iter]
                - self._vis_otm[self._vis_otm_iter - 1]
            )
            / 1000
        )
        return Ja

    def _provider_method(
        self, current_node: Recieved_element, child_element: Response_value_model
    ) -> Response_element:

        current_element = current_node.value
        Jb = self.__find_Jb(child_element.Davleniya[0].y, child_element.Skorosty[0].y)
        if current_element.mode == "pressure":
            p = current_element.value
            V = (p - Jb) / (self.density * C.c)
        else:
            if current_element.value == 0:
                V = 10 ** (-6)
            else:
                V = current_element.value
            p = Jb + self.density * C.c * V
        H = self.__count_H(p, V)
        response_value = Response_value_model(
            Davleniya=[{"x": self._current_x, "y": p}],
            Skorosty=[{"x": self._current_x, "y": V}],
            Napory=[{"x": self._current_x, "y": H}],
        )

        self._current_x += self._dx

        return Response_element(
            children=current_node.children,
            id=current_node.id,
            parents=current_node.parents,
            value=response_value,
        )

    def _pipe_method(
        self,
        current_node: Recieved_element,
        child_element: Response_value_model,
        parent_element: Response_value_model,
    ) -> Response_element:
        current_element = current_node.value

        self._current_diameter = current_element.diameter
        sections_number = current_element.length * 1000 / self._dx

        Davleniya: list[x_y_dict] = []
        Skorosty: list[x_y_dict] = []
        Napory: list[x_y_dict] = []

        def culc_one_section(
            prev_p, next_p, prev_V, next_V
        ) -> dict[Literal["p", "V", "H"], float]:
            Ja = self.__find_Ja(prev_p, prev_V)
            Jb = self.__find_Jb(next_p, next_V)
            p = (Ja + Jb) / (2)
            V = (Ja - Jb) / (2 * self.density * C.c)
            H = self.__count_H(p, V)
            return {"p": p, "V": V, "H": H}

        for i in range(sections_number):
            if i == 0:
                one_section_res = culc_one_section(
                    prev_p=parent_element.Davleniya[-1].y,
                    prev_V=parent_element.Skorosty[-1].y,
                    next_p=self.__prev_res[current_node.id].value.Davleniya[i + 1].y,
                    next_V=self.__prev_res[current_node.id].value.Skorosty[i + 1].y,
                )
            if i == sections_number - 1:
                one_section_res = culc_one_section(
                    prev_p=self.__prev_res[current_node.id].value.Davleniya[i - 1].y,
                    prev_V=self.__prev_res[current_node.id].value.Skorosty[i - 1].y,
                    next_p=child_element.Davleniya[0].y,
                    next_V=child_element.Skorosty[0].y,
                )
            else:
                one_section_res = culc_one_section(
                    prev_p=self.__prev_res[current_node.id].value.Davleniya[i - 1].y,
                    prev_V=self.__prev_res[current_node.id].value.Skorosty[i - 1].y,
                    next_p=self.__prev_res[current_node.id].value.Davleniya[i + 1].y,
                    next_V=self.__prev_res[current_node.id].value.Skorosty[i + 1].y,
                )
            Davleniya.append({"x": self._current_x, "y": one_section_res["p"]})
            Skorosty.append({"x": self._current_x, "y": one_section_res["V"]})
            Napory.append({"x": self._current_x, "y": one_section_res["H"]})
            self._current_x += self._dx
        response_value = Response_value_model(
            Napory=Napory, Davleniya=Davleniya, Napory=Napory
        )
        return Response_element(
            children=current_node.children,
            id=current_node.id,
            parents=current_node.parents,
            value=response_value,
        )

    def _pump_method(self) -> Response_element:
        pass

    def _gate_valve_method(self) -> Response_element:
        pass

    def _safe_valve_method(self) -> Response_element:
        pass

    def _consumer_method(
        self, current_node: Recieved_element, parent_element: Response_value_model
    ) -> Response_element:
        current_element = current_node.value
        Ja = self.__find_Ja(
            parent_element.Davleniya[-1].y, parent_element.Skorosty[-1].y
        )
        if current_element.mode == "pressure":
            p = current_element.value
            V = (Ja - p) / (self.density * C.c)
        else:
            if current_element.value == 0:
                V = 10 ** (-6)
            else:
                V = current_element.value
            p = Ja - self.density * C.c * V
        H = self.__count_H(p, V)
        response_value = Response_value_model(
            Davleniya=[{"x": self._current_x, "y": p}],
            Skorosty=[{"x": self._current_x, "y": V}],
            Napory=[{"x": self._current_x, "y": H}],
        )

        self._current_x += self._dx

        return Response_element(
            children=current_node.children,
            id=current_node.id,
            parents=current_node.parents,
            value=response_value,
        )
