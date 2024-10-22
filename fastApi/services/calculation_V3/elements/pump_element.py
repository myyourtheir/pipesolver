import pprint
from services.calculation_V3.elements.abstractions import AbstractElement
from schemas.unsteady_flow_ws_scheme import (
    One_section_response,
    Response_element,
    Result_unsteady_data,
)
from services.calculation_V2.constants import Constants as C
import numpy as np


class Pump_Element(AbstractElement):

    def unsteady_solve(self, prev_res: Result_unsteady_data) -> Response_element:
        hydraulics = self.hydraulics
        current_element = self.value
        child_id = self.child_id
        parent_id = self.parent_id
        prev_self_res = prev_res.moment_result[self.id].value
        child_res = prev_res.moment_result[child_id].value[0][self.id]
        parent_res = prev_res.moment_result[parent_id].value[-1][self.id]

        current_time = prev_res.t + hydraulics.dt
        start_time = current_element.start_time
        duration = current_element.duration

        w = C.w0
        if current_element.mode == "open":  # Включение на tt сек
            if start_time <= current_time <= start_time + duration:
                w = C.w0 / duration * (current_time - start_time)
            elif current_time < start_time:
                w = 0
            else:
                w = C.w0
        elif current_element.mode == "close":  # Выключение на ttt сек
            if current_time < start_time:
                w = C.w0
            elif start_time <= current_time <= (start_time + duration):
                w = C.w0 - C.w0 / duration * (current_time - start_time)
            else:
                w = 0
        else:
            w = 0

        a = (
            w / C.w0
        ) ** 2 * current_element.coef_a  # 302.06   Характеристика насоса # b = 8 * 10 ** (-7)
        S = np.pi * (self.diameter_parent / 2) ** 2
        Ja = hydraulics.find_Ja(parent_res.p, parent_res.V, self.diameter_parent)
        Jb = hydraulics.find_Jb(child_res.p, child_res.V, self.diameter_child)
        V = (
            -C.c / C.g
            + (
                (C.c / C.g) ** 2
                - current_element.coef_b
                * (S * 3600) ** 2
                * ((Jb - Ja) / (self.hydraulics.density * C.g) - a)
            )
            ** 0.5
        ) / (current_element.coef_b * (S * 3600) ** 2)
        p1 = Ja - hydraulics.density * C.c * V
        p2 = Jb + hydraulics.density * C.c * V

        H1 = self.hydraulics.count_H(p1, V)
        H2 = self.hydraulics.count_H(p2, V)
        response_value = [
            {
                parent_id: One_section_response(
                    x=prev_self_res[0][parent_id].x,
                    p=p1,
                    V=V,
                    H=H1,
                )
            },
            {
                child_id: One_section_response(
                    x=prev_self_res[0][parent_id].x,
                    p=p2,
                    V=V,
                    H=H2,
                )
            },
        ]
        return self.make_response_element(value=response_value)

    def make_initial_distribution(self, x, visited):
        parent_id = (
            self.neighbours[1] if self.neighbours[1] in visited else self.neighbours[0]
        )
        child_id = (
            self.neighbours[0]
            if self.neighbours[0] != parent_id
            else self.neighbours[1]
        )
        self.child_id = child_id
        self.parent_id = parent_id
        self.diameter_child = self.all_elements[child_id].value.diameter / 1000
        self.diameter_parent = self.all_elements[parent_id].value.diameter / 1000
        response_value = [
            {
                parent_id: One_section_response(
                    x=x,
                    p=0,
                    V=0,
                    H=0,
                ),
                child_id: One_section_response(
                    x=x,
                    p=0,
                    V=0,
                    H=0,
                ),
            },
        ]
        return self.make_response_element(value=response_value)
