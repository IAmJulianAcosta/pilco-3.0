import { getProjects } from '$lib/api';

export async function load() {
	const projects = await getProjects();
	return { projects };
}
