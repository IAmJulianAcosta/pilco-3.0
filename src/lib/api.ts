const API_BASE = import.meta.env.VITE_WP_API_BASE || 'https://www.pilco.com.co/wp-json/wp/v2';
const WP_BASE = API_BASE.replace('/wp/v2', '');
const CACHE_BUST = String(Date.now());

export interface WPPost {
	id: number;
	slug: string;
	title: { rendered: string };
	content: { rendered: string };
	excerpt: { rendered: string };
	date: string;
	featured_media: number;
	_embedded?: {
		'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
	};
}

export interface WPPage extends WPPost {
	parent: number;
}

export interface ProjectMeta {
	fecha_inicio: string;
	fecha_terminacion: string;
	ejecutandose: string;
	entidad_contratante: string;
	link_entidad: string;
	firma_contratista: string;
	titulo_largo: string;
	valor_contrato: string;
	k_contratacion: string;
}

export interface GalleryPhoto {
	id: number;
	url: string;
	thumb: string;
	title: string;
}

export interface WPProject extends WPPost {
	pilco_meta?: ProjectMeta;
	pilco_image?: string;
	pilco_gallery?: GalleryPhoto[];
}

export interface WPMediaItem {
	id: number;
	source_url: string;
	alt_text: string;
	media_details: {
		sizes: Record<string, { source_url: string; width: number; height: number }>;
	};
}

async function apiFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(`${API_BASE}${endpoint}`);
	url.searchParams.set('_embed', '1');
	url.searchParams.set('_v', CACHE_BUST);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	const res = await window.fetch(url.toString());
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	return res.json();
}

async function apiFetchAll<T>(endpoint: string, params: Record<string, string> = {}): Promise<T[]> {
	const url = new URL(`${API_BASE}${endpoint}`);
	url.searchParams.set('_embed', '1');
	url.searchParams.set('_v', CACHE_BUST);
	url.searchParams.set('per_page', '100');
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	const res = await window.fetch(url.toString());
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
	const first = (await res.json()) as T[];
	if (totalPages <= 1) return first;
	const rest = await Promise.all(
		Array.from({ length: totalPages - 1 }, (_, i) => {
			const pageUrl = new URL(url.toString());
			pageUrl.searchParams.set('page', String(i + 2));
			return window.fetch(pageUrl.toString()).then((r) => r.json() as Promise<T[]>);
		}),
	);
	return first.concat(...rest);
}

export async function getPages(): Promise<WPPage[]> {
	return apiFetch('/pages', { per_page: '100' });
}

export async function getPage(slug: string): Promise<WPPage | null> {
	const pages = await apiFetch<WPPage[]>('/pages', { slug });
	return pages[0] ?? null;
}

export async function getProjects(params: Record<string, string> = {}): Promise<WPProject[]> {
	return apiFetchAll('/proyectos', params);
}

export async function getProject(slug: string): Promise<WPProject | null> {
	const projects = await apiFetch<WPProject[]>('/proyectos', { slug });
	return projects[0] ?? null;
}

export async function getAllProjectSlugs(): Promise<string[]> {
	const projects = await apiFetchAll<{ slug: string }>('/proyectos', { _fields: 'slug' });
	return projects.map((p) => p.slug);
}

export async function getFeaturedProject(): Promise<WPProject | null> {
	const projects = await apiFetch<WPProject[]>('/proyectos', { per_page: '10' });
	const featured = projects.find(
		(p) =>
			p.pilco_meta?.ejecutandose &&
			p.pilco_meta.ejecutandose !== '' &&
			p.pilco_meta.ejecutandose !== '0',
	);
	return featured ?? projects[0] ?? null;
}

export async function getLatestProjects(count = 6): Promise<WPProject[]> {
	return apiFetch('/proyectos', { per_page: String(count) });
}

export async function getPosts(params: Record<string, string> = {}): Promise<WPPost[]> {
	return apiFetch('/posts', { per_page: '10', ...params });
}

export async function getMedia(id: number): Promise<WPMediaItem> {
	return apiFetch(`/media/${id}`);
}

export function getProjectImage(project: WPProject): string {
	if (project.pilco_image) return project.pilco_image;
	return project._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '';
}

export function getFeaturedImage(post: WPPost): string {
	return post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '';
}

export interface SiteConfig {
	site_url: string;
	logo: string;
	logo_full: string;
	favicon: string;
	apple_icon: string;
	hero_images: Record<string, string>;
	hero_fallback: string;
}

let cachedConfig: SiteConfig | null = null;

export async function getSiteConfig(): Promise<SiteConfig> {
	if (cachedConfig) return cachedConfig;
	const res = await window.fetch(`${WP_BASE}/pilco/v1/config?_v=${CACHE_BUST}`);
	if (!res.ok) throw new Error(`Config error: ${res.status}`);
	cachedConfig = await res.json();
	return cachedConfig!;
}

export function stripHtml(html: string): string {
	const txt = html.replace(/<[^>]*>/g, '').trim();
	const el = document.createElement('textarea');
	el.innerHTML = txt;
	return el.value;
}
