from functools import reduce
from schemas.unsteady_flow_ws_scheme import (
    Unsteady_data,
    Recieved_element,
    Result_unsteady_data,
    Response_element,
    Cond_params,
    Provider,
    Consumer,
    Pipe_params,
    Pump_params,
    Gate_valve_params,
    Safe_valve_params,
)


class Unsteady_flow_core:
    @staticmethod
    def find_elements_without_parents(acc: list[str], elem: Recieved_element):
        if len(elem.parents) == 0:
            acc.append(elem.id)
        return acc

    @classmethod
    def find_first_pipe_diameter(cls, pipeline: dict[str, Recieved_element]):
        start_element_id = reduce(
            cls.find_elements_without_parents, pipeline.values(), []
        )[0]
        current_node = pipeline[start_element_id]
        while len(current_node.children) != 0:
            if current_node.value.type == "pipe":
                diameter = current_node.value.diameter
                break
            current_node = pipeline[current_node.children[0]]
        return diameter
