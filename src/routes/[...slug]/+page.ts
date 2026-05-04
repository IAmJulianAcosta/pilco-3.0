import { getPage } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const fullSlug = params.slug || 'acerca-de-pilco';
	const slug = fullSlug.includes('/') ? fullSlug.split('/').pop()! : fullSlug;
	const page = await getPage(slug);
	if (!page) throw error(404, 'Página no encontrada');
	return { page };
}
