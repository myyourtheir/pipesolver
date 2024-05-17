# Нужно обратить внимание в продакшене на путь импорта этого модуля
import services.Utils.basic_functions as bf
import numpy as np
from functools import reduce
from typing import Union, Literal
from pydantic import BaseModel
from schemas.unsteady_flow_ws_scheme import (
    Unsteady_data,
    Elements_model,
    Cond_params,
    Pipe_params,
    Pump_params,
    Gate_valve_params,
    Save_valve_params,
)
from pprint import pprint


class L_and_num_of_elems(BaseModel):
    L: float
    N: int
    num_of_x_grid_nodes: int


k_list = []


# step:int=1000 #метры
def count_l_and_num_of_elems(
    elements: list[Elements_model],
):
    def sum_element_props(acc: L_and_num_of_elems, element: Elements_model) -> int:
        if element.type == "pipe":
            acc.L += element.length * 1000
            acc.N += element.length
            acc.num_of_x_grid_nodes += element.length
        elif element.type in ["provider", "consumer"]:
            acc.L += 1000
            acc.N += 1
            acc.num_of_x_grid_nodes += 1
        else:
            acc.num_of_x_grid_nodes += 2

        return acc

    initial_values = L_and_num_of_elems(**{"L": 0, "N": 0, "num_of_x_grid_nodes": 0})
    result = reduce(sum_element_props, elements, initial_values)
    return (result.L, round(result.N), round(result.num_of_x_grid_nodes))


def make_x(elements: list[Elements_model], L, N):

    dx = L / N
    x = 0
    xx = []
    for elem in elements:
        type_ = elem.type
        if type_ == "pump" or type_ == "gate_valve" or type_ == "safe_valve":
            xx.extend([x, x])
            x += dx
        elif type_ == "pipe":
            for j in range(round(elem.length)):
                xx.append(x)
                x += dx
        else:
            xx.append(x)
            x += dx
    return xx


