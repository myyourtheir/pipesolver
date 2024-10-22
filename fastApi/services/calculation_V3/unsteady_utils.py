from schemas.unsteady_flow_ws_scheme import Result_unsteady_data


class Unsteady_Utils:
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
