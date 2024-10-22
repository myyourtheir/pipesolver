from schemas.unsteady_flow_ws_scheme import (
    Response_element,
    Result_unsteady_data,
    Unsteady_data,
)
from services.calculation_V3.constants import Constants
from services.calculation_V3.elements.elements_factory import Elements_Factory
from services.Utils.stack import Stack
from pprint import pprint
from services.calculation_V3.hydraulics import Hydraulics
from services.calculation_V3.unsteady_utils import Unsteady_Utils


class Unsteady_Solver(Unsteady_Utils):
    _dx = 1000
    _current_time = 0
    _prev_res: Result_unsteady_data

    def __init__(self, data: Unsteady_data):
        cond_params = data.cond_params
        self._time_to_iter = cond_params.time_to_iter
        self._dt = self._dx / Constants.c
        hydraulics = Hydraulics(
            cond_params.density, cond_params.viscosity * 10 ** (-6), self._dt, self._dx
        )
        factory = Elements_Factory(elements=data.pipeline, hydraulics=hydraulics)
        self._pipeline = factory.create_elements()
        self._edges = factory.get_elements_edges()
        self._providers = factory.get_providers()

    def solve(self):
        self._current_time = 0
        # Initial distribution
        self._prev_res = self._graph_traversal_initial()
        self._current_time += self._dt

        while self._current_time <= self._time_to_iter + 1:
            moment_result = self._graph_traversal()
            self._current_time += self._dt
            yield moment_result

    def _graph_traversal(self) -> Result_unsteady_data:
        current_element_id = self._providers[0]
        visited_elements = set()
        stack = Stack()
        stack.add(current_element_id)
        one_time_result: dict[str, Response_element] = {}

        while not stack.is_empty():
            # расчет

            current_element_id = stack.remove()
            element = self._pipeline[current_element_id]

            one_time_result[current_element_id] = element.unsteady_solve(
                prev_res=self._prev_res
            )

            # логика обхода
            visited_elements.add(current_element_id)
            for neighbour in self._edges[current_element_id]:
                if neighbour not in visited_elements:
                    stack.add(neighbour)
        result = Result_unsteady_data(
            t=round(self._current_time, 2), moment_result=one_time_result
        )
        self._prev_res = result
        res_with_pa = self.transform_pressure_to_Pa(result)
        return res_with_pa

    def _graph_traversal_initial(self) -> Result_unsteady_data:
        current_element_id = self._providers[0]
        visited_elements = set()
        stack = Stack()
        stack.add(current_element_id)
        one_time_result: dict[str, Response_element] = {}
        curr_x = 0
        while not stack.is_empty():
            # расчет

            current_element_id = stack.remove()
            neighbours = self._edges[current_element_id]
            for neighbour in neighbours:
                if neighbour in visited_elements:
                    curr_x = one_time_result[neighbour].value[-1][current_element_id].x
            element = self._pipeline[current_element_id]
            res = element.make_initial_distribution(x=curr_x, visited=visited_elements)
            one_time_result[current_element_id] = res

            # логика обхода
            visited_elements.add(current_element_id)
            for neighbour in self._edges[current_element_id]:
                if neighbour not in visited_elements:
                    stack.add(neighbour)
        result = Result_unsteady_data(
            t=round(self._current_time, 2), moment_result=one_time_result
        )
        self._prev_res = result
        return result


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

    data2 = Unsteady_data(
        **{
            "cond_params": {"time_to_iter": 200, "density": 850, "viscosity": 10},
            "pipeline": {
                "1": {
                    "id": "1",
                    "value": {"type": "provider", "mode": "pressure", "value": 0},
                    "children": ["lwyxg7qe-cwdi5buw95k"],
                    "parents": [],
                },
                "lwyxg7qe-cwdi5buw95k": {
                    "id": "lwyxg7qe-cwdi5buw95k",
                    "value": {
                        "type": "pump",
                        "coef_a": 310,
                        "coef_b": 8e-07,
                        "mode": "open",
                        "start_time": 0,
                        "duration": 20,
                    },
                    "children": ["lwyxgcp3-h088yt7hw0w"],
                    "parents": ["1"],
                },
                "lwyxgcp3-h088yt7hw0w": {
                    "id": "lwyxgcp3-h088yt7hw0w",
                    "value": {"type": "pipe", "length": 10, "diameter": 1000},
                    "children": ["lwyxgpop-skskibkbzj"],
                    "parents": ["lwyxg7qe-cwdi5buw95k"],
                },
                "lwyxgpop-skskibkbzj": {
                    "id": "lwyxgpop-skskibkbzj",
                    "value": {"type": "safe_valve", "coef_q": 0.5, "max_pressure": 4},
                    "children": ["lwyxgsqi-3joyj6t24s2"],
                    "parents": ["lwyxgcp3-h088yt7hw0w"],
                },
                "lwyxgsqi-3joyj6t24s2": {
                    "id": "lwyxgsqi-3joyj6t24s2",
                    "value": {"type": "pipe", "length": 10, "diameter": 1000},
                    "children": ["lwyxw3ok-z2l5vp7j2bc"],
                    "parents": ["lwyxgpop-skskibkbzj"],
                },
                "lwyxw3ok-z2l5vp7j2bc": {
                    "id": "lwyxw3ok-z2l5vp7j2bc",
                    "value": {
                        "type": "pump",
                        "coef_a": 310,
                        "coef_b": 8e-07,
                        "mode": "open",
                        "start_time": 0,
                        "duration": 20,
                    },
                    "children": ["lwyxwb8j-tl3ylyg2xx"],
                    "parents": ["lwyxgsqi-3joyj6t24s2"],
                },
                "lwyxwb8j-tl3ylyg2xx": {
                    "id": "lwyxwb8j-tl3ylyg2xx",
                    "value": {"type": "pipe", "length": 20, "diameter": 1000},
                    "children": ["lwyxwcue-m76nnq5hg8g"],
                    "parents": ["lwyxw3ok-z2l5vp7j2bc"],
                },
                "lwyxwcue-m76nnq5hg8g": {
                    "id": "lwyxwcue-m76nnq5hg8g",
                    "value": {
                        "type": "gate_valve",
                        "mode": "open",
                        "start_time": 0,
                        "duration": 100,
                        "percentage": 100,
                    },
                    "children": ["lwyxwgpo-e37kt2ix0di"],
                    "parents": ["lwyxwb8j-tl3ylyg2xx"],
                },
                "lwyxwgpo-e37kt2ix0di": {
                    "id": "lwyxwgpo-e37kt2ix0di",
                    "value": {"type": "pipe", "length": 2, "diameter": 1000},
                    "children": ["lwyxwip6-v35hiov3t"],
                    "parents": ["lwyxwcue-m76nnq5hg8g"],
                },
                "lwyxwip6-v35hiov3t": {
                    "id": "lwyxwip6-v35hiov3t",
                    "value": {"type": "consumer", "mode": "pressure", "value": 0},
                    "children": [],
                    "parents": ["lwyxwgpo-e37kt2ix0di"],
                },
            },
        }
    )
    data3 = Unsteady_data(
        **{
            "cond_params": {"time_to_iter": 200, "density": 850, "viscosity": 10},
            "pipeline": {
                "2452": {
                    "id": "2452",
                    "name": "Поставщик 2452",
                    "value": {"type": "provider", "mode": "pressure", "value": 0},
                    "children": [],
                    "parents": ["8144"],
                    "ui": {
                        "isSelected": False,
                        "position": [-6.160000000000001, 0.4500000000000011, 2],
                        "length": 1,
                        "openPoints": [],
                    },
                },
                "3955": {
                    "id": "3955",
                    "name": "Труба 3955",
                    "value": {"type": "pipe", "length": 100, "diameter": 1000},
                    "children": ["8806"],
                    "parents": ["0071"],
                    "ui": {
                        "isSelected": False,
                        "position": [0, 0, 0],
                        "length": 0,
                        "openPoints": ["left", "right", "top"],
                        "pipeNeighbours": {"8806": "right", "0071": "left"},
                    },
                },
                "5127": {
                    "id": "5127",
                    "name": "Труба 5127",
                    "value": {"type": "pipe", "length": 50, "diameter": 1000},
                    "children": ["0787"],
                    "parents": ["8806"],
                    "ui": {
                        "isSelected": False,
                        "position": [0, 0, 0],
                        "length": 0,
                        "openPoints": ["left"],
                        "pipeNeighbours": {"8806": "top", "0787": "left"},
                    },
                },
                "6609": {
                    "id": "6609",
                    "name": "Труба 6609",
                    "value": {"type": "pipe", "length": 100, "diameter": 1000},
                    "children": ["0738"],
                    "parents": ["8806"],
                    "ui": {
                        "isSelected": False,
                        "position": [0, 0, 0],
                        "length": 0,
                        "openPoints": ["left", "right"],
                        "pipeNeighbours": {"8806": "left", "0738": "right"},
                    },
                },
                "8144": {
                    "id": "8144",
                    "name": "Труба 8144",
                    "value": {"type": "pipe", "length": 100, "diameter": 1000},
                    "children": ["2452"],
                    "parents": ["0738"],
                    "ui": {
                        "isSelected": False,
                        "position": [0, 0, 0],
                        "length": 0,
                        "openPoints": ["right"],
                        "pipeNeighbours": {"2452": "right", "0738": "left"},
                    },
                },
                "8806": {
                    "id": "8806",
                    "name": "Тройник 8806",
                    "value": {"type": "tee"},
                    "children": ["5127", "6609"],
                    "parents": ["3955"],
                    "ui": {
                        "isSelected": False,
                        "position": [-0.1599999999999998, 0.41000000000000036, 2],
                        "length": 1,
                        "openPoints": [],
                    },
                },
                "0071": {
                    "id": "0071",
                    "name": "Потребитель 0071",
                    "value": {"type": "consumer", "mode": "pressure", "value": 0},
                    "children": ["3955"],
                    "parents": [],
                    "ui": {
                        "isSelected": False,
                        "position": [7.5600000000000005, 0.6099999999999998, 1],
                        "length": 1,
                        "openPoints": [],
                    },
                },
                "0787": {
                    "id": "0787",
                    "name": "Потребитель 0787",
                    "value": {"type": "consumer", "mode": "pressure", "value": 0},
                    "children": [],
                    "parents": ["5127"],
                    "ui": {
                        "isSelected": False,
                        "position": [-0.1799999999999998, 6.450000000000001, 1],
                        "length": 1,
                        "openPoints": [],
                    },
                },
                "0738": {
                    "id": "0738",
                    "name": "Насос 0738",
                    "value": {
                        "type": "pump",
                        "coef_a": 310,
                        "coef_b": 8e-7,
                        "mode": "open",
                        "start_time": 0,
                        "duration": 20,
                    },
                    "children": ["8144"],
                    "parents": ["6609"],
                    "ui": {
                        "isSelected": False,
                        "position": [-3.52, 0.6500000000000011, 2],
                        "length": 1,
                        "openPoints": [],
                    },
                },
            },
        }
    )
    solver = Unsteady_Solver(data3)
    generator = solver.solve()
    ans = []
    # with open("test.json", "w") as file:
    #     for i in range(200):
    #         answer = next(generator)
    #         ans.append(answer.model_dump())
    #     file.write(json.dumps(ans).replace("/", r"\/"))
    while True:
        next(generator).model_dump()


# python3 -m services.calculation_V3.solver
