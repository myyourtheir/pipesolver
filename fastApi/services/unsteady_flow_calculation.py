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
    Boundary_params,
)


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
        else:
            acc.num_of_x_grid_nodes += 2

        return acc

    initial_values = L_and_num_of_elems(**{"L": 2000, "N": 2, "num_of_x_grid_nodes": 1})
    result = reduce(sum_element_props, elements, initial_values)  # 2 - граничные точки
    return (result.L, round(result.N), round(result.num_of_x_grid_nodes))


def make_x(elements: list[Elements_model], L, N):

    dx = L / N
    x = dx
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
    return xx


def calculate(data: Unsteady_data):
    cond_params: Cond_params = data.cond_params
    elements: list[Elements_model] = data.pipeline
    bound_params: dict[Union[Literal["right", "left"]], Boundary_params] = (
        data.boundary_params
    )
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

    V_O = [0.00000001] * num_of_x_grid_nodes
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
        # left_boundary
        main.append(
            bf.left_boundary_method(
                Davleniya,
                Skorosty,
                iter,
                1 if bound_params["left"].type == "pressure" else 0,
                bound_params["left"].value,
                pipes[count_pipe_iter].diameter,
                v,
                ro,
                T,
            )
        )
        iter += 1
        for elem in elements:

            if elem.type == "pump":
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
                        elem.start_time,
                        elem.duration,
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
                        elem.start_time,
                        elem.duration,
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
                count_pipe_iter += 1

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
                        elem.start_time,
                        elem.duration,
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
                        elem.start_time,
                        elem.duration,
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
                        pipes[count_pipe_iter].diameter,
                        pipes[count_pipe_iter + 1].diameter,
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
                        pipes[count_pipe_iter].diameter,
                        pipes[count_pipe_iter + 1].diameter,
                        v,
                        ro,
                        T,
                    )
                )
                # k_list.append(main[-1][3])
                iter += 2
            # right_boundary
            main.append(
                bf.right_boundary_method(
                    Davleniya,
                    Skorosty,
                    iter,
                    1 if bound_params["right"].type == "pressure" else 0,
                    bound_params["right"].value,
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
            V_moment.append(main[i][1])
            H_moment.append(main[i][2])
        Davleniya.append(p_moment)
        Skorosty.append(V_moment)
        Napory.append(H_moment)

        yield {
            # 'x': xx,
            "Davleniya": [{"x": x, "y": y / 10**6} for x, y in zip(xx, p_moment)],
            "Skorosty": [{"x": x, "y": y} for x, y in zip(xx, V_moment)],
            "Napory": [{"x": x, "y": y} for x, y in zip(xx, H_moment)],
            "t": t,
            # 'max_val': (np.max(H_moment), np.max(p_moment), np.max(V_moment)),
            # 'min_val': (np.min(H_moment), np.min(p_moment), np.min(V_moment))
        }
        # time.sleep(1)


if __name__ == "__main__":

    params = Unsteady_data(
        cond_params={"time_to_iter": 500, "density": 200, "viscosity": 200},
        pipeline=[
            {"type": "pipe", "diameter": 1000, "length": 20},
            # {"type": "pipe", "diameter": 20, "length": 20},
        ],
        boundary_params={
            "left": {"type": "speed", "value": 10},
            "right": {"type": "speed", "value": 10},
        },
    )

    generator = calculate(params)
    while True:
        a = next(generator)

# python3 -m services.unsteady_flow_calculation