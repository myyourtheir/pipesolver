from functools import reduce
from schemas.unsteady_flow_ws_scheme import Recieved_element, Result_unsteady_data


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

    @classmethod
    def transform_pressure_to_Pa(cls, result_once_time: Result_unsteady_data):
        result_once_time_copy = result_once_time.model_dump()

        def divide_p_by_million(data):
            if isinstance(data, dict):
                for key, value in data.items():
                    if key == "p":
                        data[key] /= 1_000_000
                    else:
                        divide_p_by_million(value)
            elif isinstance(data, list):
                for item in data:
                    divide_p_by_million(item)

        divide_p_by_million(result_once_time_copy)
        return Result_unsteady_data(**result_once_time_copy)
