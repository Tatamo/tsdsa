export type MatrixGraphArray = Array<Array<number>>;


export interface MatrixGraphConstructorOption {
	zero_as_no_edge: boolean
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
			this.initArray(<MatrixGraphArray>input, <MatrixGraphConstructorOption>a);
		}
		else if (a !== undefined) {
			this.initString(<Array<string>>input, <number>a, index_offset, option);
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
			if(flg_fill_inf) {
				for (let ii = 0; ii < this.size; ii++) {
					if(i != ii && this.matrix[i][ii] == 0){
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
			if(flg_fill_inf) {
				for (let ii = 0; ii < this.size; ii++) {
					if(i != ii && this.matrix[i][ii] == 0){
						this.matrix[i][ii] = Infinity;
					}
				}
			}
		}
	}

	getArray(): MatrixGraphArray {
		// コピーを返す
		let result = new Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			result[i] = this.matrix[i].slice();
		}
		return result;
	}

	warshallFloyd(): MatrixGraphArray {
		// initialize
		let result: MatrixGraphArray = Array<Array<number>>(this.size);
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
