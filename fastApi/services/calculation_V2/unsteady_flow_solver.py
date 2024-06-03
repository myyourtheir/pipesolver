import numpy as np
import math
import os
from typing import Literal
from services.calculation_V2.basic_functions import Basic_functions
from services.calculation_V2.constants import Constants as C
from schemas.unsteady_flow_ws_scheme import (
    Unsteady_data,
    Result_unsteady_data,
    Response_element,
)
from functools import reduce
from pprint import pprint
import json


class Unsteady_flow_solver(Basic_functions):
    _dx = 1000
    result: Result_unsteady_data

    def __init__(self, data: Unsteady_data):
        cond_params = data.cond_params
        self._time_to_iter = cond_params.time_to_iter
        self._density = cond_params.density
        self._viscosity = cond_params.viscosity
        self.pipeline = data.pipeline
        self.start_element_ids = reduce(
            self.find_elements_without_parents, data.pipeline.values(), []
        )  # Учитываем пока как будто в массиве 1 стартовый id
        self._dt = self._dx / C.c
        self._moment_result = self._make_initial_distribution(data.pipeline)
        self._current_diameter = self.find_first_pipe_diameter(data.pipeline)

    def solve(self):
        while self._current_time <= self._time_to_iter:
            # Обнуление всего перед след расчетом
            self._current_x = 0
            self._prev_res = self._moment_result.copy()
            self._moment_result = {}
            self.__calculate_the_entire_graph_one_time()
            self.result = Result_unsteady_data(
                t=self._current_time, moment_result=self._moment_result
            )

            self._current_time += self._dt
            yield self.result

    def __calculate_the_entire_graph_one_time(self):
        # TODO Добавить логику обхода по сложному трубопроводу
        start_element = self.start_element_ids[0]
        current_node = self.pipeline[start_element]
        count = 0
        while True:
            if count != 0:
                current_node = self.pipeline[current_node.children[0]]

            current_element = current_node.value
            element_result: Response_element

            if current_element.type == "provider":
                element_result = self._provider_method(
                    current_node,
                    child_element=self._prev_res[current_node.children[0]].value,
                )
            elif current_element.type == "pipe":
                element_result = self._pipe_method(
                    current_node,
                    child_element=self._prev_res[current_node.children[0]].value,
                    parent_element=self._prev_res[current_node.parents[0]].value,
                )

            # TODO Добавить расчеты элементов
            elif current_element.type == "pump":
                element_result = self._pump_method(
                    current_node,
                    child_element=self._prev_res[current_node.children[0]].value,
                    parent_element=self._prev_res[current_node.parents[0]].value,
                )

            elif current_element.type == "gate_valve":
                element_result = self._gate_valve_method()

            elif current_element.type == "safe_valve":
                element_result = self._safe_valve_method()

            # _________________________________________________

            elif current_element.type == "consumer":
                element_result = self._consumer_method(
                    current_node,
                    parent_element=self._prev_res[current_node.parents[0]].value,
                )
            # Сохраняем в результаты текущего времени с id элемента
            self._moment_result[current_node.id] = element_result
            count += 1
            if len(current_node.children) == 0:
                break


if __name__ == "__main__":
    data = Unsteady_data(
        **{
            "cond_params": {"time_to_iter": 200, "density": 850, "viscosity": 10},
            "pipeline": {
                "lwyttwhg-z1eoi6zlr5": {
                    "id": "lwyttwhg-z1eoi6zlr5",
                    "value": {"type": "provider", "mode": "pressure", "value": 0},
                    "children": ["lwyttxvo-dbpjm8hbd0l"],
                    "parents": [],
                },
                "lwyttxvo-dbpjm8hbd0l": {
                    "id": "lwyttxvo-dbpjm8hbd0l",
                    "value": {
                        "type": "pump",
                        "coef_a": 310,
                        "coef_b": 8e-07,
                        "mode": "open",
                        "start_time": 0,
                        "duration": 20,
                    },
                    "children": ["lwyttytm-53x9tmwoh2p"],
                    "parents": ["lwyttwhg-z1eoi6zlr5"],
                },
                "lwyttytm-53x9tmwoh2p": {
                    "id": "lwyttytm-53x9tmwoh2p",
                    "value": {"type": "pipe", "length": 100, "diameter": 1000},
                    "children": ["lwytu0g9-v0qafperlhs"],
                    "parents": ["lwyttxvo-dbpjm8hbd0l"],
                },
                "lwytu0g9-v0qafperlhs": {
                    "id": "lwytu0g9-v0qafperlhs",
                    "value": {"type": "consumer", "mode": "pressure", "value": 0},
                    "children": [],
                    "parents": ["lwyttytm-53x9tmwoh2p"],
                },
            },
        }
    )
    solver = Unsteady_flow_solver(data)
    generator = solver.solve()
    while True:
        answer = next(generator)
        pprint(json.loads(answer.model_dump_json()))


# python3 -m services.calculation_V2.unsteady_flow_solver
