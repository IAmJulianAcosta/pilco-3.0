<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { SiteConfig } from '$lib/api';

	let { data, children } = $props();

	setContext<SiteConfig>('siteConfig', data.config);
</script>

<svelte:head>
	<title>PILCO - Creando Progreso en Nuestras Aguas</title>
	<meta
		name="description"
		content="Pilotajes y Construcciones del Pacífico Ltda - Referentes en pilotajes y estabilización de orillas desde 1994"
	/>
	<link rel="icon" href={data.config.favicon} type="image/x-icon" />
	<link rel="apple-touch-icon" sizes="180x180" href={data.config.apple_icon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Header />
	<main class="pt-16 md:pt-20 flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