def calculate(data: Unsteady_data):
    cond_params: Cond_params = data.cond_params
    elements: list[Elements_model] = data.pipeline
    t = 0
    g = 9.81
    c = bf.c

    v = cond_params.viscosity * 10 ** (-6)
    ro = cond_params.density
    t_rab = cond_params.time_to_iter
    L, N, num_of_x_grid_nodes = count_l_and_num_of_elems(elements)
    T = L / (N * c)
    # p10 = (0 - bf.vis_otm[0]) * ro * g
    # p20 = (0 - bf.vis_otm[N]) * ro * g

    V_O = [0] * num_of_x_grid_nodes
    H_O = [0] * num_of_x_grid_nodes

    Davleniya = [
        [(H_O[i] - bf.vis_otm[i]) * ro * g for i in range(num_of_x_grid_nodes)]
    ]
    Skorosty = [V_O]
    Napory = [H_O]

    t = 0
    times = []
    xx = make_x(elements, L, N)
    while t <= t_rab:
        pipes: list[Pipe_params] = list(
            filter(lambda elem: elem.type == "pipe", elements)
        )
        count_pipe_iter: int = 0
        iter = 0
        main = []
        for elem in elements:
            if elem.type == "provider":
                main.append(
                    bf.left_boundary_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        1 if elem.mode == "pressure" else 0,
                        elem.value,
                        pipes[count_pipe_iter].diameter,
                        v,
                        ro,
                        T,
                    )
                )
                iter += 1
            elif elem.type == "pump":
                main.append(
                    bf.pump_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        elem.coef_a,
                        elem.coef_b,
                        1 if elem.mode == "open" else 2,
                        1,
                        pipes[count_pipe_iter].diameter,
                        elem.duration,
                        elem.start_time,
                        t,
                        v,
                        ro,
                        T,
                    )
                )
                main.append(
                    bf.pump_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        elem.coef_a,
                        elem.coef_b,
                        1 if elem.mode == "open" else 2,
                        2,
                        pipes[count_pipe_iter].diameter,
                        elem.duration,
                        elem.start_time,
                        t,
                        v,
                        ro,
                        T,
                    )
                )
                iter += 2

            elif elem.type == "pipe":
                ran = (
                    elem.length - 2
                    if count_pipe_iter == 0 and len(pipes) == 1
                    else (
                        elem.length - 1
                        if count_pipe_iter == (len(pipes) - 1) or count_pipe_iter == 0
                        else elem.length
                    )
                )

                for j in range(round(ran)):
                    main.append(
                        bf.pipe_method(
                            Davleniya,
                            Skorosty,
                            iter,
                            pipes[count_pipe_iter].diameter,
                            v,
                            ro,
                            T,
                        )
                    )
                    iter += 1
                count_pipe_iter += 1 if len(pipes) - 1 != count_pipe_iter else 0

            elif elem.type == "gate_valve":
                main.append(
                    bf.tap_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        1,
                        1 if elem.mode == "open" else 2,
                        elem.start_time,
                        pipes[count_pipe_iter].diameter,
                        elem.duration,
                        elem.start_time,
                        t,
                        v,
                        ro,
                        T,
                    )
                )
                main.append(
                    bf.tap_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        2,
                        1 if elem.mode == "open" else 2,
                        elem.start_time,
                        pipes[count_pipe_iter].diameter,
                        elem.duration,
                        elem.start_time,
                        t,
                        v,
                        ro,
                        T,
                    )
                )
                iter += 2
            elif elem.type == "safe_valve":
                main.append(
                    bf.safe_valve_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        1,
                        elem.coef_q,
                        elem.max_pressure,
                        pipes[count_pipe_iter - 1].diameter,
                        pipes[count_pipe_iter].diameter,
                        v,
                        ro,
                        T,
                    )
                )
                main.append(
                    bf.safe_valve_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        2,
                        elem.coef_q,
                        elem.max_pressure,
                        pipes[count_pipe_iter - 1].diameter,
                        pipes[count_pipe_iter].diameter,
                        v,
                        ro,
                        T,
                    )
                )
                # k_list.append(main[-1][3])
                iter += 2
            elif elem.type == "consumer":
                main.append(
                    bf.right_boundary_method(
                        Davleniya,
                        Skorosty,
                        iter,
                        1 if elem.mode == "pressure" else 0,
                        elem.value,
                        pipes[count_pipe_iter - 1].diameter,
                        v,
                        ro,
                        T,
                    )
                )
                iter += 1

        times.append(t)
        t += T
        """Распаковка main"""
        p_moment = []
        V_moment = []
        H_moment = []
        for i in range(len(main)):
            p_moment.append(main[i][0])
            V_moment.append((main[i][1]))
            H_moment.append(main[i][2])

        Davleniya.append(p_moment)
        Skorosty.append(V_moment)
        Napory.append(H_moment)
        res = {
            # 'x': xx,
            "Davleniya": [
                {"x": x, "y": round(y / 10**6, 2)} for x, y in zip(xx, p_moment)
            ],
            "Skorosty": [{"x": x, "y": round(y, 2)} for x, y in zip(xx, V_moment)],
            "Napory": [{"x": x, "y": round(y, 2)} for x, y in zip(xx, H_moment)],
            "t": t,
            # 'max_val': (np.max(H_moment), np.max(p_moment), np.max(V_moment)),
            # 'min_val': (np.min(H_moment), np.min(p_moment), np.min(V_moment))
        }
        yield res


if __name__ == "__main__":

    params = Unsteady_data(
        cond_params={"time_to_iter": 500, "density": 800, "viscosity": 10},
        pipeline=[
            {
                "type": "provider",
                "mode": "pressure",
                "value": 0,
                "uiConfig": {"selected": False},
            },
            {
                "type": "pump",
                "coef_a": 310,
                "coef_b": 8e-7,
                "mode": "open",
                "start_time": 0,
                "duration": 20,
                "uiConfig": {"selected": False},
            },
            {
                "type": "pipe",
                "length": 100,
                "diameter": 1,
                "uiConfig": {"selected": False},
            },
            {
                "type": "gate_valve",
                "mode": "close",
                "start_time": 100,
                "duration": 100,
                "percentage": 100,
                "uiConfig": {"selected": False},
            },
            {
                "type": "pipe",
                "length": 30,
                "diameter": 1,
                "uiConfig": {"selected": False},
            },
            {
                "type": "pump",
                "coef_a": 302.06,
                "coef_b": 8.88e-7,
                "mode": "open",
                "start_time": 0,
                "duration": 20,
                "uiConfig": {"selected": False},
            },
            {
                "type": "pipe",
                "length": 10,
                "diameter": 1,
                "uiConfig": {"selected": False},
            },
            {
                "type": "safe_valve",
                "coef_q": 0.5,
                "max_pressure": 7,
                "uiConfig": {"selected": False},
            },
            {
                "type": "pipe",
                "length": 30,
                "diameter": 1,
                "uiConfig": {"selected": False},
            },
            {
                "type": "consumer",
                "mode": "pressure",
                "value": 0,
                "uiConfig": {"selected": False},
            },
        ],
    )
    generator = calculate(params)
    while True:
        a = next(generator)


# python3 -m services.unsteady_flow_calculation
