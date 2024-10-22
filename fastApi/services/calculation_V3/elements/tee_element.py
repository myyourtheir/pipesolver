import logging
from services.calculation_V3.elements.abstractions import AbstractElement
from schemas.unsteady_flow_ws_scheme import One_section_response
import math
from services.calculation_V2.constants import Constants as C


class Tee_Element(AbstractElement):
    def unsteady_solve(self, prev_res):
        diameter1 = self.diameter_first
        diameter2 = self.diameter_second
        diameter3 = self.diameter_third
        S1: float = math.pi * diameter1**2 / 4
        S2: float = math.pi * diameter2**2 / 4
        S3: float = math.pi * diameter3**2 / 4

        prev_self_res = prev_res.moment_result[self.id].value
        prev_first_res = (
            prev_res.moment_result[self.first_neighbour_id].value[0][self.id]
            if prev_res.moment_result[self.first_neighbour_id].value[0].get(self.id)
            else prev_res.moment_result[self.first_neighbour_id].value[-1][self.id]
        )
        prev_second_res = (
            prev_res.moment_result[self.second_neighbour_id].value[0][self.id]
            if prev_res.moment_result[self.second_neighbour_id].value[0].get(self.id)
            else prev_res.moment_result[self.second_neighbour_id].value[-1][self.id]
        )
        prev_third_res = (
            prev_res.moment_result[self.third_neighbour_id].value[0][self.id]
            if prev_res.moment_result[self.third_neighbour_id].value[0].get(self.id)
            else prev_res.moment_result[self.third_neighbour_id].value[-1][self.id]
        )
        Ja, i = self.calculate_invariant_and_sign_in_the_tee(
            self.first_neighbour_id, prev_first_res, diameter1
        )
        Jb, j = self.calculate_invariant_and_sign_in_the_tee(
            self.second_neighbour_id, prev_second_res, diameter2
        )
        Jc, k = self.calculate_invariant_and_sign_in_the_tee(
            self.third_neighbour_id, prev_third_res, diameter3
        )
        # fmt: off
        V1 = (Ja*(S2+S3)-Jb*S2-Jc*S3)/(i*self.hydraulics.density*C.c*(S1+S2+S3))
        V2=(-Ja*S1+Jb*(S1+S3)-Jc*S3)/(j*self.hydraulics.density*C.c*(S1+S2+S3))
        V3=(-Ja*S1-Jb*S2+Jc*(S1+S2))/(k*self.hydraulics.density*C.c*(S1+S2+S3))
        p=Ja-i*self.hydraulics.density*C.c*V1
        H1=self.hydraulics.count_H(p=p, V=V1)
        H2=self.hydraulics.count_H(p=p, V=V2)
        H3=self.hydraulics.count_H(p=p, V=V3)
        response_value = [{
                self.first_neighbour_id:
                One_section_response(
                    x=prev_self_res[-1][self.first_neighbour_id].x,
                    p=p,
                    V=V1,
                    H=H1,
                ),
                self.second_neighbour_id:
                One_section_response(
                    x=prev_self_res[-1][self.first_neighbour_id].x,
                    p=p,
                    V=V2,
                    H=H2,
                ),
                self.third_neighbour_id:
                One_section_response(
                    x=prev_self_res[-1][self.first_neighbour_id].x,
                    p=p,
                    V=V3,
                    H=H3,
                ),
            }]
        return self.make_response_element(value=response_value)
        # fmt: on

    def calculate_invariant_and_sign_in_the_tee(
        self, neighbour_id: str, neighbour_res: One_section_response, diameter: float
    ):
        if neighbour_id in self.visited:
            J = self.hydraulics.find_Ja(
                p=neighbour_res.p,
                V=neighbour_res.V,
                diameter=diameter,
            )
            sign = 1
        else:
            J = self.hydraulics.find_Jb(
                p=neighbour_res.p,
                V=neighbour_res.V,
                diameter=diameter,
            )
            sign = -1
        return J, sign

    def make_initial_distribution(self, x, visited):
        self.visited = visited
        first_neighbour_id = self.neighbours[0]
        second_neighbour_id = self.neighbours[1]
        third_neighbour_id = self.neighbours[2]
        self.first_neighbour_id = first_neighbour_id
        self.second_neighbour_id = second_neighbour_id
        self.third_neighbour_id = third_neighbour_id
        self.diameter_first = (
            self.all_elements[first_neighbour_id].value.diameter / 1000
        )
        self.diameter_second = (
            self.all_elements[second_neighbour_id].value.diameter / 1000
        )
        self.diameter_third = (
            self.all_elements[third_neighbour_id].value.diameter / 1000
        )
        response_value = [
            {
                first_neighbour_id: One_section_response(
                    x=x,
                    p=0,
                    V=0,
                    H=0,
                ),
                second_neighbour_id: One_section_response(
                    x=x,
                    p=0,
                    V=0,
                    H=0,
                ),
                third_neighbour_id: One_section_response(
                    x=x,
                    p=0,
                    V=0,
                    H=0,
                ),
            }
        ]
        return self.make_response_element(value=response_value)
