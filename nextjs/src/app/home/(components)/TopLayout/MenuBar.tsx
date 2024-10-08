import { Input } from '@/components/ui/input'
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar"
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { Graph } from '@/utils/graph/Graph'
import { GraphNode } from '@/utils/graph/GraphNode'
import { ElementParamsUnion, UiConfig } from '../../../../../types/stateTypes'

type JsonGraphNode = {
	id: string,
	name: string
	value: ElementParamsUnion,
	children: string[],
	parents: string[],
	ui: UiConfig
}


function TopMenuBar() {
	const { pipeline, cond_params } = useUnsteadyInputStore()
	const handleSaveToPC = (jsonData: object, filename: string) => {
		const fileData = JSON.stringify(jsonData)
		const blob = new Blob([fileData], { type: "text/plain" })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.download = `${filename}.json`
		link.href = url
		link.click()
	}

	const handleGetFileFromPC = () => {
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
				console.log(edges)
				console.log(graph)
				useUnsteadyInputStore.setState({
					cond_params,
					pipeline: graph
				})
			}
		}
	}
	return (

		<Menubar className='rounded-none bg-inherit'>
			<MenubarMenu>
				<MenubarTrigger>
					Файл
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem
						onClick={e => handleGetFileFromPC()}
					>
						Загрузить
					</MenubarItem>
					<MenubarItem
						onClick={() => handleSaveToPC(
							{
								data: {
									cond_params,
									pipeline: pipeline.toObj({ withUi: true })
								}
							},
							`Схема от ${new Date().toLocaleString()}`
						)}
					>
						Сохранить
					</MenubarItem>
					<MenubarSeparator />
				</MenubarContent>
			</MenubarMenu>
		</Menubar>

	)
}

export default TopMenuBar