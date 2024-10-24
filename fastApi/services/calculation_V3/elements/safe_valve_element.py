import math
from services.calculation_V3.elements.abstractions import AbstractElement
from services.calculation_V2.constants import Constants as C
from schemas.unsteady_flow_ws_scheme import One_section_response


class Safe_Valve_Element(AbstractElement):
    def unsteady_solve(self, prev_res):
        hydraulics = self.hydraulics
        current_element = self.value
        child_id = self.child_id
        parent_id = self.parent_id
        prev_self_res = prev_res.moment_result[self.id].value
        child_res = prev_res.moment_result[child_id].value[0][self.id]
        parent_res = prev_res.moment_result[parent_id].value[-1][self.id]
        p_otkr = current_element.max_pressure
        Kvmax = current_element.coef_q
        Ja = hydraulics.find_Ja(parent_res.p, parent_res.V, self.diameter_parent)
        Jb = hydraulics.find_Jb(child_res.p, child_res.V, self.diameter_child)
        p = (Ja + Jb) / (2)
        V = (Ja - Jb) / (2 * hydraulics.density * C.c)
        H = hydraulics.count_H(p, V)
        if p < p_otkr:
            response_value = [
                {
                    parent_id: One_section_response(
                        x=prev_self_res[0][parent_id].x,
                        p=p,
                        V=V,
                        H=H,
                    )
                },
                {
                    child_id: One_section_response(
                        x=prev_self_res[0][parent_id].x,
                        p=p,
                        V=V,
                        H=H,
                    )
                },
            ]
        else:
            p_poln_otkr = 1.3 * p_otkr
            p = 10**5
            S1 = math.pi * self.diameter_parent**2 / 4

            S2 = math.pi * self.diameter_child**2 / 4
            A_param = (
                (S1 + S2) / hydraulics.density / C.c
            ) ** 2  # Коэфициенты неправильные
            B_param = (
                -(2 * (Ja * S1 + Jb * S2) * (S1 + S2)) / hydraulics.density**2 / C.c**2
                - 2 * Kvmax**2 / hydraulics.density
            )
            C_param = (
                (Ja * S1 + Jb * S2) / hydraulics.density / C.c
            ) ** 2 + 2 * Kvmax**2 * p / hydraulics.density

            D = B_param**2 - 4 * A_param * C_param
            p = (-B_param - D**0.5) / 2 / A_param

            if p >= p_poln_otkr:
                V1 = (Ja - p) / hydraulics.density / C.c
                V2 = (-Jb + p) / hydraulics.density / C.c
                H1 = hydraulics.count_H(p, V1)
                H2 = hydraulics.count_H(p, V2)
                response_value = [
                    {
                        parent_id: One_section_response(
                            x=prev_self_res[0][parent_id].x,
                            p=p,
                            V=V1,
                            H=H1,
                        )
                    },
                    {
                        child_id: One_section_response(
                            x=prev_self_res[0][parent_id].x,
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
                        return (Ja - Pm) / hydraulics.density / C.c * S1 + (
                            Pm - Jb
                        ) / hydraulics.density / C.c * S2

                    def F2(Pm):
                        return (
                            (Pm - p_otkr)
                            / (p_poln_otkr - p_otkr)
                            * Kvmax
                            * ((2 * Pm - 10**5) / hydraulics.density) ** 0.5
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
                V1 = (Ja - p) / hydraulics.density / C.c
                V2 = (-Jb + p) / hydraulics.density / C.c
                H1 = hydraulics.count_H(p, V1)
                H2 = hydraulics.count_H(p, V2)
                response_value = [
                    {
                        parent_id: One_section_response(
                            x=prev_self_res[0][parent_id].x,
                            p=p,
                            V=V1,
                            H=H1,
                        )
                    },
                    {
                        child_id: One_section_response(
                            x=prev_self_res[0][parent_id].x,
                            p=p,
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
