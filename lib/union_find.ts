export class UnionFind {
	private _parent: Array<number>;
	private _rank: Array<number>;
	private _length: number;
	get length(): number {
		return this._length;
	}
	constructor(length: number) {
		this._length = length;
		this._parent = new Array(length);
		for (let i = 0; i < length; i++) {
			this._parent[i] = i;
		}
		this._rank = new Array(length).fill(1);
	}
	root(node: number): number {
		const stack: Array<number> = [node];
		while (true) {
			const top = stack[stack.length - 1];
			const p = this._parent[top];
			if (p === top) {
				break;
			}
			else {
				stack.push(p);
			}
		}
		const result = stack.pop()!;
		while (stack.length > 0) {
			this._parent[stack.pop()!] = result;
		}
		return result;
	}
	check(x: number, y: number): boolean {
		return this.root(x) === this.root(y);
	}
	unite(x: number, y: number) {
		console.log(this.root(y));
		x = this.root(x);
		y = this.root(y);
		if (this._rank[x] >= this._rank[y]) {
			this._parent[y] = this._parent[x];
			if (this._rank[x] === this._rank[y]) {
				this._rank[y] += 1;
			}
		}
		else {
			this._parent[x] = this._parent[y];
		}
		return 0;
	}
}
