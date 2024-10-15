import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { CondParams, ElementParamsUnion, JsonGraphNode, UiConfig, zCondParams, zElementParamsUnion, zJsonGraphNode, zUiConfig } from '../../../../../types/stateTypes'
import { Graph } from '@/utils/graph/Graph'
import { GraphNode } from '@/utils/graph/GraphNode'
import { set, z } from 'zod'
import { toast } from 'sonner'
import { useCallback, useState } from 'react'


// type JsonGraphNode = {
// 	id: string,
// 	name: string
// 	value: ElementParamsUnion,
// 	children: string[],
// 	parents: string[],
// 	ui: UiConfig
// }

type JsonFile = {
	data: {
		cond_params: CondParams,
		pipeline: Record<string, JsonGraphNode>
	}
}
const zSchema = z.object({
	data: z.object({
		cond_params: zCondParams,
		pipeline: z.record(z.string(), zJsonGraphNode)
	})
})
function useHandleFileSave() {
	const [title, setTitle] = useState<string>('Схема от ' + new Date().toLocaleString())
	const handleSaveToPC = useCallback((jsonData: object) => {
		const fileData = JSON.stringify(jsonData)
		const blob = new Blob([fileData], { type: "text/plain" })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.download = `${title}.json`
		link.href = url
		link.click()
	}, [title])

	const handleGetFileFromPC = useCallback(() => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'text/json'
		input.click()
		// TODO Не обрабатывается неверный формат файла
		input.onchange = (e) => {
			// @ts-ignore
			const file = e.target.files[0]
			const reader = new FileReader()
			reader.readAsText(file)
			reader.onload = (e) => {
				// @ts-ignore
				const json = JSON.parse(e.target.result)
				try {
					zSchema.parse(json)
				} catch {
					toast.warning("Некорректный формат файла")
					return
				}
				const { data } = json
				const { cond_params } = data
				const pipeline: Record<string, JsonGraphNode> = data.pipeline
				// Создаем граф на основе json файла
				const graph = new Graph()
				const nodesArr = Object.values(pipeline)
				nodesArr.forEach((elem) => {
					const { ui, value, id, name } = elem
					graph.addNode(new GraphNode(value, ui, id, name))
				})
				// Добавляем связи
				const edges = new Set<string>()
				nodesArr.forEach((elem) => {
					const { id, children, parents } = elem
					if (children) {
						children.forEach((child) => {
							const sourceNode = graph.nodes.find(node => node.id === id)!
							const destinationNode = graph.nodes.find(node => node.id === child)!
							if (!edges.has(sourceNode.id + '' + destinationNode.id)) {
								edges.add(sourceNode.id + '' + destinationNode.id)
								graph.addEdge(sourceNode, destinationNode)
							}

						})
					}
					if (parents) {
						parents.forEach((parent) => {
							const sourceNode = graph.nodes.find(node => node.id === parent)!
							const destinationNode = graph.nodes.find(node => node.id === id)!
							if (!edges.has(sourceNode.id + '' + destinationNode.id)) {
								edges.add(sourceNode.id + '' + destinationNode.id)
								graph.addEdge(sourceNode, destinationNode)
							}
						})
					}
				})
				useUnsteadyInputStore.setState({
					cond_params,
					pipeline: graph
				})

			}
		}
	}, [])
	return { handleGetFileFromPC, handleSaveToPC, setTitle, title }
}


export default useHandleFileSave