import {UnionFind} from "../lib/union_find";

describe("Union-Find", () => {
	const uf = UnionFind(4);
	uf.unite(0, 1);
	uf.unite(0, 2);
	test("find root", () => {
		expect(uf.find(0)).toBe(0);
		expect(uf.find(1)).toBe(0);
		expect(uf.find(2)).toBe(0);
		expect(uf.find(3)).toBe(3);
	});
});
