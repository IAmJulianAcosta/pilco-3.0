import { getProject, getAllProjectSlugs } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const [project, allSlugs] = await Promise.all([
		getProject(params.slug),
		getAllProjectSlugs(),
	]);
	if (!project) throw error(404, 'Proyecto no encontrado');

	const idx = allSlugs.indexOf(params.slug);
	const prevSlug = idx < allSlugs.length - 1 ? allSlugs[idx + 1] : null;
	const nextSlug = idx > 0 ? allSlugs[idx - 1] : null;

	return { project, prevSlug, nextSlug };
}
