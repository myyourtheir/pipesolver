import { ConsumerParams, ElementParamsUnion, GateValveParams, PipeParams, ProviderParams, PumpParams, SafeValveParams } from '../../../types/stateTypes'

export interface ElementContentType {
	defaultValues: any,
	onSubmit: (values: ElementParamsUnion) => void,
	submitButtonTitle: string,
}