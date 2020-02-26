export default class ModInt {
	constructor(public readonly value: number, public readonly mod: number) {
		this.value %= mod;
		if (this.value < 0) this.value += mod;
	}
	public add(value: number): ModInt;
	public add(value: ModInt): ModInt;
	public add(value: number | ModInt): ModInt {
		if (typeof value === "number") {
			return new ModInt(this.value + (value % this.mod), this.mod);
		}
		else {
			if (value.mod !== this.mod) throw new Error("the mods are not same");
			return new ModInt(this.value + value.value, this.mod);
		}
	}
	public sub(value: number): ModInt;
	public sub(value: ModInt): ModInt;
	public sub(value: number | ModInt): ModInt {
		if (typeof value === "number") {
			return this.add(-value);
		}
		else {
			if (value.mod !== this.mod) throw new Error("the mods are not same");
			return this.add(new ModInt(-value.value, this.mod));
		}
	}
	public mul(value: number): ModInt;
	public mul(value: ModInt): ModInt;
	public mul(value: number | ModInt): ModInt {
		if (typeof value === "number") {
			return new ModInt(ModInt.multiplyMod(this.value, value, this.mod), this.mod);
		}
		else {
			if (value.mod !== this.mod) throw new Error("the mods are not same");
			return this.mul(value.value);
		}
	}
	public div(value: number): ModInt;
	public div(value: ModInt): ModInt;
	public div(value: number | ModInt): ModInt {
		if (typeof value === "number") {
			return new ModInt(value, this.mod).inverse().mul(this.value);
		}
		else {
			if (value.mod !== this.mod) throw new Error("the mods are not same");
			return value.inverse().mul(this);
		}
	}
	public inverse(): ModInt {
		if (ModInt.gcd(this.value, this.mod) !== 1) throw new Error(`${this.value} is not coprime to ${this.mod}`);
		const a = new ModInt(ModInt.gcdEx(this.value, this.mod)[0], this.mod);
		if ((a.value * this.value) % this.mod !== 1) throw new Error(`${a} is not inverse of ${this.value}!`);
		return new ModInt(ModInt.gcdEx(this.value, this.mod)[0], this.mod);
	}
	public pow(n: number): ModInt {
		const rem = (x: number, y: number): number => x === Infinity ? Infinity : x % y;
		const powMod = (x: number, n: number): number => {
			if (n <= 0) return 1;
			if (n % 2 === 0) return powMod(rem(ModInt.multiplyMod(x, x, this.mod), this.mod), n / 2);
			else return rem(ModInt.multiplyMod(x, powMod(x, n - 1), this.mod), this.mod);
		};
		return new ModInt(powMod(this.value, n), this.mod);
	}

	/**
	 * binomial coefficients nCk
	 * @param n 
	 * @param k 
	 * @param mod
	 */
	public static combination(n: number, k: number, mod: number): ModInt
	public static combination(n: ModInt, k: ModInt): ModInt
	public static combination(n: number | ModInt, k: number | ModInt, mod?: number): ModInt {
		if (typeof n === "number" && typeof k === "number" && typeof mod === "number") {
			n = new ModInt(n, mod);
			k = new ModInt(k, mod);
		}
		if (typeof n === "number" || typeof k === "number") throw new Error("argument type mismatched");
		if (n.mod !== k.mod) throw new Error("the mods are not same");
		const m = n.mod;
		const modint = (x: number) => new ModInt(x, m);

		if (n.value <= 0 || k.value <= 0) return modint(1);
		let result = modint(1);
		for (let i = 1; i <= k.value; i++) {
			result = result.mul(n.value - i + 1);
			result = result.div(i);
		}
		return result;
	}

	/**
	 * avoid overflow and calc x*y%mod
	 * @param x non-negative int
	 * @param y non-negative int
	 * @param mod 
	 */
	private static multiplyMod(x: number, y: number, mod: number): number {
		if (x * y < Number.MAX_SAFE_INTEGER) return x * y % mod;
		// avoid overflow
		const multiplymod = (x: number, y: number): number => {
			if (y <= 0) return 0;
			if (y % 2 === 0) return ModInt.multiplyMod(x, y / 2, mod) * 2 % mod;
			else return ModInt.multiplyMod(x, y - 1, mod) + x % mod;
		}
		return multiplymod(x, y);
	};

	/**
	 * get a maximum number z s.t. x%z==0 && x%y==0
	 */
	private static gcd(x: number, y: number): number {
		if (y === 0) return x;
		return ModInt.gcd(y, x % y);
	}
	/**
	 * get one (a,b) pair that satisfies ax+by=gcd(a,b)
	 * @returns [a, b]
	 */
	private static gcdEx(x: number, y: number): [number, number] {
		let [a0, a1, b0, b1] = [1, 0, 0, 1];
		while (y > 0) {
			const r = Math.floor(x / y);
			[x, y] = [y, x % y];
			[a0, a1] = [a1, a0 - r * a1];
			[b0, b1] = [b1, b0 - r * b1];
		}
		return [a0, b0];
	}
}
