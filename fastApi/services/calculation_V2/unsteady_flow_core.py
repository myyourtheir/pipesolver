from functools import reduce
from schemas.unsteady_flow_ws_scheme import (
    Recieved_element,
)


class Unsteady_flow_core:
    @staticmethod
    def find_elements_without_parents(acc: list[str], elem: Recieved_element):
        if len(elem.parents) == 0:
            acc.append(elem.id)
        return acc

    @classmethod
    def find_next_pipe_diameter(
        cls, pipeline: dict[str, Recieved_element], start_element_id
    ):
        current_node = pipeline[start_element_id]
        while len(current_node.children) != 0:
            if current_node.value.type == "pipe":
                diameter = current_node.value.diameter
                break
            current_node = pipeline[current_node.children[0]]
        return diameter / 1000
