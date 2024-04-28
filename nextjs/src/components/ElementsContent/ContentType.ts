import { ConsumerParams, GateValveParams, PipeParams, ProviderParams, PumpParams, SafeValveParams } from '../../../types/stateTypes'

export interface ElementContentType {
	defaultValues: any,
	onSubmit: (values: PipeParams | PumpParams | GateValveParams | SafeValveParams | ConsumerParams | ProviderParams) => void,
	submitButtonTitle: string,
}