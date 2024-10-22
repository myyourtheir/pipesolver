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
import logging
from services.Utils.stack import Stack


class Unsteady_flow_solver(Basic_functions):
    _dx = 1000
    result: Result_unsteady_data

    def __init__(self, data: Unsteady_data):
        cond_params = data.cond_params
        self._time_to_iter = cond_params.time_to_iter
        self._density = cond_params.density
        self._viscosity = cond_params.viscosity * 10 ** (-6)
        self._pipeline = data.pipeline
        self.start_element_ids = reduce(
            self.find_providers, data.pipeline.values(), []
        )  # Учитываем пока как будто в массиве 1 стартовый id
        self._dt = self._dx / C.c
        self._moment_result = self._make_initial_distribution(data.pipeline)
        self._current_diameter = self.find_next_pipe_diameter(
            data.pipeline,
            reduce(self.find_providers, data.pipeline.values(), [])[0],
        )
        # pprint(self._make_initial_distribution(data.pipeline))

    def solve(self):
        while self._current_time <= self._time_to_iter:
            # Обнуление всего перед след расчетом
            self._current_x = 0
            self._prev_res = self._moment_result.copy()
            # logging.info(self._moment_result)
            self._moment_result = {}
            self.__calculate_the_entire_graph_one_time()
            self.result = Result_unsteady_data(
                t=round(self._current_time, 2), moment_result=self._moment_result
            )
            res_with_pa = self.transform_pressure_to_Pa(self.result)
            self._current_time += self._dt
            yield res_with_pa

    def __calculate_the_entire_graph_one_time(self):
        start_element = self.start_element_ids[0]
        current_node = self._pipeline[start_element]

        self._visited_nodes: set[str] = set()
        stack = Stack()

        while True:
            element_result = self._select_solve_method(current_node)  # solver
            # Сохраняем в результаты текущего времени с id элемента
            self._moment_result[current_node.id] = element_result

            self._visited_nodes.add(current_node.id)

            dont_visited_neighbors = self.get_dont_visited_neighbors(
                current_node=current_node, visited_nodes=self._visited_nodes
            )
            # логика обхода
            if len(dont_visited_neighbors) == 0:
                if len(stack) == 0:
                    break
                else:
                    if current_node.id == stack.head():
                        break
                    else:
                        current_node = self._pipeline[stack.head()]
            elif len(dont_visited_neighbors) == 1:
                if not stack.is_empty() and current_node.id == stack.head():
                    stack.remove()
                current_node = self._pipeline[dont_visited_neighbors[0]]
            else:
                stack.add(current_node.id)
                current_node = self._pipeline[dont_visited_neighbors[0]]


