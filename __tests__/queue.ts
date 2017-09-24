import {Queue} from "../lib/queue";

describe("Queue test", () => {
	describe("queue shift", () => {
		const queue = new Queue();
		queue.push(1);
		queue.push(2);
		queue.push(3);
		test("shift 1", () => {
			expect(queue.shift()).toBe(1);
		});
		test("shift 2", () => {
			expect(queue.shift()).toBe(2);
		});
		test("shift 3", () => {
			expect(queue.shift()).toBe(3);
		});
		test("empty queue", () => {
			expect(queue.length).toBe(0);
		});
		test("shift undefined", () => {
			expect(queue.shift()).toBeUndefined();
		});
	});
	describe("queue initializer", () => {
		const queue = new Queue([5, 6, 7]);
		test("shift 5", () => {
			expect(queue.shift()).toBe(5);
		});
		test("shift 6", () => {
			expect(queue.shift()).toBe(6);
		});
		test("shift 7", () => {
			expect(queue.shift()).toBe(7);
		});
		test("empty queue", () => {
			expect(queue.length).toBe(0);
		});
	});
	describe("queue toArray", () => {
		const queue = new Queue([1, 10, 100]);
		test("shift 1", () => {
			queue.push(9);
			expect(queue.shift()).toBe(1);
		});
		test("queue length is 3", () => {
			expect(queue.length).toBe(3);
		});
		test("queue length is 5", () => {
			queue.push(99);
			queue.push(999);
			expect(queue.length).toBe(5);
		});
		test("toArray", () => {
			expect(queue.toArray()).toEqual([10, 100, 9, 99, 999]);
		});
		test("shift 999", () => {
			queue.shift();
			queue.shift();
			queue.shift();
			queue.shift();
			expect(queue.shift()).toBe(999);
		});
		test("shift undefined", () => {
			expect(queue.shift()).toBeUndefined();
		});
		test("shift undefined", () => {
			expect(queue.shift()).toBeUndefined();
		});
	});
});

