import {UnionFind} from "../lib/union_find";

describe("Union-Find", () => {
	const uf = new UnionFind(4);
	uf.unite(0, 1);
	uf.unite(0, 2);
	test("find root", () => {
		expect(uf.root(0)).toBe(0);
		expect(uf.root(1)).toBe(0);
		expect(uf.root(2)).toBe(0);
		expect(uf.root(3)).toBe(3);
	});
	test("check same group", () => {
		expect(uf.check(0, 1)).toBe(true);
		expect(uf.check(1, 0)).toBe(true);
		expect(uf.check(2, 0)).toBe(true);
		expect(uf.check(3, 0)).toBe(false);
		expect(uf.check(2, 2)).toBe(true);
	});
	test("get group size", () => {
		expect(uf.size(0)).toBe(3);
		expect(uf.size(1)).toBe(3);
		expect(uf.size(2)).toBe(3);
		expect(uf.size(3)).toBe(1);
	});
});
