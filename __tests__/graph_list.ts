import {ListGraph} from "../lib/graph";

const sample_input = `6
0 1 80
1 2 20
0 2 60
2 3 50
3 4 60
1 4 90`.split("\n");

const sample_list = [
	[{to: 1, cost: 80}, {to: 2, cost: 60}],
	[{to: 0, cost: 80}, {to: 2, cost: 20}, {to: 4, cost: 90}],
	[{to: 1, cost: 20}, {to: 0, cost: 60}, {to: 3, cost: 50}],
	[{to: 2, cost: 50}, {to: 4, cost: 60}],
	[{to: 3, cost: 60}, {to: 1, cost: 90}]
];

const sample_matrix = [
	[0, 80, 60, Infinity, Infinity],
	[80, 0, 20, Infinity, 90],
	[60, 20, 0, 50, Infinity],
	[Infinity, Infinity, 50, 0, 60],
	[Infinity, 90, Infinity, 60, 0]
];

const sample_dijkstra_result_from_one = {
	cost: [80, 0, 20, 70, 90],
	prev: [1, 1, 1, 2, 1]
};

const sample_bf_result_from_one = {
	has_negative_loop: false,
	cost: [80, 0, 20, 70, 90],
	prev: [1, 1, 1, 2, 1]
};

const sample_list_negative = [
	[{to: 1, cost: 5}, {to: 2, cost: 4}],
	[{to: 2, cost: -2}, {to: 3, cost: 1}],
	[{to: 3, cost: 2}, {to: 4, cost: 1}, {to: 5, cost: 4}],
	[{to: 1, cost: -1}, {to: 5, cost: 3}],
	[{to: 5, cost: 4}],
	[]
]; // 負閉路を含むグラフ

const sample_negative_bf_result_from_zero = {
	has_negative_loop: true,
	cost: [0, null, null, null, null, null],
	prev: [0, null, null, null, null, null]
};

describe("List Graph test", () => {
	const graph = new ListGraph(sample_input, 6, 1, {mutual_edge: true});
	test("string input", () => {
		expect(new ListGraph(sample_input, 6, 1, {mutual_edge: true}).getArray()).toEqual(sample_list);
	});
	test("array input", () => {
		expect(new ListGraph(sample_list).getArray()).toEqual(sample_list);
	});
	test("number of graph edges", () => {
		expect(graph.edges).toBe(12);
	});
	test("number of graph nodes", () => {
		expect(graph.size).toBe(5);
	});
	test("convert to matrix", () => {
		expect(graph.toMatrix()).toEqual(sample_matrix);
	});
	test("Dijkstra", () => {
		expect(graph.dijkstra(1)).toEqual(sample_dijkstra_result_from_one);
	});
	test("Dijkstra using BinaryHeap", () => {
		expect(graph.dijkstraPQ(1)).toEqual(sample_dijkstra_result_from_one);
	});
	test("bellmanFord", () => {
		expect(graph.bellmanFord(1)).toEqual(sample_bf_result_from_one);
	});
	test("bellmanFord when the graph has negative cycle", () => {
		const graph2 = new ListGraph(sample_list_negative);
		expect(graph2.bellmanFord(0)).toEqual(sample_negative_bf_result_from_zero);
	});
	test("Bigraph", () => {
		expect(graph.isBigraph().result).toBe(false);
	});
});
