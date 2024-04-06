from pydantic import BaseModel, Field
from typing import Union, Literal, Annotated


class Unstedy_base_params(BaseModel):
    mode: Union[Literal["open"], Literal["close"]]
    start_time: float
    duration: float


class Cond_params(BaseModel):
    time_to_iter: float
    density: float
    viscosity: float


class Boundary_params(BaseModel):
    mode: Union[Literal["speed"], Literal["pressure"]]
    value: float


class Provider(Boundary_params):
    type: Literal["provider"]


class Consumer(Boundary_params):
    type: Literal["consumer"]


class Pipe_params(BaseModel):
    type: Literal["pipe"]
    length: float
    diameter: float


class Pump_params(Unstedy_base_params):
    type: Literal["pump"]
    coef_a: float
    coef_b: float


class Gate_valve_params(Unstedy_base_params):
    type: Literal["gate_valve"]
    percentage: float


class Save_valve_params(BaseModel):
    type: Literal["safe_valve"]
    coef_q: float
    max_pressure: float


Elements_model = Annotated[
    Union[
        Pipe_params,
        Pump_params,
        Gate_valve_params,
        Save_valve_params,
        Provider,
        Consumer,
    ],
    Field(discriminator="type"),
]


class Unsteady_data(BaseModel):
    cond_params: Cond_params
    pipeline: list[Elements_model]


if __name__ == "__main__":
    params = Unsteady_data(
        **{
            "cond_params": {"time_to_iter": 20, "density": 200, "viscosity": 200},
            "pipeline": [
                {"type": "pipe", "diameter": 20, "length": 20},
                {"type": "pipe", "diameter": 20, "length": 20},
            ],
        }
    )

    print(params)
