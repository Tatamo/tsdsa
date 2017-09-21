type MatrixGraph = Array<Array<number>>;

export function warshallFloyd(graph: MatrixGraph, n: number = -1): MatrixGraph {
	if (n < 0) n = graph.length;
	// initialize
	let result: MatrixGraph = Array<Array<number>>(n);
	for (let i = 0; i < n; i++) {
		result[i] = new Array<number>(n);
	}

	// wf
	for (let i = 0; i < n; i++) {
		for (let ii = 0; ii < n; ii++) {
			for (let iii = 0; iii < n; iii++) {
				result[ii][iii] = Math.min(result[ii][iii], result[ii][i] + result[i][iii]);
			}
		}
	}
	return result;
}