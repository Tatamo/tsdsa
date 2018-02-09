import BinaryHeap from "./heap";

export type MatrixGraphArray = Array<Array<number>>;

export interface MatrixGraphConstructorOption {
	zero_as_no_edge?: boolean;
}

export class MatrixGraph {
	private matrix: MatrixGraphArray;
	private zero_as_no_edge: boolean;
	private _size: number;
	get size(): number {
		return this._size;
	}

	constructor(input: MatrixGraphArray, option?: MatrixGraphConstructorOption);
	constructor(input: Array<string>, n: number, index_offset?: number, option?: MatrixGraphConstructorOption);
	constructor(input: MatrixGraphArray | Array<string>, a?: number | MatrixGraphConstructorOption, index_offset?: number, option?: MatrixGraphConstructorOption) {
		// set default option
		if (typeof a !== "number") option = a;
		if (option === undefined) {
			option = {zero_as_no_edge: false};
		}
		else {
			if (option.zero_as_no_edge === undefined) option.zero_as_no_edge = false;
		}
		this.zero_as_no_edge = option.zero_as_no_edge!;

		// コンストラクタ引数によって振り分け
		if (typeof(a) === "number") {
			this.initString(input as Array<string>, a as number, index_offset !== undefined ? index_offset : 0, option);
		}
		else if (input.length === 0 || Array.isArray(input[0])) {
			this.initArray(input as MatrixGraphArray, option);
		}
		else {
			throw Error("invalid graph input");
		}
	}

	private initArray(input: MatrixGraphArray, option: MatrixGraphConstructorOption) {
		this._size = input.length;
		this.matrix = new Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			this.matrix[i] = input[i].slice();
			if (option.zero_as_no_edge) {
				for (let ii = 0; ii < this.size; ii++) {
					if (i != ii && this.matrix[i][ii] === 0) {
						this.matrix[i][ii] = Infinity;
					}
				}
			}
		}
	}

	private initString(input: Array<string>, n: number, index_offset: number, option: MatrixGraphConstructorOption) {
		this._size = n;
		this.matrix = new Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			this.matrix[i] = input[i + index_offset].split(" ").map((x: string): number => +x);
			if (option.zero_as_no_edge) {
				for (let ii = 0; ii < this.size; ii++) {
					if (i != ii && this.matrix[i][ii] === 0) {
						this.matrix[i][ii] = Infinity;
					}
				}
			}
		}
	}

	getArray(prevent_copy: boolean = false): MatrixGraphArray {
		if (prevent_copy) return this.matrix;
		// コピーを返す
		const result = new Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			result[i] = this.matrix[i].slice();
		}
		return result;
	}

	toList(): ListGraphArray {
		const result = new Array<Array<ListGraphEdge>>(this.size);
		for (let i = 0; i < this.size; i++) result[i] = new Array<ListGraphEdge>();
		for (let from = 0; from < this.size; from++) {
			for (let to = 0; to < this.size; to++) {
				if (from === to && this.matrix[from][to] === 0) continue;
				else if (this.zero_as_no_edge && this.matrix[from][to] === 0) continue;
				else if (this.matrix[from][to] === Infinity) continue;
				result[from].push({to, cost: this.matrix[from][to]});
			}
		}
		return result;
	}

	dijkstra(start: number): { cost: Array<number>, prev: Array<number> } {
		const size = this.matrix.length;
		const visited = new Array<boolean>(size);
		for (let i = 0; i < size; i++) visited[i] = false;
		const min_cost = new Array<number>(size); // startからの最短距離
		min_cost.fill(Infinity);
		min_cost[start] = 0;
		const prev = new Array<number>(size); // 直前に訪れるノード
		prev.fill(-1);
		prev[start] = start;

		while (true) {
			let node = -1;
			for (let i = 0; i < size; i++) {
				if (!visited[i] && (node === -1 || min_cost[i] < min_cost[node])) node = i;
			}
			if (node === -1) break;
			visited[node] = true;
			for (let i = 0; i < size; i++) {
				const cost = this.matrix[node][i];
				if (cost < 0) {
					throw Error("edge cannot have a cost that is less than 0");
				}
				if (min_cost[node] + cost < min_cost[i]) {
					min_cost[i] = min_cost[node] + cost;
					prev[i] = node;
				}
			}
		}
		return {cost: min_cost, prev};
	}

	warshallFloyd(): MatrixGraphArray {
		// initialize
		const result: MatrixGraphArray = Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			result[i] = this.matrix[i].slice();
		}

		// wf
		for (let i = 0; i < this.size; i++) {
			for (let ii = 0; ii < this.size; ii++) {
				for (let iii = 0; iii < this.size; iii++) {
					result[ii][iii] = Math.min(result[ii][iii], result[ii][i] + result[i][iii]);
				}
			}
		}
		return result;
	}
}

