export const powmod = (n: number, x: number, mod: number = Infinity): number => {
	const rem = (a: number, b: number) => a === Infinity ? Infinity : a % b;
	if (x <= 0) return 1;
	if (x % 2 === 0) return powmod(rem(n * n, mod), x / 2, mod);
	else return rem(n * powmod(n, x - 1, mod), mod);
};
