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
});
