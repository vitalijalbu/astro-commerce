export function parseImgDimensions(url: string) {
	const m = url.match(/picsum\.photos.*\/(\d+)\/(\d+)$/);
	if (m) return { width: Number(m[1]), height: Number(m[2]) };
}
