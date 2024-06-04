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


class Safe_valve_params(BaseModel):
    type: Literal["safe_valve"]
    coef_q: float
    max_pressure: float


Elements_model = Annotated[
    Union[
        Pipe_params,
        Pump_params,
        Gate_valve_params,
        Safe_valve_params,
        Provider,
        Consumer,
    ],
    Field(discriminator="type"),
]


class Recieved_element(BaseModel):
    id: str
    value: Elements_model
    children: list[str]
    parents: list[str]


class One_section_response(BaseModel):
    x: float
    p: float
    V: float
    H: float


class Response_element(BaseModel):
    id: str
    type: str
    value: list[One_section_response]
    children: list[str]
    parents: list[str]


class Unsteady_data(BaseModel):
    cond_params: Cond_params
    pipeline: dict[str, Recieved_element]


class Result_unsteady_data(BaseModel):
    moment_result: dict[str, Response_element]  # key is an id of element
    t: float


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
