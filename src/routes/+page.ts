import { getLatestProjects, getFeaturedProject } from '$lib/api';

export async function load() {
	const [featured, latest] = await Promise.all([getFeaturedProject(), getLatestProjects(6)]);
	return { featured, latest };
}
