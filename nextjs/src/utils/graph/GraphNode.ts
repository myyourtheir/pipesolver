import { ElementParamsUnion, UiConfig } from '../../../types/stateTypes'
import { typesToNames } from './typesToNames'

export class GraphNode {
	id: string
	name: string
	value: ElementParamsUnion
	children: GraphNode[]
	parents: GraphNode[]
	ui: UiConfig

	constructor(value: ElementParamsUnion, ui: UiConfig, id?: string, name?: string) {
		if (!id) {
			const id = `${Date.now()}`.slice(9, 13)
			// const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
			this.id = id
		} else {
			this.id = id
		}
		if (!name) {
			this.name = typesToNames[value.type].name + ' ' + this.id
		} else {
			this.name = name
		}
		this.value = value
		this.children = []
		this.parents = []
		this.ui = ui
	}
	hasChild() {
		return this.children.length !== 0 ? true : false
	}
	hasParent() {
		return this.parents.length !== 0 ? true : false
	}
	addChild(node: GraphNode) {
		this.children.push(node)
	}
	addParent(node: GraphNode) {
		this.parents.push(node)
	}
	removeChild(child: GraphNode) {
		this.children = this.children.filter(node => node !== child)
	}
	removeParent(parent: GraphNode) {
		this.parents = this.parents.filter(node => node !== parent)
	}

	getNeighbours() {
		return [...this.children, ...this.parents]
	}
	removeNeighbours() {
		this.children = []
		this.parents = []
	}
}