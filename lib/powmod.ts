export const powmod = (n: number, x: number, mod: number = Infinity): number => {
	if (x <= 0) return 1;
	if (x % 2 == 0) return powmod(n * n % mod, x / 2, mod);
	else return n * powmod(n, x - 1, mod) % mod;
};
