export type MatrixGraphArray = Array<Array<number>>;

export class MatrixGraph {
	private matrix: MatrixGraphArray;
	private _size: number;
	get size(): number {
		return this._size;
	}

	constructor(input: MatrixGraphArray);
	constructor(input: Array<string>, n: number, index_offset?: number);
	constructor(input: MatrixGraphArray | Array<string>, n?: number, index_offset?: number) {
		if (input.length == 0) {
			this.matrix = [];
		}
		else if (Array.isArray(input[0])) {
			this.initArray(<MatrixGraphArray>input);
		}
		else if (n !== undefined) {
			this.initString(<Array<string>>input, n, index_offset);
		}
		else{
			throw Error("invalid graph input");
		}
	}

	private initArray(input: MatrixGraphArray) {
		this._size = input.length;
		this.matrix = new Array<Array<number>>(this.size);
		for (let i = 0; i < this.size; i++) {
			this.matrix[i] = input[i].slice();
		}
	}

	private initString(input: Array<string>, n: number, index_offset?: number) {
		this._size = n;
		this.matrix = new Array<Array<number>>(this.size);
		const offset = index_offset !== undefined ? index_offset : 0;
		for (let i = 0; i < this.size; i++) {
			this.matrix[i] = input[i + offset].split(" ").map((x: string): number => +x);
		}
	}

	getArray(): MatrixGraphArray {
		// コピーを返す
		let result = new Array<Array<number>>(this.size);
		for(let i=0; i<this.size; i++){
			result[i] = this.matrix[i].slice();
		}
		return result;
	}
}
