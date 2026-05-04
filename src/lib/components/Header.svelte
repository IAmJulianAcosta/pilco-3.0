<script lang="ts">
	import { getContext } from 'svelte';
	import type { SiteConfig } from '$lib/api';

	const config = getContext<SiteConfig>('siteConfig');

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const navItems = [
		{ label: 'Acerca de Pilco', href: '/acerca-de-pilco' },
		{ label: 'Recursos', href: '/recursos' },
		{ label: 'Soluciones', href: '/soluciones' },
		{ label: 'Proyectos', href: '/proyectos' },
		{ label: 'Contactenos', href: '/contactenos' },
	];

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 10);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
		? 'bg-white shadow-md'
		: 'bg-white/90 backdrop-blur-sm'}"
>
	<div class="container-site flex items-center justify-between h-16 md:h-20">
		<a href="/" class="flex items-center h-full py-2 shrink-0">
			<img
				src={config.logo}
				alt="PILCO - Creando Progreso en Nuestras Aguas"
				class="h-full w-auto max-h-12 md:max-h-14"
			/>
		</a>

		<nav class="hidden md:flex items-center gap-6">
			{#each navItems as item}
				<a
					href={item.href}
					class="text-sm font-medium text-pilco-navy hover:text-pilco-blue transition-colors"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<button
			class="md:hidden p-2 text-pilco-navy"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Toggle menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{#if mobileOpen}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				{/if}
			</svg>
		</button>
	</div>

	{#if mobileOpen}
		<nav class="md:hidden bg-white border-t shadow-lg">
			{#each navItems as item}
				<a
					href={item.href}
					class="block px-6 py-3 text-pilco-navy hover:bg-pilco-gray transition-colors"
					onclick={() => (mobileOpen = false)}
				>
					{item.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>
