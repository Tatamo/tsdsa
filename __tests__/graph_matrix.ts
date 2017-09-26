import {MatrixGraph} from "../lib/graph";

const sample_input = `6
0 1 0 0 1 0
1 0 1 0 1 0
0 1 0 1 0 0
0 0 1 0 1 1
1 1 0 1 0 0
0 0 0 1 0 0`.split("\n");

const sample_matrix = [
	[0, 1, 0, 0, 1, 0],
	[1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 0],
	[0, 0, 1, 0, 1, 1],
	[1, 1, 0, 1, 0, 0],
	[0, 0, 0, 1, 0, 0]
];

const sample_matrix_inf = [
	[0, 1, Infinity, Infinity, 1, Infinity],
	[1, 0, 1, Infinity, 1, Infinity],
	[Infinity, 1, 0, 1, Infinity, Infinity],
	[Infinity, Infinity, 1, 0, 1, 1],
	[1, 1, Infinity, 1, 0, Infinity],
	[Infinity, Infinity, Infinity, 1, Infinity, 0]
];

const sample_list = [
	[{to: 1, cost: 1}, {to: 4, cost: 1}],
	[{to: 0, cost: 1}, {to: 2, cost: 1}, {to: 4, cost: 1}],
	[{to: 1, cost: 1}, {to: 3, cost: 1}],
	[{to: 2, cost: 1}, {to: 4, cost: 1}, {to: 5, cost: 1}],
	[{to: 0, cost: 1}, {to: 1, cost: 1}, {to: 3, cost: 1}],
	[{to: 3, cost: 1}]
];

const sample_wf_result = [
	[0, 1, 2, 2, 1, 3],
	[1, 0, 1, 2, 1, 3],
	[2, 1, 0, 1, 2, 2],
	[2, 2, 1, 0, 1, 1],
	[1, 1, 2, 1, 0, 2],
	[3, 3, 2, 1, 2, 0]
];

const sample_dijkstra_result_from_one = {
	cost: [1, 0, 1, 2, 1, 3],
	prev: [1, 1, 1, 2, 1, 3]
};

describe("Matrix Graph test", () => {
	const graph = new MatrixGraph(sample_input, 6, 1, {zero_as_no_edge: true});
	test("string input", () => {
		expect(new MatrixGraph(sample_input, 6, 1).getArray()).toEqual(sample_matrix);
		expect(new MatrixGraph(sample_input, 6, 1, {zero_as_no_edge: true}).getArray()).toEqual(sample_matrix_inf);
	});
	test("array input", () => {
		expect(new MatrixGraph(sample_matrix).getArray()).toEqual(sample_matrix);
		expect(new MatrixGraph(sample_matrix, {zero_as_no_edge: true}).getArray()).toEqual(sample_matrix_inf);
	});
	test("graph size", () => {
		expect(graph.size).toBe(6);
	});
	test("convert to list", () => {
		expect(graph.toList()).toEqual(sample_list);
	});
	test("Dijkstra", () => {
		expect(graph.dijkstra(1)).toEqual(sample_dijkstra_result_from_one);
	});
	test("Warshall-Floyd", () => {
		expect(graph.warshallFloyd()).toEqual(sample_wf_result);
	});
});
