from schemas.unsteady_flow_ws_scheme import Recieved_element
from services.calculation_V3.elements.abstractions import AbstractElement
from services.calculation_V3.elements.provider_element import Provider_Element
from services.calculation_V3.hydraulics import Hydraulics
from services.calculation_V3.elements.pipe_element import Pipe_Element
from services.calculation_V3.elements.pump_element import Pump_Element
from services.calculation_V3.elements.consumer_element import Consumer_Element
from services.calculation_V3.elements.tee_element import Tee_Element


class Elements_Factory:
    type_to_instance_dict = {
        "provider": Provider_Element,
        "pipe": Pipe_Element,
        "pump": Pump_Element,
        # "gate_valve": Gate_valve_Element,
        # "safe_valve": Safe_valve_Element,
        "consumer": Consumer_Element,
        "tee": Tee_Element,
    }

    def __init__(self, elements: dict[str, Recieved_element], hydraulics: Hydraulics):
        self._elements = elements
        self._hydraulics = hydraulics

    def get_providers(self):
        providers = []
        for element in self._elements.values():
            if element.value.type == "provider":
                providers.append(element.id)
        return providers

    def _create_element(self, element: Recieved_element) -> dict[str, AbstractElement]:
        return self.type_to_instance_dict[element.value.type](
            element, self._hydraulics, self._elements
        )

    def create_elements(self) -> dict[str, AbstractElement]:
        result = {}
        for element in self._elements.values():
            result[element.id] = self._create_element(element)
        return result

    def get_elements_edges(self) -> dict[str, list[str]]:
        result = {}
        for element in self._elements.values():
            result[element.id] = [*element.children, *element.parents]
        return result
