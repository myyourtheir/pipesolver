from functools import reduce
from schemas.unsteady_flow_ws_scheme import (
    Recieved_element,
    Result_unsteady_data,
    Response_element,
    ExtendedOneSectionResponse,
    One_section_response,
)
import logging
from services.calculation_V2.constants import Constants as C
from services.Utils.stack import Stack
from typing import Literal
from pprint import pprint
from time import sleep


class Unsteady_flow_core:
    _dx: int

    def _make_initial_distribution(
        self, pipeline: dict[str, Recieved_element]
    ) -> dict[str, Response_element]:

        def provider_method(
            current_node: Recieved_element, child_node: Response_element
        ) -> Response_element:
            response_value = [
                {
                    child_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    )
                }
            ]
            self._current_x += self._dx

            return self.make_response_element(
                current_node=current_node, value=response_value
            )

        def pipe_method(
            current_node: Recieved_element,
            child_node: Response_element,
            parent_node: Response_element,
        ) -> Response_element:
            current_element = current_node.value
            self._current_diameter = current_element.diameter / 1000
            sections_number = int(current_element.length * 1000 / self._dx)
            response_value: list[One_section_response] = []

            def culc_one_section() -> dict[Literal["p", "V", "H"], float]:
                p = 0
                V = 0
                H = 0
                return {"p": p, "V": V, "H": H}

            for i in range(sections_number):
                if i == 0:
                    one_section_res = culc_one_section()
                    response_value.append(
                        {
                            current_node.id: One_section_response(
                                x=self._current_x,
                                p=one_section_res["p"],
                                V=one_section_res["V"],
                                H=one_section_res["H"],
                            ),
                            parent_node.id: One_section_response(
                                x=self._current_x,
                                p=one_section_res["p"],
                                V=one_section_res["V"],
                                H=one_section_res["H"],
                            ),
                        }
                    )
                elif i == sections_number - 1:
                    one_section_res = culc_one_section()
                    response_value.append(
                        {
                            current_node.id: One_section_response(
                                x=self._current_x,
                                p=one_section_res["p"],
                                V=one_section_res["V"],
                                H=one_section_res["H"],
                            ),
                            child_node.id: One_section_response(
                                x=self._current_x,
                                p=one_section_res["p"],
                                V=one_section_res["V"],
                                H=one_section_res["H"],
                            ),
                        }
                    )
                else:
                    one_section_res = culc_one_section()
                    response_value.append(
                        {
                            current_node.id: One_section_response(
                                x=self._current_x,
                                p=one_section_res["p"],
                                V=one_section_res["V"],
                                H=one_section_res["H"],
                            )
                        }
                    )

                self._current_x += self._dx
            return self.make_response_element(
                current_node=current_node, value=response_value
            )

        def pump_method(
            current_node: Recieved_element,
            child_node: Response_element,
            parent_node: Response_element,
        ) -> Response_element:

            response_value = [
                {
                    parent_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    )
                },
                {
                    child_node.id: One_section_response(
                        x=0,
                        p=0,
                        V=0,
                        H=0,
                    )
                },
            ]
            self._current_x += self._dx
            return self.make_response_element(
                current_node=current_node, value=response_value
            )

        def gate_valve_method(
            current_node: Recieved_element,
            child_node: Response_element,
            parent_node: Response_element,
        ) -> Response_element:
            response_value = [
                {
                    parent_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    )
                },
                {
                    child_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    )
                },
            ]
            self._current_x += self._dx
            return self.make_response_element(
                current_node=current_node, value=response_value
            )

        def safe_valve_method(
            current_node: Recieved_element,
            child_node: Response_element,
            parent_node: Response_element,
        ) -> Response_element:
            response_value = [
                {
                    parent_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    )
                },
                {
                    child_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    )
                },
            ]
            self._current_x += self._dx
            return self.make_response_element(
                current_node=current_node, value=response_value
            )

        def consumer_method(
            current_node: Recieved_element, parent_node: Response_element
        ) -> Response_element:
            response_value = [
                {
                    parent_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    )
                },
            ]
            return self.make_response_element(
                current_node=current_node, value=response_value
            )

        def tee_method(
            current_node: Recieved_element,
            first_neighbor_node: Response_element,
            second_nieghbour: Response_element,
            third_neighbor: Response_element,
        ) -> Response_element:
            response_value = [
                {
                    first_neighbor_node.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    ),
                    second_nieghbour.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    ),
                    third_neighbor.id: One_section_response(
                        x=self._current_x,
                        p=0,
                        V=0,
                        H=0,
                    ),
                }
            ]

            self._current_x += self._dx
            return self.make_response_element(
                current_node=current_node, value=response_value
            )

        def select_initial_distribution_method(current_node: Recieved_element):
            current_element = current_node.value
            if current_element.type == "provider":
                child_node_id = self.get_neighbors_of_node(current_node)[0]
                element_result = provider_method(
                    current_node,
                    child_node=pipeline[child_node_id],  # TODO возможно тут ошибка
                )
            elif current_element.type == "pipe":
                child_id, parent_id = self.extract_orientation_child_parent(
                    current_node, visited_nodes
                )
                element_result = pipe_method(
                    current_node,
                    child_node=pipeline[child_id],
                    parent_node=pipeline[parent_id],
                )

            elif current_element.type == "pump":
                child_id, parent_id = self.extract_orientation_child_parent(
                    current_node, visited_nodes
                )
                element_result = pump_method(
                    current_node,
                    child_node=pipeline[child_id],
                    parent_node=pipeline[parent_id],
                )

            elif current_element.type == "gate_valve":
                child_id, parent_id = self.extract_orientation_child_parent(
                    current_node, visited_nodes
                )
                element_result = gate_valve_method(
                    current_node,
                    child_node=pipeline[child_id],
                    parent_node=pipeline[parent_id],
                )

            elif current_element.type == "safe_valve":
                child_id, parent_id = self.extract_orientation_child_parent(
                    current_node, visited_nodes
                )
                element_result = safe_valve_method(
                    current_node,
                    child_node=pipeline[child_id],
                    parent_node=pipeline[parent_id],
                )

            elif current_element.type == "consumer":
                parent_node_id = self.get_neighbors_of_node(current_node)[0]
                element_result = consumer_method(
                    current_node,
                    parent_node=pipeline[parent_node_id],
                )
            elif current_element.type == "tee":
                neighours = self.get_neighbors_of_node(current_node)
                visited_node = [node for node in neighours if node in visited_nodes]
                neighours.remove(visited_node[0])
                element_result = tee_method(
                    current_node=current_node,
                    first_neighbor_node=pipeline[visited_node[0]],
                    second_nieghbour=pipeline[neighours[0]],
                    third_neighbor=pipeline[neighours[1]],
                )
            return element_result

        initial_distribution = {}
        start_element_id = reduce(self.find_providers, pipeline.values(), [])[0]
        current_node = pipeline[start_element_id]
        current_x = 0
        visited_nodes: set[str] = set()
        stack = Stack()
        while True:

            # sleep(0.5)

            element_result = select_initial_distribution_method(
                current_node=current_node
            )

            initial_distribution[current_node.id] = element_result
            current_x += self._dx
            # Добавляем элемент в посещенные
            visited_nodes.add(current_node.id)

            dont_visited_neighbors = self.get_dont_visited_neighbors(
                current_node=current_node, visited_nodes=visited_nodes
            )
            # pprint(
            #     f"узел: {current_node.id}  не посетил: {dont_visited_neighbors} стек выглядит так: {stack.stack}"
            # )
            # логика обхода
            if len(dont_visited_neighbors) == 0:
                if len(stack) == 0:
                    break
                else:
                    if current_node.id == stack.head():
                        break
                    else:
                        current_node = pipeline[stack.head()]
            elif len(dont_visited_neighbors) == 1:
                if not stack.is_empty() and current_node.id == stack.head():
                    stack.remove()
                current_node = pipeline[dont_visited_neighbors[0]]
            else:
                stack.add(current_node.id)
                current_node = pipeline[dont_visited_neighbors[0]]

        return initial_distribution

    @staticmethod
    def extract_orientation_child_parent(
        node: Recieved_element, visited_nodes: set[str]
    ):
        child_id = node.children[0]
        parent_id = node.parents[0]
        visited_id = parent_id if parent_id in visited_nodes else child_id
        next_node_id = child_id if visited_id != child_id else parent_id
        return next_node_id, visited_id

    @staticmethod
    def get_neighbors_of_node(node: Recieved_element):
        return [*node.parents, *node.children]

    @classmethod
    def get_dont_visited_neighbors(
        cls, current_node: Recieved_element, visited_nodes: set
    ):
        neighbors = cls.get_neighbors_of_node(node=current_node)
        dont_visited_neighbors = []
        for neighbor in neighbors:
            if neighbor not in visited_nodes:
                dont_visited_neighbors.append(neighbor)
        return dont_visited_neighbors

    @staticmethod
    def find_providers(acc: list[str], elem: Recieved_element):
        if len(elem.parents) + len(elem.children) == 1:
            if elem.value.type == "provider":
                acc.append(elem.id)
        return acc

    @staticmethod
    def make_response_element(
        current_node: Recieved_element, value: list[ExtendedOneSectionResponse]
    ):
        dict = current_node.model_dump()
        dict["value"] = value
        dict["type"] = current_node.value.type
        return Response_element(**dict)

    @classmethod
    def find_next_pipe_diameter(  # TODO Может работать неправильно для, потому что поиск след. трубы только по детям
        cls, pipeline: dict[str, Recieved_element], start_element_id
    ):
        current_node = pipeline[start_element_id]
        while len(current_node.children) != 0 or len(current_node.parents) != 0:

            if current_node.value.type == "pipe":
                diameter = current_node.value.diameter
                break
            if len(current_node.children) != 0:
                current_node = pipeline[current_node.children[0]]
            else:
                current_node = pipeline[current_node.parents[0]]
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
