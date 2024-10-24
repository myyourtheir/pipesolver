from services.calculation_V3.elements.abstractions import AbstractElement
from services.calculation_V2.constants import Constants as C
from schemas.unsteady_flow_ws_scheme import One_section_response


class Gate_Valve_Element(AbstractElement):
    def unsteady_solve(self, prev_res):
        hydraulics = self.hydraulics
        current_element = self.value
        child_id = self.child_id
        parent_id = self.parent_id
        prev_self_res = prev_res.moment_result[self.id].value
        child_res = prev_res.moment_result[child_id].value[0][self.id]
        parent_res = prev_res.moment_result[parent_id].value[-1][self.id]
        procent = self.value.percentage
        current_time = prev_res.t + hydraulics.dt
        start_time = current_element.start_time
        duration = current_element.duration

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
            if start_time <= current_time <= (start_time + duration):
                nu = 100 - procent / duration * (current_time - start_time)
                zet = find_zet(nu)
            elif current_time < start_time:
                nu = 100
                zet = find_zet(nu)
            else:
                nu = 100 - procent
                zet = find_zet(nu)
        elif current_element.mode == "close":  # закрытие на ttt сек
            if current_time < start_time:
                nu = 0
                zet = find_zet(nu)
            elif start_time <= current_time <= (start_time + duration):
                nu = procent / duration * (current_time - start_time)
                zet = find_zet(nu)
            else:
                nu = procent
                zet = find_zet(nu)
        else:
            nu = 100
            zet = find_zet(nu)

        Ja = hydraulics.find_Ja(parent_res.p, parent_res.V, self.diameter_parent)
        Jb = hydraulics.find_Jb(child_res.p, child_res.V, self.diameter_child)
        V = (
            -2 * C.c * hydraulics.density
            + (
                abs(
                    4 * (hydraulics.density * C.c) ** 2
                    - 2 * zet * hydraulics.density * (Jb - Ja)
                )
            )
            ** 0.5
        ) / (zet * hydraulics.density)
        if (
            4 * (hydraulics.density * C.c) ** 2
            - 2 * zet * hydraulics.density * (Jb - Ja)
        ) < 0:
            V = -V
        else:
            V = V
        p1 = Ja - hydraulics.density * C.c * V
        p2 = Jb + hydraulics.density * C.c * V

        H1 = hydraulics.count_H(p1, V)
        H2 = hydraulics.count_H(p2, V)
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
