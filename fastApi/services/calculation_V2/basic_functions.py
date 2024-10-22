import numpy as np
from services.calculation_V2.constants import Constants as C
from services.calculation_V2.vis_otm import Vis_otm
from services.calculation_V2.unsteady_flow_core import Unsteady_flow_core
from schemas.unsteady_flow_ws_scheme import (
    Recieved_element,
    Response_element,
    Cond_params,
    ExtendedOneSectionResponse,
    One_section_response,
    Pump_params,
    Gate_valve_params,
    Safe_valve_params,
)
from typing import Literal, Union
from functools import reduce
import math
from pprint import pprint
import logging


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
    _visited_nodes: set[str] = set()

    def _select_solve_method(self, current_node: Recieved_element):
        current_element = current_node.value

        neighbors = self.get_neighbors_of_node(node=current_node)
        dont_visited_neighbors = self.get_dont_visited_neighbors(
            current_node=current_node, visited_nodes=self._visited_nodes
        )
        visited_neighbor = np.setxor1d(neighbors, dont_visited_neighbors)

        if current_element.type == "provider":
            element_result = self.__provider_method(
                current_node,
                child_node=self._prev_res[neighbors[0]],
            )
        elif current_element.type == "pipe":
            child_id, parent_id = self.extract_orientation_child_parent(
                current_node, self._visited_nodes
            )
            element_result = self.__pipe_method(
                current_node,
                child_node=self._prev_res[child_id],
                parent_node=self._prev_res[parent_id],
            )

        elif current_element.type == "pump":
            child_id, parent_id = self.extract_orientation_child_parent(
                current_node, self._visited_nodes
            )
            element_result = self.__pump_method(
                current_node,
                child_node=self._prev_res[child_id],
                parent_node=self._prev_res[parent_id],
            )

        elif current_element.type == "gate_valve":
            child_id, parent_id = self.extract_orientation_child_parent(
                current_node, self._visited_nodes
            )
            element_result = self.__gate_valve_method(
                current_node,
                child_node=self._prev_res[child_id],
                parent_node=self._prev_res[parent_id],
            )

        elif current_element.type == "safe_valve":
            child_id, parent_id = self.extract_orientation_child_parent(
                current_node, self._visited_nodes
            )
            element_result = self.__safe_valve_method(
                current_node,
                child_node=self._prev_res[child_id],
                parent_node=self._prev_res[parent_id],
            )

        elif current_element.type == "consumer":
            neighbors = self.get_neighbors_of_node(node=current_node)
            element_result = self.__consumer_method(
                current_node,
                parent_node=self._prev_res[neighbors[0]],
            )
        elif current_element.type == "tee":
            visited_node = [node for node in neighbors if node in self._visited_nodes]
            neighbors.remove(visited_node[0])
            element_result = self.__tee_method(
                current_node=current_node,
                first_neighbor_node=self._prev_res[visited_node[0]],
                second_nieghbour_node=self._prev_res[neighbors[0]],
                third_neighbor_node=self._prev_res[neighbors[1]],
            )
        return element_result

    def __provider_method(
        self, current_node: Recieved_element, child_node: Response_element
    ) -> Response_element:
        child_element = (
            child_node.value[0]
            if child_node.value[0].get(current_node.id)
            else child_node.value[-1]
        )
        current_element = current_node.value
        Jb = self.__find_Jb(
            child_element[current_node.id].p,
            child_element[current_node.id].V,
            #                         ^ тут может быть последний индекс    ^
        )
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
        response_value = [
            {
                child_node.id: One_section_response(
                    x=self._current_x,
                    p=p,
                    V=V,
                    H=H,
                )
            }
        ]
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
        child_node: Response_element,
        parent_node: Response_element,
    ) -> Response_element:
        current_element = current_node.value
        child_element = child_node.value
        parent_element = parent_node.value

        self._current_diameter = current_element.diameter / 1000
        # logging.info(f"current_diameter: {self._current_diameter}")
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
                    prev_p=parent_element[-1][current_node.id].p,
                    prev_V=parent_element[-1][current_node.id].V,
                    next_p=self._prev_res[current_node.id]
                    .value[i + 1][current_node.id]
                    .p,
                    next_V=self._prev_res[current_node.id]
                    .value[i + 1][current_node.id]
                    .V,
                )
                response_value.append(
                    {
                        current_node.id: One_section_response(
                            x=self._current_x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                        parent_node.id: One_section_response(
                            x=self._current_x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                    }
                )
            elif i == sections_number - 1:
                one_section_res = culc_one_section(
                    prev_p=self._prev_res[current_node.id]
                    .value[i - 1][current_node.id]
                    .p,
                    prev_V=self._prev_res[current_node.id]
                    .value[i - 1][current_node.id]
                    .V,
                    next_p=child_element[0][current_node.id].p,
                    next_V=child_element[0][
                        current_node.id
                    ].V,  # next_V=child_element[0][current_node.id].V,
                )
                response_value.append(
                    {
                        current_node.id: One_section_response(
                            x=self._current_x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                        child_node.id: One_section_response(
                            x=self._current_x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                    }
                )
            else:
                one_section_res = culc_one_section(
                    prev_p=self._prev_res[current_node.id]
                    .value[i - 1][current_node.id]
                    .p,
                    prev_V=self._prev_res[current_node.id]
                    .value[i - 1][current_node.id]
                    .V,
                    next_p=self._prev_res[current_node.id]
                    .value[i + 1][current_node.id]
                    .p,
                    next_V=self._prev_res[current_node.id]
                    .value[i + 1][current_node.id]
                    .V,
                )
                response_value.append(
                    {
                        current_node.id: One_section_response(
                            x=self._current_x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        )
                    }
                )

            self._current_x += self._dx

        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __pump_method(
        self,
        current_node: Recieved_element,
        child_node: Response_element,
        parent_node: Response_element,
    ) -> Response_element:

        child_element = child_node.value
        parent_element = parent_node.value
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
        Ja = self.__find_Ja(
            parent_element[-1][current_node.id].p, parent_element[-1][current_node.id].V
        )
        Jb = self.__find_Jb(
            child_element[0][current_node.id].p, child_element[0][current_node.id].V
        )
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
            {
                parent_node.id: One_section_response(
                    x=self._current_x,
                    p=p1,
                    V=V,
                    H=H1,
                )
            },
            {
                child_node.id: One_section_response(
                    x=self._current_x,
                    p=p2,
                    V=V,
                    H=H2,
                )
            },
        ]
        self._current_x += self._dx
        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __gate_valve_method(
        self,
        current_node: Recieved_element,
        child_node: Response_element,
        parent_node: Response_element,
    ) -> Response_element:
        child_element = child_node.value
        parent_element = parent_node.value
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

        Ja = self.__find_Ja(
            parent_element[-1][current_node.id].p, parent_element[-1][current_node.id].V
        )
        Jb = self.__find_Jb(
            child_element[0][current_node.id].p, child_element[0][current_node.id].V
        )
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
            {
                parent_node.id: One_section_response(
                    x=self._current_x,
                    p=p1,
                    V=V,
                    H=H1,
                )
            },
            {
                child_node.id: One_section_response(
                    x=self._current_x,
                    p=p2,
                    V=V,
                    H=H2,
                )
            },
        ]
        self._current_x += self._dx
        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __safe_valve_method(
        self,
        current_node: Recieved_element,
        child_node: Response_element,
        parent_node: Response_element,
    ) -> Response_element:
        child_element = child_node.value
        parent_element = parent_node.value
        current_element: Safe_valve_params = current_node.value
        p_otkr = current_element.max_pressure
        Kvmax = current_element.coef_q
        Ja = self.__find_Ja(
            parent_element[-1][current_node.id].p, parent_element[-1][current_node.id].V
        )
        Jb = self.__find_Jb(
            child_element[0][current_node.id].p, child_element[0][current_node.id].V
        )
        p = (Ja + Jb) / (2)
        V = (Ja - Jb) / (2 * self._density * C.c)
        H = self.__count_H(p, V)
        if p < p_otkr:
            response_value = [
                {
                    parent_node.id: One_section_response(
                        x=self._current_x,
                        p=p,
                        V=V,
                        H=H,
                    )
                },
                {
                    child_node.id: One_section_response(
                        x=self._current_x,
                        p=p,
                        V=V,
                        H=H,
                    )
                },
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
                    {
                        parent_node.id: One_section_response(
                            x=self._current_x,
                            p=p,
                            V=V1,
                            H=H1,
                        )
                    },
                    {
                        child_node.id: One_section_response(
                            x=self._current_x,
                            p=p,
                            V=V2,
                            H=H2,
                        )
                    },
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
                    {
                        parent_node.id: One_section_response(
                            x=self._current_x,
                            p=p,
                            V=V1,
                            H=H1,
                        )
                    },
                    {
                        child_node.id: One_section_response(
                            x=self._current_x,
                            p=p,
                            V=V,
                            H=H2,
                        )
                    },
                ]
        self._current_x += self._dx
        return self.make_response_element(
            current_node=current_node, value=response_value
        )

    def __consumer_method(
        self, current_node: Recieved_element, parent_node: Response_element
    ) -> Response_element:
        parent_element = (
            parent_node.value[0]
            if parent_node.value[0].get(current_node.id)
            else parent_node.value[-1]
        )
        current_element = current_node.value
        Ja = self.__find_Ja(
            parent_element[current_node.id].p, parent_element[current_node.id].V
        )
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
        response_value = [
            {
                parent_node.id: One_section_response(
                    x=self._current_x,
                    p=p,
                    V=V,
                    H=H,
                )
            },
        ]
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

    def __tee_method(
        self,
        current_node: Recieved_element,
        first_neighbor_node: Response_element,
        second_nieghbour_node: Response_element,
        third_neighbor_node: Response_element,
    ) -> Response_element:
        Ja, i = self.calculate_invariant_and_sign_in_the_tee(
            current_node, first_neighbor_node
        )
        Jb, j = self.calculate_invariant_and_sign_in_the_tee(
            current_node, second_nieghbour_node
        )
        Jc, k = self.calculate_invariant_and_sign_in_the_tee(
            current_node, third_neighbor_node
        )
        # TODO Правильно посчитать площади
        diameter1 = self._pipeline[first_neighbor_node.id].value.diameter
        diameter2 = self._pipeline[second_nieghbour_node.id].value.diameter
        diameter3 = self._pipeline[third_neighbor_node.id].value.diameter
        S1: float = math.pi * diameter1**2 / 4
        S2: float = math.pi * diameter2**2 / 4
        S3: float = math.pi * diameter3**2 / 4
        # fmt: off
        V1 = (Ja*(S2+S3)-Jb*S2-Jc*S3)/(i*self._density*C.c*(S1+S2+S3))
        V2=(-Ja*S1+Jb*(S1+S3)-Jc*S3)/(j*self._density*C.c*(S1+S2+S3))
        V3=(-Ja*S1-Jb*S2+Jc*(S1+S2))/(k*self._density*C.c*(S1+S2+S3))
        p=Ja-i*self._density*C.c*V1
        H1=self.__count_H(p=p, V=V1)
        H2=self.__count_H(p=p, V=V2)
        H3=self.__count_H(p=p, V=V3)
        response_value = [{
                first_neighbor_node.id:
                One_section_response(
                    x=self._current_x,
                    p=p,
                    V=V1,
                    H=H1,
                ),
                second_nieghbour_node.id:
                One_section_response(
                    x=self._current_x,
                    p=p,
                    V=V2,
                    H=H2,
                ),
                third_neighbor_node.id:
                One_section_response(
                    x=self._current_x,
                    p=p,
                    V=V3,
                    H=H3,
                ),
            }]
        self._current_x += self._dx
        return self.make_response_element(current_node=current_node, value=response_value)
        # fmt: on

    def calculate_invariant_and_sign_in_the_tee(
        self, current_node: Recieved_element, neighbor_node: Response_element
    ):
        logging.info(
            f"current_node: {neighbor_node}  neighbor_node: {neighbor_node.id}"
        )
        if neighbor_node.id in self._visited_nodes:
            J = self.__find_Ja(
                p=neighbor_node.value[-1][current_node.id].p,
                V=neighbor_node.value[-1][current_node.id].V,
            )
            sign = 1
        else:
            J = self.__find_Jb(
                p=neighbor_node.value[0][current_node.id].p,
                V=neighbor_node.value[0][current_node.id].V,
            )
            sign = -1
        return J, sign

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
