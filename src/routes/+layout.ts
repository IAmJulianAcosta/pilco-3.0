import { getSiteConfig } from '$lib/api';

export const ssr = false;
export const prerender = false;

export async function load() {
	const config = await getSiteConfig();
	return { config };
}
