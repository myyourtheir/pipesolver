import numpy as np
from services.calculation_V2.constants import Constants as C
from services.calculation_V2.vis_otm import Vis_otm
from services.calculation_V2.unsteady_flow_core import Unsteady_flow_core
from schemas.unsteady_flow_ws_scheme import (
    Recieved_element,
    Response_element,
    Cond_params,
    One_section_response,
    Pump_params,
    Gate_valve_params,
    Safe_valve_params,
)
from typing import Literal
from functools import reduce
import math
from services.Utils.stack import Stack


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
    _pipeline: dict[str, Recieved_element]

    def _make_initial_distribution(
        self, pipeline: dict[str, Recieved_element]
    ) -> dict[str, Response_element]:

        initial_distribution = {}
        start_element_id = reduce(
            self.find_elements_without_parents, pipeline.values(), []
        )[0]
        current_node = pipeline[start_element_id]
        current_x = 0
        visited_nodes: set[str] = set()
        stack = Stack()
        while True:
            res_value: list[One_section_response] = []

            for i in range(self.get_iters_count(current_node)):
                res_value.append(One_section_response(x=current_x, p=0, V=0, H=0))
                if (
                    current_node.value.type == "pipe"
                    and i != self.get_iters_count(current_node) - 1
                ):
                    current_x += self._dx

            initial_distribution[current_node.id] = self.make_response_element(
                current_node=current_node, value=res_value
            )
            current_x += self._dx
            # Добавляем элемент в посещенные
            visited_nodes.add(current_node.id)

            dont_visited_neighbours = self.get_dont_visited_neighbours(
                current_node=current_node, visited_nodes=visited_nodes
            )
            # логика обхода
            if len(dont_visited_neighbours) == 0:
                if len(stack) == 0:
                    break
                else:
                    current_node = pipeline[stack.head()]
            elif len(dont_visited_neighbours) == 1:
                if not stack.is_empty() and current_node.id == stack.head():
                    stack.remove()
                current_node = pipeline[dont_visited_neighbours[0]]
            else:
                stack.add(current_node.id)
                current_node = pipeline[dont_visited_neighbours[0]]

            # if len(current_node.children) == 0:  # Тут поменять
            #     break
            # current_node = pipeline[current_node.children[0]]  # Тут поменять
        return initial_distribution

    def _select_solve_method(self, current_node):
        current_element = current_node.value
        if current_element.type == "provider":
            element_result = self.__provider_method(
                current_node,
                child_element=self._prev_res[current_node.children[0]].value,
            )
        elif current_element.type == "pipe":
            element_result = self.__pipe_method(
                current_node,
                child_element=self._prev_res[current_node.children[0]].value,
                parent_element=self._prev_res[current_node.parents[0]].value,
            )

        elif current_element.type == "pump":
            element_result = self.__pump_method(
                current_node,
                child_element=self._prev_res[current_node.children[0]].value,
                parent_element=self._prev_res[current_node.parents[0]].value,
            )

        elif current_element.type == "gate_valve":
            element_result = self.__gate_valve_method(
                current_node,
                child_element=self._prev_res[current_node.children[0]].value,
                parent_element=self._prev_res[current_node.parents[0]].value,
            )

        elif current_element.type == "safe_valve":
            element_result = self.__safe_valve_method(
                current_node,
                child_element=self._prev_res[current_node.children[0]].value,
                parent_element=self._prev_res[current_node.parents[0]].value,
            )

        elif current_element.type == "consumer":
            element_result = self.__consumer_method(
                current_node,
                parent_element=self._prev_res[current_node.parents[0]].value,
            )
        return element_result

    def __provider_method(
        self, current_node: Recieved_element, child_element: list[One_section_response]
    ) -> Response_element:
        current_element = current_node.value
        Jb = self.__find_Jb(child_element[0].p, child_element[0].V)
        if current_element.mode == "pressure":
            p = current_element.value * 1000
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

        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __pipe_method(
        self,
        current_node: Recieved_element,
        child_element: list[One_section_response],
        parent_element: list[One_section_response],
    ) -> Response_element:
        current_element = current_node.value

        self._current_diameter = current_element.diameter / 1000
        sections_number = int(current_element.length * 1000 / self._dx)
        response_value: list[One_section_response] = []

        def culc_one_section(
            prev_p, next_p, prev_V, next_V
        ) -> dict[Literal["p", "V", "H"], float]:
            Ja = self.__find_Ja(prev_p, prev_V)
            Jb = self.__find_Jb(next_p, next_V)
            p = (Ja + Jb) / 2
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
                    next_V=child_element[
                        0
                    ].V,  # next_V=child_element[0][current_node.id].V,
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

        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __pump_method(
        self,
        current_node: Recieved_element,
        child_element: list[One_section_response],
        parent_element: list[One_section_response],
    ) -> Response_element:
        current_element: Pump_params = current_node.value
        start_time = current_element.start_time
        duration = current_element.duration

        w = C.w0
        if current_element.mode == "open":  # Включение на tt сек
            if start_time <= self._current_time <= start_time + duration:
                w = C.w0 / duration * (self._current_time - start_time)
            elif self._current_time < start_time:
                w = 0
            else:
                w = C.w0
        elif current_element.mode == "close":  # Выключение на ttt сек
            if self._current_time < start_time:
                w = C.w0
            elif start_time <= self._current_time <= (start_time + duration):
                w = C.w0 - C.w0 / duration * (self._current_time - start_time)
            else:
                w = 0
        else:
            w = 0

        a = (
            w / C.w0
        ) ** 2 * current_element.coef_a  # 302.06   Характеристика насоса # b = 8 * 10 ** (-7)
        S = np.pi * (self._current_diameter / 2) ** 2
        Ja = self.__find_Ja(parent_element[-1].p, parent_element[-1].V)
        Jb = self.__find_Jb(child_element[0].p, child_element[0].V)
        V = (
            -C.c / C.g
            + (
                (C.c / C.g) ** 2
                - current_element.coef_b
                * (S * 3600) ** 2
                * ((Jb - Ja) / (self._density * C.g) - a)
            )
            ** 0.5
        ) / (current_element.coef_b * (S * 3600) ** 2)
        p1 = Ja - self._density * C.c * V
        p2 = Jb + self._density * C.c * V

        H1 = self.__count_H(p1, V)
        H2 = self.__count_H(p2, V)
        response_value = [
            One_section_response(x=self._current_x, p=p1, V=V, H=H1),
            One_section_response(x=self._current_x, p=p2, V=V, H=H2),
        ]
        self._current_x += self._dx
        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __gate_valve_method(
        self,
        current_node: Recieved_element,
        child_element: list[One_section_response],
        parent_element: list[One_section_response],
    ) -> Response_element:
        current_element: Gate_valve_params = current_node.value
        start_time = current_element.start_time
        duration = current_element.duration
        procent = current_element.percentage

        def find_zet(nu):
            if 0 <= nu < 10:
                zet = (0.32 / 10) * nu + 0.04
            elif 10 <= nu < 20:
                zet = (1.6 - 0.36) / 10 * (nu - 10) + 0.36
            elif 20 <= nu < 30:
                zet = (5 - 1.6) / 10 * (nu - 20) + 1.6
            elif 30 <= nu < 40:
                zet = (15 - 5) / 10 * (nu - 30) + 5
            elif 40 <= nu < 50:
                zet = (42.5 - 15) / 10 * (nu - 40) + 15
            elif 50 <= nu < 60:
                zet = (130 - 42.5) / 10 * (nu - 50) + 42.5
            elif 60 <= nu < 70:
                zet = (800 - 130) / 10 * (nu - 60) + 130
            elif 70 <= nu < 80:
                zet = (2500 - 800) / 10 * (nu - 70) + 800
            elif 80 <= nu < 85:
                zet = (6000 - 2500) / 10 * (nu - 80) + 2500
            else:  # 85 <= nu <= 100:
                zet = (10000000 - 6000) / 15 * (nu - 85) + 6000
            return zet

        nu = 0
        zet = find_zet(nu)
        if current_element.mode == "open":  # открытие на tt сек
            if start_time <= self._current_time <= (start_time + duration):
                nu = 100 - procent / duration * (self._current_time - start_time)
                zet = find_zet(nu)
            elif self._current_time < start_time:
                nu = 100
                zet = find_zet(nu)
            else:
                nu = 100 - procent
                zet = find_zet(nu)
        elif current_element.mode == "close":  # закрытие на ttt сек
            if self._current_time < start_time:
                nu = 0
                zet = find_zet(nu)
            elif start_time <= self._current_time <= (start_time + duration):
                nu = procent / duration * (self._current_time - start_time)
                zet = find_zet(nu)
            else:
                nu = procent
                zet = find_zet(nu)
        else:
            nu = 100
            zet = find_zet(nu)

        Ja = self.__find_Ja(parent_element[-1].p, parent_element[-1].V)
        Jb = self.__find_Jb(child_element[0].p, child_element[0].V)
        V = (
            -2 * C.c * self._density
            + (
                abs(
                    4 * (self._density * C.c) ** 2 - 2 * zet * self._density * (Jb - Ja)
                )
            )
            ** 0.5
        ) / (zet * self._density)
        if (4 * (self._density * C.c) ** 2 - 2 * zet * self._density * (Jb - Ja)) < 0:
            V = -V
        else:
            V = V
        p1 = Ja - self._density * C.c * V
        p2 = Jb + self._density * C.c * V

        H1 = self.__count_H(p1, V)
        H2 = self.__count_H(p2, V)
        response_value = [
            One_section_response(x=self._current_x, p=p1, V=V, H=H1),
            One_section_response(x=self._current_x, p=p2, V=V, H=H2),
        ]
        self._current_x += self._dx
        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __safe_valve_method(
        self,
        current_node: Recieved_element,
        child_element: list[One_section_response],
        parent_element: list[One_section_response],
    ) -> Response_element:
        current_element: Safe_valve_params = current_node.value
        p_otkr = current_element.max_pressure
        Kvmax = current_element.coef_q
        Ja = self.__find_Ja(parent_element[-1].p, parent_element[-1].V)
        Jb = self.__find_Jb(child_element[0].p, child_element[0].V)
        p = (Ja + Jb) / (2)
        V = (Ja - Jb) / (2 * self._density * C.c)
        H = self.__count_H(p, V)
        response_value: list[One_section_response]
        if p < p_otkr:
            response_value = [
                One_section_response(x=self._current_x, p=p, V=V, H=H),
                One_section_response(x=self._current_x, p=p, V=V, H=H),
            ]
        else:
            p_poln_otkr = 1.3 * p_otkr
            p = 10**5
            S1 = math.pi * self._current_diameter**2 / 4
            next_diameter = self.find_next_pipe_diameter(
                pipeline=self._pipeline, start_element_id=current_node.id
            )
            S2 = math.pi * next_diameter**2 / 4
            A_param = ((S1 + S2) / self._density / C.c) ** 2  # Коэфициенты неправильные
            B_param = (
                -(2 * (Ja * S1 + Jb * S2) * (S1 + S2)) / self._density**2 / C.c**2
                - 2 * Kvmax**2 / self._density
            )
            C_param = (
                (Ja * S1 + Jb * S2) / self._density / C.c
            ) ** 2 + 2 * Kvmax**2 * p / self._density

            D = B_param**2 - 4 * A_param * C_param
            p = (-B_param - D**0.5) / 2 / A_param

            if p >= p_poln_otkr:
                V1 = (Ja - p) / self._density / C.c
                V2 = (-Jb + p) / self._density / C.c
                H1 = self.__count_H(p, V1)
                H2 = self.__count_H(p, V2)
                response_value = [
                    One_section_response(x=self._current_x, p=p, V=V1, H=H1),
                    One_section_response(x=self._current_x, p=p, V=V2, H=H2),
                ]
            else:
                # k =(pp-p_otkr)/( p_poln_otkr-p_otkr) * Kvmax
                def F12(Pm):
                    def F1(Pm):
                        return (Ja - Pm) / self._density / C.c * S1 + (
                            Pm - Jb
                        ) / self._density / C.c * S2

                    def F2(Pm):
                        return (
                            (Pm - p_otkr)
                            / (p_poln_otkr - p_otkr)
                            * Kvmax
                            * ((2 * Pm - 10**5) / self._density) ** 0.5
                        )

                    return F1(Pm) - F2(Pm)

                def find_root(f, a, b, eps):
                    while abs(b - a) > eps:
                        c = (a + b) / 2.0
                        if f(a) * f(c) < 0:
                            b = c
                        else:
                            a = c
                    return (a + b) / 2.0

                p = find_root(F12, p_otkr, p_poln_otkr, 3 * 10**3)

                k = (p - p_otkr) / (p_poln_otkr - p_otkr)
                V1 = (Ja - p) / self._density / C.c
                V2 = (-Jb + p) / self._density / C.c
                H1 = self.__count_H(p, V1)
                H2 = self.__count_H(p, V2)
                response_value = [
                    One_section_response(x=self._current_x, p=p, V=V1, H=H1),
                    One_section_response(x=self._current_x, p=p, V=V2, H=H2),
                ]
        self._current_x += self._dx
        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __consumer_method(
        self, current_node: Recieved_element, parent_element: list[One_section_response]
    ) -> Response_element:
        current_element = current_node.value
        Ja = self.__find_Ja(parent_element[-1].p, parent_element[-1].V)
        if current_element.mode == "pressure":
            p = current_element.value * 1000
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
        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __find_lyam(self, Re: int, eps: float):
        # print(
        #     f"""
        #   eps: {eps}
        #   Re: {Re}
        # """
        # )
        lyam: float
        if Re == 0:
            return 0
        if Re < 2320:
            lyam = 64 / Re
            if lyam > 0.1:  # TODO Обратить внимание
                lyam = 0.1
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
        Re = abs(Vjb) * self._current_diameter / self._viscosity
        lyamjb = self.__find_lyam(Re, C.o / self._current_diameter)
        # print(
        #     f"""
        #   lyamjb: {lyamjb}
        # """
        # )
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
            + self._dt
            * self._density
            * C.c
            * C.g
            * (
                self._vis_otm[self._vis_otm_iter + 1]
                - self._vis_otm[self._vis_otm_iter]
            )
            / self._dx
        )
        return Jb

    def __find_Ja(self, p: float, V: float):
        Vja = V
        Re = abs(Vja) * self._current_diameter / self._viscosity
        lyamja = self.__find_lyam(Re, C.o / self._current_diameter)
        # print(
        #     f"""
        #   lyamja: {lyamja}
        # """
        # )
        Ja = (
            p
            + self._density * C.c * Vja
            - lyamja
            * self._density
            * Vja
            * abs(Vja)
            * self._dt
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
            / self._dx
        )
        return Ja
