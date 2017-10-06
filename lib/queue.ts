export default class Queue<T> {
	private _in: Array<T>;
	private _out: Array<T>;

	get length(): number {
		return this._in.length + this._out.length;
	}

	constructor(iterable?: Iterable<T>) {
		this._in = iterable === undefined ? new Array<T>() : [...iterable];
		this._out = new Array<T>();
	}

	private _fix() {
		this._out = this._in.reverse().concat(this._out);
		this._in = new Array<T>();
	}

	push(value: T): void {
		this._in.push(value);
	}

	shift(): T | undefined {
		if (this._out.length == 0) this._fix();
		return this._out.pop();
	}

	toArray(): Array<T> {
		this._fix();
		return this._out.slice().reverse();
	}
}
