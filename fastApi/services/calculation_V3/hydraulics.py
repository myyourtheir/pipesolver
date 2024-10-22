from  services.calculation_V2.constants import Constants as C


class Hydraulics:
    _vis_otm = 0

    def __init__(self, density, viscosity, dt, dx):
        self.density = density
        self.dt = dt
        self.viscosity = viscosity
        self.dx = dx

    def find_lyam(self, Re: int, eps: float):
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

    def count_H(
        self,
        p: float,
        V: float,
    ):
        return p / (self.density * C.g) + self._vis_otm + (V**2) / (2 * C.g)

    def find_Jb(self, p: float, V: float, diameter):
        Vjb = V
        Re = abs(Vjb) * diameter / self.viscosity
        lyamjb = self.find_lyam(Re, C.o / diameter)
        # print(
        #     f"""
        #   lyamjb: {lyamjb}
        # """
        # )
        Jb = (
            p
            - self.density * C.c * Vjb
            + lyamjb * self.density * Vjb * abs(Vjb) * self.dt * C.c / (2 * diameter)
            + self.dt
            * self.density
            * C.c
            * C.g
            * (self._vis_otm - self._vis_otm)
            / self.dx
        )
        return Jb

    def find_Ja(self, p: float, V: float, diameter):
        Vja = V
        Re = abs(Vja) * diameter / self.viscosity
        lyamja = self.find_lyam(Re, C.o / diameter)
        # print(
        #     f"""
        #   lyamja: {lyamja}
        # """
        # )
        Ja = (
            p
            + self.density * C.c * Vja
            - lyamja * self.density * Vja * abs(Vja) * self.dt * C.c / (2 * diameter)
            - self.dt
            * self.density
            * C.c
            * C.g
            * (self._vis_otm - self._vis_otm)
            / self.dx
        )
        return Ja