if __name__ == "__main__":
    data = Unsteady_data(
        **{
            "cond_params": {"time_to_iter": 200, "density": 850, "viscosity": 10},
            "pipeline": {
                "1": {
                    "id": "1",
                    "value": {"type": "provider", "mode": "pressure", "value": 0},
                    "children": ["2"],
                    "parents": [],
                },
                "2": {
                    "id": "2",
                    "value": {
                        "type": "pump",
                        "coef_a": 310,
                        "coef_b": 8e-07,
                        "mode": "open",
                        "start_time": 0,
                        "duration": 20,
                    },
                    "children": ["3"],
                    "parents": ["1"],
                },
                "3": {
                    "id": "3",
                    "value": {"type": "pipe", "length": 2, "diameter": 1000},
                    "children": ["4"],
                    "parents": ["2"],
                },
                "4": {
                    "id": "4",
                    "value": {"type": "tee"},
                    "children": ["5", "6"],
                    "parents": ["3"],
                },
                "5": {
                    "id": "5",
                    "value": {"type": "pipe", "length": 10, "diameter": 1000},
                    "children": ["8"],
                    "parents": ["4"],
                },
                "8": {
                    "id": "8",
                    "value": {"type": "tee"},
                    "children": ["9", "10"],
                    "parents": ["5"],
                },
                "10": {
                    "id": "10",
                    "value": {"type": "pipe", "length": 10, "diameter": 1000},
                    "children": ["12"],
                    "parents": ["8"],
                },
                "9": {
                    "id": "9",
                    "value": {"type": "pipe", "length": 10, "diameter": 1000},
                    "children": ["11"],
                    "parents": ["8"],
                },
                "11": {
                    "id": "11",
                    "value": {"type": "consumer", "mode": "pressure", "value": 0},
                    "children": [],
                    "parents": ["9"],
                },
                "12": {
                    "id": "12",
                    "value": {"type": "tee"},
                    "children": ["13"],
                    "parents": ["6", "10"],
                },
                "13": {
                    "id": "13",
                    "value": {"type": "pipe", "length": 10, "diameter": 400},
                    "children": ["7"],
                    "parents": ["12"],
                },
                "6": {
                    "id": "6",
                    "value": {"type": "pipe", "length": 10, "diameter": 1000},
                    "children": ["12"],
                    "parents": ["4"],
                },
                "7": {
                    "id": "7",
                    "value": {"type": "consumer", "mode": "pressure", "value": 0},
                    "children": [],
                    "parents": ["13"],
                },
            },
        }
    )

    # data = Unsteady_data(
    #     **{
    #         "cond_params": {"time_to_iter": 200, "density": 850, "viscosity": 10},
    #         "pipeline": {
    #             "1": {
    #                 "id": "1",
    #                 "value": {"type": "provider", "mode": "pressure", "value": 0},
    #                 "children": ["lwyxg7qe-cwdi5buw95k"],
    #                 "parents": [],
    #             },
    #             "lwyxg7qe-cwdi5buw95k": {
    #                 "id": "lwyxg7qe-cwdi5buw95k",
    #                 "value": {
    #                     "type": "pump",
    #                     "coef_a": 310,
    #                     "coef_b": 8e-07,
    #                     "mode": "open",
    #                     "start_time": 0,
    #                     "duration": 20,
    #                 },
    #                 "children": ["lwyxgcp3-h088yt7hw0w"],
    #                 "parents": ["1"],
    #             },
    #             "lwyxgcp3-h088yt7hw0w": {
    #                 "id": "lwyxgcp3-h088yt7hw0w",
    #                 "value": {"type": "pipe", "length": 10, "diameter": 1000},
    #                 "children": ["lwyxgpop-skskibkbzj"],
    #                 "parents": ["lwyxg7qe-cwdi5buw95k"],
    #             },
    #             "lwyxgpop-skskibkbzj": {
    #                 "id": "lwyxgpop-skskibkbzj",
    #                 "value": {"type": "safe_valve", "coef_q": 0.5, "max_pressure": 4},
    #                 "children": ["lwyxgsqi-3joyj6t24s2"],
    #                 "parents": ["lwyxgcp3-h088yt7hw0w"],
    #             },
    #             "lwyxgsqi-3joyj6t24s2": {
    #                 "id": "lwyxgsqi-3joyj6t24s2",
    #                 "value": {"type": "pipe", "length": 10, "diameter": 1000},
    #                 "children": ["lwyxw3ok-z2l5vp7j2bc"],
    #                 "parents": ["lwyxgpop-skskibkbzj"],
    #             },
    #             "lwyxw3ok-z2l5vp7j2bc": {
    #                 "id": "lwyxw3ok-z2l5vp7j2bc",
    #                 "value": {
    #                     "type": "pump",
    #                     "coef_a": 310,
    #                     "coef_b": 8e-07,
    #                     "mode": "open",
    #                     "start_time": 0,
    #                     "duration": 20,
    #                 },
    #                 "children": ["lwyxwb8j-tl3ylyg2xx"],
    #                 "parents": ["lwyxgsqi-3joyj6t24s2"],
    #             },
    #             "lwyxwb8j-tl3ylyg2xx": {
    #                 "id": "lwyxwb8j-tl3ylyg2xx",
    #                 "value": {"type": "pipe", "length": 20, "diameter": 1000},
    #                 "children": ["lwyxwcue-m76nnq5hg8g"],
    #                 "parents": ["lwyxw3ok-z2l5vp7j2bc"],
    #             },
    #             "lwyxwcue-m76nnq5hg8g": {
    #                 "id": "lwyxwcue-m76nnq5hg8g",
    #                 "value": {
    #                     "type": "gate_valve",
    #                     "mode": "open",
    #                     "start_time": 0,
    #                     "duration": 100,
    #                     "percentage": 100,
    #                 },
    #                 "children": ["lwyxwgpo-e37kt2ix0di"],
    #                 "parents": ["lwyxwb8j-tl3ylyg2xx"],
    #             },
    #             "lwyxwgpo-e37kt2ix0di": {
    #                 "id": "lwyxwgpo-e37kt2ix0di",
    #                 "value": {"type": "pipe", "length": 2, "diameter": 1000},
    #                 "children": ["lwyxwip6-v35hiov3t"],
    #                 "parents": ["lwyxwcue-m76nnq5hg8g"],
    #             },
    #             "lwyxwip6-v35hiov3t": {
    #                 "id": "lwyxwip6-v35hiov3t",
    #                 "value": {"type": "consumer", "mode": "pressure", "value": 0},
    #                 "children": [],
    #                 "parents": ["lwyxwgpo-e37kt2ix0di"],
    #             },
    #         },
    #     }
    # )
    solver = Unsteady_flow_solver(data)
    generator = solver.solve()
    ans = []
    # with open("test.json", "w") as file:
    #     for i in range(200):
    #         answer = next(generator)
    #         ans.append(answer.model_dump())
    #     file.write(json.dumps(ans).replace("/", r"\/"))
    while True:
        pprint(next(generator).model_dump())


# python3 -m services.calculation_V2.unsteady_flow_solver
