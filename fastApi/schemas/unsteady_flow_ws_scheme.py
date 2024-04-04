from pydantic import BaseModel, validator
from enum import Enum


class Unstedy_base_params(BaseModel):
    mode = "open" | "close"
    start_time = float
    duration = float


class Cond_params(BaseModel):
    time_to_iter: float
    density: float
    viscosity: float


class Boundary_params(BaseModel):
    type = "speed" | "pressure"
    vlaue = float


class Elements_model(BaseModel):
    class Pipe_params(BaseModel):
        length = float
        diameter = float

    class Pump_params(BaseModel, Unstedy_base_params):
        coef_a = float
        coef_b = float

    class Save_valve_params(BaseModel, Unstedy_base_params):
        coef_q = float
        max_pressure = float

    class Gate_valve_params(BaseModel):
        percentage = float

    type = "pipe" | "pump" | "gate_valve" | "save_valve"

    params = Pipe_params  # FIXME make params model depends on type field


class Unsteady_data(BaseModel):
    cond_params: Cond_params
    pipeline: list[Elements_model]
    boundary_params: Boundary_params
