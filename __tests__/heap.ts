import BinaryHeap from "../lib/heap";

describe("BinaryHeap test", () => {
	const heap = new BinaryHeap<number>();
	test("heap push and pop", () => {
		const input = [3, 5, 2, 4, 1];
		for (const value of input) heap.push(value);
		expect(heap.size).toBe(5);
		expect(heap.pop()).toBe(1);
		expect(heap.pop()).toBe(2);
		expect(heap.pop()).toBe(3);
		expect(heap.pop()).toBe(4);
		expect(heap.pop()).toBe(5);
		expect(heap.size).toBe(0);
	});
});