export interface ListGraphEdge {
	to: number;
	cost: number;
}

export type ListGraphArray = Array<Array<ListGraphEdge>>;

export interface ListGraphConstructorOption {
	no_input_cost?: boolean;
	mutual_edge?: boolean;
}

export class ListGraph {
	private list: ListGraphArray;
	private _edges: number;
	get edges(): number {
		return this._edges;
	}

	get size(): number {
		return this.list.length;
	}

	constructor(input: ListGraphArray, option?: ListGraphConstructorOption);
	constructor(input: Array<string>, edges: number, index_offset?: number, option?: ListGraphConstructorOption);
	constructor(input: ListGraphArray | Array<string>, a?: ListGraphConstructorOption | number, index_offset?: number, option?: ListGraphConstructorOption) {
		// set default option
		if (typeof a !== "number") option = a;
		if (option === undefined) {
			option = {no_input_cost: false, mutual_edge: false};
		}
		else {
			if (option.no_input_cost === undefined) option.no_input_cost = false;
			if (option.mutual_edge === undefined) option.mutual_edge = false;
		}

		// コンストラクタ引数によって振り分け
		if (typeof a === "number") {
			if (index_offset === undefined) index_offset = 0;
			this.initString(input as Array<string>, a, index_offset, option);
		}
		else if (input.length === 0 || Array.isArray(input[0])) {
			this.initArray(input as ListGraphArray);
		}
		else {
			throw Error("invalid graph input");
		}
	}

	// TODO: 無向グラフに
	private initArray(input: ListGraphArray) {
		this._edges = 0;
		this.list = new Array<Array<ListGraphEdge>>(input.length);
		for (let i = 0; i < input.length; i++) {
			this.list[i] = new Array<ListGraphEdge>();
			for (const edge of input[i]) {
				this.list[i].push({to: edge.to, cost: edge.cost});
				this._edges += 1;
			}
		}
	}

	private initString(input: Array<string>, edges: number, index_offset: number, option: ListGraphConstructorOption) {
		this._edges = edges;
		this.list = new Array<Array<ListGraphEdge>>();
		for (let i = 0; i < this.edges; i++) {
			const [from, to, _cost] = input[i + index_offset].split(" ").map((x: string): number => +x);
			let cost = _cost;
			if (option.no_input_cost) cost = 1; // コストが与えられない場合すべてコスト1

			// 未定義部分は[]で埋める
			const len = Math.max(from, to) + 1;
			while (this.list.length < len) {
				this.list.push(new Array<ListGraphEdge>());
			}

			// 辺を張る
			this.list[from].push({to, cost});
			if (option.mutual_edge) this.list[to].push({to: from, cost}); // 双方向に辺を張る
		}
		if (option.mutual_edge) this._edges *= 2;
	}

	getArray(prevent_copy: boolean = false): ListGraphArray {
		if (prevent_copy) return this.list;
		// コピーを返す
		const result = new Array<Array<ListGraphEdge>>(this.list.length);
		for (let i = 0; i < this.list.length; i++) {
			result[i] = new Array<ListGraphEdge>();
			for (const edge of this.list[i]) {
				result[i].push({to: edge.to, cost: edge.cost});
			}
		}
		return result;
	}

	toMatrix(): MatrixGraphArray {
		const size = this.list.length;
		const result = new Array<Array<number>>(size);
		for (let i = 0; i < size; i++) {
			result[i] = new Array<number>(size);
			for (let ii = 0; ii < size; ii++) {
				if (i === ii) result[i][ii] = 0;
				else result[i][ii] = Infinity;
			}
		}
		for (let from = 0; from < this.list.length; from++) {
			for (const {to, cost} of this.list[from]) {
				result[from][to] = cost;
			}
		}
		return result;
	}

	dijkstra(start: number): { cost: Array<number>, prev: Array<number> } {
		const size = this.list.length;
		const visited = new Array<boolean>(size);
		for (let i = 0; i < size; i++) visited[i] = false;
		const min_cost = new Array<number>(size); // startからの最短距離
		min_cost.fill(Infinity);
		min_cost[start] = 0;
		const prev = new Array<number>(size); // 直前に訪れるノード
		prev.fill(-1);
		prev[start] = start;

		while (true) {
			let node = -1;
			for (let i = 0; i < size; i++) {
				if (!visited[i] && (node === -1 || min_cost[i] < min_cost[node])) node = i;
			}
			if (node === -1) break;
			visited[node] = true;
			for (const {to, cost} of this.list[node]) {
				if (cost < 0) {
					throw Error("edge cannot have a cost that is less than 0");
				}
				if (min_cost[node] + cost < min_cost[to]) {
					min_cost[to] = min_cost[node] + cost;
					prev[to] = node;
				}
			}
		}
		return {cost: min_cost, prev};
	}

