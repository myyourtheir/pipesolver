from services.calculation_V3.elements.abstractions import AbstractElement
from services.calculation_V2.constants import Constants as C
from schemas.unsteady_flow_ws_scheme import (
    One_section_response,
    Result_unsteady_data,
)


class Provider_Element(AbstractElement):
    def unsteady_solve(self, prev_res: Result_unsteady_data):
        neighbor_id = self.neighbours[0]
        prev_self_res = prev_res.moment_result[self.id].value
        prev_neighbor_results = prev_res.moment_result[neighbor_id].value
        neighbor_result = (
            prev_neighbor_results[-1][self.id]
            if prev_neighbor_results[-1].get(self.id)
            else prev_neighbor_results[0][self.id]
        )
        current_element = self.value
        hidraulics = self.hydraulics
        Jb = hidraulics.find_Jb(
            neighbor_result.p,
            neighbor_result.V,
            self.diameter,
            #                         ^ тут может быть последний индекс    ^
        )
        if current_element.mode == "pressure":
            p = current_element.value * 1000
            V = (p - Jb) / (hidraulics.density * C.c)
        else:
            if current_element.value == 0:
                V = 10 ** (-6)
            else:
                V = current_element.value
            p = Jb + hidraulics.density * C.c * V
        H = hidraulics.count_H(p, V)
        response_value = [
            {
                neighbor_id: One_section_response(
                    x=prev_self_res[-1][neighbor_id].x,
                    p=p,
                    V=V,
                    H=H,
                )
            }
        ]

        return self.make_response_element(value=response_value)

    def make_initial_distribution(self, x, visited):
        self.diameter = self.all_elements[self.neighbours[0]].value.diameter / 1000
        response_value = [
            {
                self.neighbours[0]: One_section_response(
                    x=x,  # TODO что-то сделать с x
                    p=0,
                    V=0,
                    H=0,
                )
            }
        ]

        return self.make_response_element(value=response_value)
