from abc import ABC, abstractmethod
from schemas.unsteady_flow_ws_scheme import (
    Recieved_element,
    Response_element,
    Result_unsteady_data,
    One_section_response,
)
from services.calculation_V3.hydraulics import Hydraulics


class AbstractElement(ABC):
    def __init__(
        self,
        element: Recieved_element,
        hydraulics: Hydraulics,
        elements: dict[str, Recieved_element],
    ):
        self.recieve_element = element
        self.neighbours: list[str] = [*element.children, *element.parents]
        self.value = element.value
        self.id = element.id
        self.hydraulics = hydraulics
        self.parent_id = self.neighbours[-1]
        self.child_id = self.neighbours[0]
        self.diameter = None
        self.all_elements = elements

    @abstractmethod
    def unsteady_solve(self, prev_res: Result_unsteady_data) -> Response_element:
        pass

    @abstractmethod
    def make_initial_distribution(
        self, x: float, visited: set[str]
    ) -> Response_element:
        pass

    def make_response_element(self, value: list[One_section_response]):
        dict = self.recieve_element.model_dump()
        dict["value"] = value
        dict["type"] = self.value.type
        return Response_element(**dict)

    def print_self(self):
        print(self.id)
