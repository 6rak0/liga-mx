export async function load({ fetch }) {
	const matches = await (await fetch('api')).json();
	return { matches };
}
