export type MatrixGraphArray = Array<Array<number>>;

export interface MatrixGraphConstructorOption {
	zero_as_no_edge: boolean;
}

export class MatrixGraph {
	private matrix: MatrixGraphArray;
	private _size: number;
	get size(): number {
		return this._size;
	}

	constructor(input: MatrixGraphArray, option?: MatrixGraphConstructorOption);
	constructor(input: Array<string>, n: number, index_offset?: number, option?: MatrixGraphConstructorOption);
	constructor(input: MatrixGraphArray | Array<string>, a?: number | MatrixGraphConstructorOption, index_offset?: number, option?: MatrixGraphConstructorOption) {
		if (input.length == 0) {
			this.matrix = [];
		}
		else if (Array.isArray(input[0])) {
			this.initArray(input as MatrixGraphArray, a as MatrixGraphConstructorOption);
		}
		else if (a !== undefined) {
			this.initString(input as Array<string>, a as number, index_offset, option);
		}
		else {
			throw Error("invalid graph input");
		}
	}

	private initArray(input: MatrixGraphArray, option?: MatrixGraphConstructorOption) {
		const flg_fill_inf: boolean = option !== undefined ? option.zero_as_no_edge : false;
		this._size = input.length;
		this.matrix = new Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			this.matrix[i] = input[i].slice();
			if (flg_fill_inf) {
				for (let ii = 0; ii < this.size; ii++) {
					if (i != ii && this.matrix[i][ii] == 0) {
						this.matrix[i][ii] = Infinity;
					}
				}
			}
		}
	}

	private initString(input: Array<string>, n: number, index_offset?: number, option?: MatrixGraphConstructorOption) {
		const flg_fill_inf: boolean = option !== undefined ? option.zero_as_no_edge : false;
		this._size = n;
		this.matrix = new Array<Array<number>>(this.size);
		const offset = index_offset !== undefined ? index_offset : 0;
		for (let i = 0; i < this.size; i++) {
			this.matrix[i] = input[i + offset].split(" ").map((x: string): number => +x);
			if (flg_fill_inf) {
				for (let ii = 0; ii < this.size; ii++) {
					if (i != ii && this.matrix[i][ii] == 0) {
						this.matrix[i][ii] = Infinity;
					}
				}
			}
		}
	}

	getArray(): MatrixGraphArray {
		// コピーを返す
		const result = new Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			result[i] = this.matrix[i].slice();
		}
		return result;
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
	not_include_zero_as_node?: boolean;
}

export class ListGraph {
	private list: ListGraphArray;
	private not_include_zero_as_node: boolean;
	private _edges: number;
	get edges(): number {
		return this._edges;
	}

	constructor(input: ListGraphArray, option?: ListGraphConstructorOption);
	constructor(input: Array<string>, edges: number, index_offset?: number, option?: ListGraphConstructorOption);
	constructor(input: ListGraphArray | Array<string>, a?: ListGraphConstructorOption | number, index_offset?: number, option?: ListGraphConstructorOption) {
		if (!(typeof a == "number")) {
			option = a;
		}
		// set default option
		if (option === undefined) {
			option = {no_input_cost: false, mutual_edge: false, not_include_zero_as_node: false};
		}
		else {
			if (option.no_input_cost === undefined) option.no_input_cost = false;
			if (option.mutual_edge === undefined) option.mutual_edge = false;
			if (option.not_include_zero_as_node === undefined) option.not_include_zero_as_node = false;
		}

		this.not_include_zero_as_node = option.not_include_zero_as_node!;

		if (typeof a == "number") {
			if (index_offset === undefined) index_offset = 0;
			this.initString(input as Array<string>, a, index_offset, option);
		}
		else if (input.length == 0 || Array.isArray(input[0])) {
			this.initArray(input as ListGraphArray);
		}
		else {
			throw Error("invalid graph input");
		}
	}

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
			if (len > this.list.length) {
				for (let ii = 0; ii < len - (this.list.length - 1); ii++) {
					this.list.push(new Array<ListGraphEdge>());
				}
			}

			// 辺を張る
			this.list[from].push({to, cost});
			if (option.mutual_edge) this.list[to].push({to: from, cost}); // 双方向に辺を張る
		}
		if (option.mutual_edge) this._edges *= 2;
	}

	getArray(): ListGraphArray {
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

}

