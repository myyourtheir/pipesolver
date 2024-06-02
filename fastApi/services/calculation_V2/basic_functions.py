from services.calculation_V2.constants import Constants as C
from services.calculation_V2.vis_otm import Vis_otm
from schemas.unsteady_flow_ws_scheme import (
    Response_element,
    Provider,
    Consumer,
    Pipe_params,
    Pump_params,
    Gate_valve_params,
    Safe_valve_params,
    Cond_params,
)


class Basic_functions(Vis_otm):
    _current_time: float = 0
    _vis_otm_iter: int = 0
    _cond_params: Cond_params

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

    def __count_H(self, p: float, V: float, ro: float):
        return p / (ro * C.g) + self._vis_otm[self._vis_otm_iter] + (V**2) / (2 * C.g)

    def __find_Jb(
        self, Davleniye: float, Skorost: float, d: float, v: float, ro: float
    ):
        Vjb = Skorost
        Re = abs(Vjb) * d / v
        lyamjb = self.__find_lyam(Re, C.o / d)
        Jb = (
            Davleniye
            - ro * C.c * Vjb
            + lyamjb * ro * Vjb * abs(Vjb) * self._current_time * C.c / (2 * d)
            + self.T
            * ro
            * C.c
            * C.g
            * (
                self._vis_otm[self._vis_otm_iter + 1]
                - self._vis_otm[self._vis_otm_iter]
            )
            / 1000
        )
        return Jb

    def __find_Ja(
        self, Davleniye: float, Skorost: float, d: float, v: float, ro: float
    ):
        Vja = Skorost
        Re = abs(Vja) * d / v
        lyamja = self.__find_lyam(Re, C.o / d)
        Ja = (
            Davleniye
            + ro * C.c * Vja
            - lyamja * ro * Vja * abs(Vja) * self._current_time * C.c / (2 * d)
            - self.T
            * ro
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
        self, element: Provider, child: Response_element
    ) -> Response_element:
        Jb = self.__find_Jb(P[-1][i + 1], V[-1][i + 1], d, i, v, ro, T)
        if element.mode == "pressure":
            p = element.value
            V = (pp - Jb) / (ro * c)
        else:
            if p_V_const == 0:
                p_V_const += 10 ** (-6)
            VV = p_V_const
            pp = Jb + ro * c * VV
        H = count_H(pp, i, VV, ro)
        return [pp, VV, H]

    def _pipe_method(self) -> Response_element:
        pass

    def _pump_method(self) -> Response_element:
        pass

    def _gate_valve_method(self) -> Response_element:
        pass

    def _safe_valve_method(self) -> Response_element:
        pass

    def _consumer_method(self) -> Response_element:
        pass
