<script lang="ts">
	import { getContext } from 'svelte';
	import type { SiteConfig } from '$lib/api';

	const config = getContext<SiteConfig>('siteConfig');
	const year = new Date().getFullYear();
</script>

<footer class="bg-pilco-navy text-white mt-auto">
	<div class="container-site py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<div>
				<p class="text-sm text-gray-300 leading-relaxed">
					Pilco Ltda. - Soluciones de infraestructura con altos estándares de calidad, seguridad y
					sostenibilidad.
				</p>
			</div>

			<div>
				<h4 class="text-sm font-bold uppercase tracking-wider mb-4">Navegación</h4>
				<ul class="space-y-2 text-sm text-gray-300">
					<li><a href="/" class="hover:text-white">Inicio</a></li>
					<li><a href="/acerca-de-pilco" class="hover:text-white">Nosotros</a></li>
					<li><a href="/proyectos" class="hover:text-white">Proyectos</a></li>
				</ul>
			</div>

			<div>
				<h4 class="text-sm font-bold uppercase tracking-wider mb-4">Servicios</h4>
				<ul class="space-y-2 text-sm text-gray-300">
					<li><a href="/soluciones" class="hover:text-white">Pilotajes</a></li>
					<li><a href="/soluciones" class="hover:text-white">Soluciones Marítimas</a></li>
					<li><a href="/soluciones" class="hover:text-white">Soluciones Fluviales</a></li>
					<li><a href="/soluciones" class="hover:text-white">Soluciones Terrestres</a></li>
				</ul>
			</div>

			<div>
				<h4 class="text-sm font-bold uppercase tracking-wider mb-4">Contacto</h4>
				<ul class="space-y-2 text-sm text-gray-300">
					<li><a href="mailto:info@pilco.com.co" class="hover:text-white">info@pilco.com.co</a></li>
					<li><a href="tel:+576023954519" class="hover:text-white">+57 (602) 395 45 19</a></li>
				</ul>
			</div>
		</div>
	</div>

	<div class="bg-white border-t border-gray-200">
		<div
			class="container-site py-2 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-pilco-navy"
		>
			<p>
				&copy; 2010 - {year} Pilco Ltda. &middot; <a href="mailto:info@pilco.com.co" class="hover:text-pilco-blue">info@pilco.com.co</a> &middot; <a href="tel:+576023954519" class="hover:text-pilco-blue">+57 (602) 395 45 19</a>
			</p>
			<a
				href="http://mandarinazul.co"
				target="_blank"
				rel="noopener"
				class="opacity-80 hover:opacity-100"
			>
				<img
					src={config.site_url + '/wp-content/themes/pilco-2.0/images/footer_mandarinazul.png'}
					alt="Desarrollado por Mandarinazul"
					class="w-auto inline-block opacity-80 hover:opacity-100 transition-opacity"
				/>
			</a>
		</div>
	</div>
</footer>
