import BinaryHeap from "../lib/heap";

describe("BinaryHeap test", () => {
	describe("push and pop test", () => {
		const heap = new BinaryHeap<number>();
		test("heap push and pop", () => {
			const input = [3, 5, 2, 4, 1];
			for (const value of input) heap.push(value);
			expect(heap.size).toBe(5);
			expect(heap.peek()).toBe(1);
			expect(heap.pop()).toBe(1);
			expect(heap.pop()).toBe(2);
			expect(heap.pop()).toBe(3);
			expect(heap.pop()).toBe(4);
			expect(heap.pop()).toBe(5);
			expect(heap.size).toBe(0);
		});
	});
	describe("max heap test", () => {
		const heap = new BinaryHeap<number>("max");
		test("max heap push and pop", () => {
			const input = [3, 5, 2, 4, 1];
			for (const value of input) heap.push(value);
			expect(heap.size).toBe(5);
			expect(heap.pop()).toBe(5);
			expect(heap.pop()).toBe(4);
			expect(heap.pop()).toBe(3);
			expect(heap.pop()).toBe(2);
			expect(heap.pop()).toBe(1);
			expect(heap.size).toBe(0);
		});
	});
	describe("custom comparator heap test", () => {
		const heap = new BinaryHeap<number>((a: number, b: number) => {
			if (a % 2 == 0 && b % 2 != 0) return -1;
			if (b % 2 == 0 && a % 2 != 0) return 1;
			return a - b;
		}); // 小さい順、ただし偶数は奇数より常に前
		test("custom heap push and pop", () => {
			const input = [3, 5, 2, 4, 1];
			for (const value of input) heap.push(value);
			expect(heap.size).toBe(5);
			expect(heap.pop()).toBe(2);
			expect(heap.pop()).toBe(4);
			expect(heap.pop()).toBe(1);
			expect(heap.pop()).toBe(3);
			expect(heap.pop()).toBe(5);
			expect(heap.size).toBe(0);
		});
	});
	describe("heap initializer test", () => {
		const heap = new BinaryHeap<number>(undefined, [3, 5, 2, 4, 1]);
		test("initialized heap pop", () => {
			expect(heap.size).toBe(5);
			expect(heap.pop()).toBe(1);
			expect(heap.pop()).toBe(2);
			expect(heap.pop()).toBe(3);
			expect(heap.pop()).toBe(4);
			expect(heap.pop()).toBe(5);
			expect(heap.size).toBe(0);
		});
	});
});