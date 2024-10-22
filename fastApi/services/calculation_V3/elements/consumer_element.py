from services.calculation_V3.elements.abstractions import AbstractElement
from services.calculation_V2.constants import Constants as C
from schemas.unsteady_flow_ws_scheme import One_section_response


class Consumer_Element(AbstractElement):
    def unsteady_solve(self, prev_res):
        prev_self_res = prev_res.moment_result[self.id].value
        neighbor_id = self.neighbours[0]
        neighbor_result = prev_res.moment_result[neighbor_id].value[-1][self.id]
        current_element = self.value
        hidraulics = self.hydraulics
        Ja = hidraulics.find_Ja(neighbor_result.p, neighbor_result.V, self.diameter)
        if current_element.mode == "pressure":
            p = current_element.value * 1000
            V = (Ja - p) / (hidraulics.density * C.c)
        else:
            if current_element.value == 0:
                V = 10 ** (-6)
            else:
                V = current_element.value
            p = Ja - hidraulics.density * C.c * V
        H = hidraulics.count_H(p, V)
        response_value = [
            {
                neighbor_id: One_section_response(
                    x=prev_self_res[0][neighbor_id].x,
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
        return self.make_response_element(value=response_value)

    def make_initial_distribution(self, x, visited):
        neighbour_id = self.neighbours[0]
        self.diameter = self.all_elements[neighbour_id].value.diameter / 1000
        response_value = [
            {
                neighbour_id: One_section_response(
                    x=x,
                    p=0,
                    V=0,
                    H=0,
                )
            },
        ]
        return self.make_response_element(value=response_value)