	// BinaryHeapによる優先度付きキューを用いたダイクストラ
	dijkstraPQ(start: number): { cost: Array<number>, prev: Array<number> } {
		const size = this.list.length;

		// 最短距離の小さい順に取り出すヒーブ
		const heap = new BinaryHeap<{ min_cost: number, node_index: number }>((a, b) => {
			if (a.min_cost != b.min_cost) return a.min_cost - b.min_cost;
			return a.node_index - b.node_index;
		}, [{min_cost: 0, node_index: start}]);
		const min_cost = new Array<number>(size); // startからの最短距離
		min_cost.fill(Infinity);
		min_cost[start] = 0;
		const prev = new Array<number>(size); // 直前に訪れるノード
		prev.fill(-1);
		prev[start] = start;

		while (heap.size > 0) {
			const top = heap.pop()!;
			if (min_cost[top.node_index] < top.min_cost) continue; // 取り出した値が最短距離でない場合、無視する
			for (const {to, cost} of this.list[top.node_index]) {
				if (cost < 0) {
					throw Error("edge cannot have a cost that is less than 0");
				}
				if (min_cost[top.node_index] + cost < min_cost[to]) {
					min_cost[to] = min_cost[top.node_index] + cost;
					prev[to] = top.node_index;
					heap.push({min_cost: min_cost[to], node_index: to});
				}
			}
		}
		return {cost: min_cost, prev};
	}

	// O(VE)
	bellmanFord(start: number): { has_negative_loop: false, cost: Array<number>, prev: Array<number> } | { has_negative_loop: true, cost: Array<number | null>, prev: Array<number | null> } {
		const size = this.list.length;
		const min_cost = new Array<number>(size); // startからの最短距離
		min_cost.fill(Infinity);
		min_cost[start] = 0;
		const prev = new Array<number>(size); // 直前に訪れるノード
		prev.fill(-1);
		prev[start] = start;
		const correct = new Array<boolean>(size); // 正しい最短経路が求まっているかどうか
		correct.fill(true);
		let loop_count = 0;
		let flg_contain_negative = false;
		let flg_update = true;
		while (flg_update) {
			flg_update = false;
			for (let from = 0; from < size; from++) {
				for (const {to, cost} of this.list[from]) {
					if (min_cost[from] != Infinity && min_cost[to] > min_cost[from] + cost) {
						min_cost[to] = min_cost[from] + cost;
						prev[to] = from;
						flg_update = true;
						if (flg_contain_negative) {
							// V回目以降に最短距離が更新されるなら、負閉路を通っているので正しくない
							correct[to] = false;
						}
					}
				}
			}
			loop_count += 1;
			if (loop_count === size) {
				// 頂点の数だけ更新してもループがとまらない -> 負閉路が存在する
				flg_contain_negative = true;
			}
			if (loop_count === size * 2) break; // 頂点の数*2回より多くループする意味はない
		}
		if (flg_contain_negative) {
			// 正しく最短距離が求められない頂点の結果はnullとする
			const min_cost_with_undefined: Array<number | null> = min_cost;
			const prev_with_undefined: Array<number | null> = prev;
			for (let i = 0; i < size; i++) {
				if (!correct[i]) {
					min_cost_with_undefined[i] = prev_with_undefined[i] = null;
				}
			}
			return {has_negative_loop: true, cost: min_cost_with_undefined, prev: prev_with_undefined};
		}
		else {
			return {has_negative_loop: false, cost: min_cost, prev};
		}
	}

	// 2部グラフ判定
	// TODO: 有向グラフ対応
	isBigraph(): { result: false } | { result: true, colors: Array<-1 | 1> } {
		const size = this.list.length;
		const color = new Array(size + 1).fill(0);
		const stack = [];
		for (let i = 0; i < size; i++) {
			if (color[i] != 0) continue;
			color[i] = 1;
			stack.push(i);
			while (stack.length > 0) {
				const node: number = stack.pop()!;
				for (const edge of this.list[node]) {
					if (color[edge.to] === color[node]) return {result: false};
					if (color[edge.to] === 0) {
						color[edge.to] = -color[node];
						stack.push(edge.to);
					}
				}
			}
		}
		return {result: true, colors: color};
	}
}
