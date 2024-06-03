from services.calculation_V2.constants import Constants as C
from services.calculation_V2.vis_otm import Vis_otm
from services.calculation_V2.unsteady_flow_core import Unsteady_flow_core
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
    One_section_response,
)
from typing import Literal
from functools import reduce


class Basic_functions(Vis_otm, Unsteady_flow_core):
    _current_time: float = 0
    _vis_otm_iter: int = 0
    _cond_params: Cond_params
    _density: int
    _viscosity: int
    _current_diameter: float
    _vis_otm_iter: int = 0
    _current_time: float = 0
    _current_x = 0
    _dx: int
    _dt: int
    _prev_res: dict[str, Response_element] = {}

    def _make_initial_distribution(
        self, pipeline: dict[str, Recieved_element]
    ) -> dict[str, Response_element]:
        def get_iters_count(node: Recieved_element):
            elements_with_two_sections = ["safe_valve", "gate_valve", "pump"]
            element = node.value
            if element.type == "pipe":
                return int(element.length * 1000 / self._dx)
            elif element.type in elements_with_two_sections:
                return 2
            else:
                return 1

        initial_distribution = {}
        start_element_id = reduce(
            self.find_elements_without_parents, pipeline.values(), []
        )[0]
        current_node = pipeline[start_element_id]
        current_x = 0
        while True:
            res_value: list[One_section_response] = []
            for i in range(get_iters_count(current_node)):
                res_value.append(One_section_response(x=current_x, p=0, V=0, H=0))
                if (
                    current_node.value.type == "pipe"
                    and i != get_iters_count(current_node) - 1
                ):
                    current_x += self._dx

            initial_distribution[current_node.id] = Response_element(
                **{
                    "id": current_node.id,
                    "type": current_node.value.type,
                    "value": res_value,
                    "children": current_node.children,
                    "parents": current_node.parents,
                }
            )
            current_x += self._dx
            if len(current_node.children) == 0:
                break
            current_node = pipeline[current_node.children[0]]
        return initial_distribution

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
            p / (self._density * C.g)
            + self._vis_otm[self._vis_otm_iter]
            + (V**2) / (2 * C.g)
        )

    def __find_Jb(self, p: float, V: float):
        Vjb = V
        Re = abs(Vjb) * self._density / self._viscosity
        lyamjb = self.__find_lyam(Re, C.o / self._current_diameter)
        Jb = (
            p
            - self._density * C.c * Vjb
            + lyamjb
            * self._density
            * Vjb
            * abs(Vjb)
            * self._dt
            * C.c
            / (2 * self._current_diameter)
            + self._current_time
            * self._density
            * C.c
            * C.g
            * (
                self._vis_otm[self._vis_otm_iter + 1]
                - self._vis_otm[self._vis_otm_iter]
            )
            / 1000
        )
        return Jb

    def __find_Ja(self, p: float, V: float):
        Vja = V
        Re = abs(Vja) * self._density / self._viscosity
        lyamja = self.__find_lyam(Re, C.o / self._current_diameter)
        Ja = (
            p
            + self._density * C.c * Vja
            - lyamja
            * self._density
            * Vja
            * abs(Vja)
            * self._current_time
            * C.c
            / (2 * self._current_diameter)
            - self._dt
            * self._density
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
        self, current_node: Recieved_element, child_element: list[One_section_response]
    ) -> Response_element:

        current_element = current_node.value
        Jb = self.__find_Jb(child_element[0].p, child_element[0].V)
        if current_element.mode == "pressure":
            p = current_element.value
            V = (p - Jb) / (self._density * C.c)
        else:
            if current_element.value == 0:
                V = 10 ** (-6)
            else:
                V = current_element.value
            p = Jb + self._density * C.c * V
        H = self.__count_H(p, V)
        response_value = [One_section_response(x=self._current_x, p=p, V=V, H=H)]
        # print(
        #     f"""
        #       type: {current_element.type}
        #       current_x: {self._current_x}
        #       Jb: {Jb}
        #       p: {p}
        #       V: {V}
        #       H: {H}
        #       ______________________________________________________
        #       """
        # )
        self._current_x += self._dx

        return Response_element(
            id=current_node.id,
            type=current_element.type,
            children=current_node.children,
            parents=current_node.parents,
            value=response_value,
        )

    def _pipe_method(
        self,
        current_node: Recieved_element,
        child_element: list[One_section_response],
        parent_element: list[One_section_response],
    ) -> Response_element:
        current_element = current_node.value

        self._current_diameter = current_element.diameter
        sections_number = int(current_element.length * 1000 / self._dx)
        response_value: list[One_section_response] = []

        def culc_one_section(
            prev_p, next_p, prev_V, next_V
        ) -> dict[Literal["p", "V", "H"], float]:
            Ja = self.__find_Ja(prev_p, prev_V)
            Jb = self.__find_Jb(next_p, next_V)
            p = (Ja + Jb) / (2)
            V = (Ja - Jb) / (2 * self._density * C.c)
            H = self.__count_H(p, V)
            # print(
            #     f"""
            #   type: {current_element.type}
            #   current_x: {self._current_x}
            #   Ja: {Ja}
            #   Jb: {Jb}
            #   p: {p}
            #   V: {V}
            #   H: {H}
            #   i:{i}
            #   ______________________________________________________
            #   """
            # )
            return {"p": p, "V": V, "H": H}

        for i in range(sections_number):
            if i == 0:
                one_section_res = culc_one_section(
                    prev_p=parent_element[-1].p,
                    prev_V=parent_element[-1].V,
                    next_p=self._prev_res[current_node.id].value[i + 1].p,
                    next_V=self._prev_res[current_node.id].value[i + 1].V,
                )

            elif i == sections_number - 1:
                one_section_res = culc_one_section(
                    prev_p=self._prev_res[current_node.id].value[i - 1].p,
                    prev_V=self._prev_res[current_node.id].value[i - 1].V,
                    next_p=child_element[0].p,
                    next_V=child_element[0].V,
                )

            else:
                one_section_res = culc_one_section(
                    prev_p=self._prev_res[current_node.id].value[i - 1].p,
                    prev_V=self._prev_res[current_node.id].value[i - 1].V,
                    next_p=self._prev_res[current_node.id].value[i + 1].p,
                    next_V=self._prev_res[current_node.id].value[i + 1].V,
                )

            response_value.append(
                One_section_response(
                    x=self._current_x,
                    p=one_section_res["p"],
                    V=one_section_res["V"],
                    H=one_section_res["H"],
                )
            )
            self._current_x += self._dx

        return Response_element(
            id=current_node.id,
            type=current_element.type,
            children=current_node.children,
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
        self, current_node: Recieved_element, parent_element: list[One_section_response]
    ) -> Response_element:
        current_element = current_node.value
        Ja = self.__find_Ja(parent_element[-1].p, parent_element[-1].V)
        if current_element.mode == "pressure":
            p = current_element.value
            V = (Ja - p) / (self._density * C.c)
        else:
            if current_element.value == 0:
                V = 10 ** (-6)
            else:
                V = current_element.value
            p = Ja - self._density * C.c * V
        H = self.__count_H(p, V)
        response_value = [One_section_response(x=self._current_x, p=p, V=V, H=H)]
        # print(
        #     f"""
        #       type: {current_element.type}
        #       current_x: {self._current_x}
        #       Ja: {Ja}
        #       p: {p}
        #       V: {V}
        #       H: {H}
        #       ______________________________________________________
        #       """
        # )
        return Response_element(
            id=current_node.id,
            type=current_element.type,
            children=current_node.children,
            parents=current_node.parents,
            value=response_value,
        )
