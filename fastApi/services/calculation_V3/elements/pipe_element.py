import pprint
from services.calculation_V3.elements.abstractions import AbstractElement
from schemas.unsteady_flow_ws_scheme import (
    One_section_response,
    Response_element,
    Result_unsteady_data,
)
from typing import Literal
from services.calculation_V3.constants import Constants as C


class Pipe_Element(AbstractElement):

    def unsteady_solve(self, prev_res: Result_unsteady_data) -> Response_element:
        prev_self_res = prev_res.moment_result[self.id].value
        hydraulics = self.hydraulics
        current_element = self.value
        child_id = self.child_id
        parent_id = self.parent_id
        child_res = prev_res.moment_result[child_id].value[0][self.id]
        parent_res = prev_res.moment_result[parent_id].value[-1][self.id]
        diameter = self.diameter
        # logging.info(f"current_diameter: {self._current_diameter}")
        sections_number = int(current_element.length * 1000 / self.hydraulics.dx)
        response_value: list[One_section_response] = []

        def culc_one_section(
            prev_p, next_p, prev_V, next_V
        ) -> dict[Literal["p", "V", "H"], float]:
            Ja = hydraulics.find_Ja(prev_p, prev_V, diameter)
            Jb = hydraulics.find_Jb(next_p, next_V, diameter)
            p = (Ja + Jb) / 2
            V = (Ja - Jb) / (2 * hydraulics.density * C.c)
            H = hydraulics.count_H(p, V)
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
                    prev_p=parent_res.p,
                    prev_V=parent_res.V,
                    next_p=prev_self_res[i + 1][self.id].p,
                    next_V=prev_self_res[i + 1][self.id].V,
                )
                response_value.append(
                    {
                        self.id: One_section_response(
                            x=prev_self_res[i][self.id].x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                        parent_id: One_section_response(
                            x=prev_self_res[i][self.id].x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                    }
                )
            elif i == sections_number - 1:
                one_section_res = culc_one_section(
                    prev_p=prev_self_res[i - 1][self.id].p,
                    prev_V=prev_self_res[i - 1][self.id].V,
                    next_p=child_res.p,
                    next_V=child_res.V,  # next_V=child_res[0][self.id].V,
                )
                response_value.append(
                    {
                        self.id: One_section_response(
                            x=prev_self_res[i][self.id].x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                        child_id: One_section_response(
                            x=prev_self_res[i][self.id].x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                    }
                )
            else:
                one_section_res = culc_one_section(
                    prev_p=prev_self_res[i - 1][self.id].p,
                    prev_V=prev_self_res[i - 1][self.id].V,
                    next_p=prev_self_res[i + 1][self.id].p,
                    next_V=prev_self_res[i + 1][self.id].V,
                )
                response_value.append(
                    {
                        self.id: One_section_response(
                            x=prev_self_res[i][self.id].x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        )
                    }
                )

        return self.make_response_element(value=response_value)

    def make_initial_distribution(self, x, visited) -> Response_element:
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
        self.diameter = self.value.diameter / 1000

        current_element = self.value
        hydraulics = self.hydraulics
        sections_number = int(current_element.length * 1000 / hydraulics.dx)
        response_value: list[One_section_response] = []

        def culc_one_section() -> dict[Literal["p", "V", "H"], float]:
            p = 0
            V = 0
            H = 0
            return {"p": p, "V": V, "H": H}

        for i in range(sections_number + 1):
            if i == 0:
                one_section_res = culc_one_section()
                response_value.append(
                    {
                        self.id: One_section_response(
                            x=x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                        parent_id: One_section_response(
                            x=x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                    }
                )
            elif i == sections_number:
                one_section_res = culc_one_section()
                response_value.append(
                    {
                        self.id: One_section_response(
                            x=x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                        child_id: One_section_response(
                            x=x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        ),
                    }
                )
            else:
                one_section_res = culc_one_section()
                response_value.append(
                    {
                        self.id: One_section_response(
                            x=x,
                            p=one_section_res["p"],
                            V=one_section_res["V"],
                            H=one_section_res["H"],
                        )
                    }
                )

            x += self.hydraulics.dx
        return self.make_response_element(value=response_value)
