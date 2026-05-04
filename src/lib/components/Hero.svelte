<script lang="ts">
	import { getContext } from 'svelte';
	import type { SiteConfig } from '$lib/api';

	interface Props {
		title?: string;
		subtitle?: string;
		image?: string;
		section?: string;
		tall?: boolean;
		overlay?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		subtitle,
		image,
		section = 'default',
		tall = false,
		overlay = true,
		children,
	}: Props = $props();

	const config = getContext<SiteConfig>('siteConfig');

	const heroImage = $derived(image || config.hero_images?.[section] || config.hero_fallback);
</script>

<section
	class="page-hero {overlay ? '-mt-16 md:-mt-20' : ''} {tall
		? 'min-h-[70vh] flex items-center'
		: ''}"
>
	<img
		src={heroImage}
		alt=""
		fetchpriority="high"
		class="absolute inset-0 w-full h-full object-cover"
	/>
	<div class="page-hero-overlay absolute inset-0"></div>
	<div class="relative container-site {tall ? 'py-24 md:py-32' : 'py-8 md:py-16'} text-white">
		<div class="md:max-w-[70%]">
			{#if children}
				{@render children()}
			{:else}
				{#if title}
					<h1 class="text-3xl md:text-4xl font-bold">{title}</h1>
				{/if}
				{#if subtitle}
					<p class="text-gray-300 mt-2 max-w-2xl">{subtitle}</p>
				{/if}
			{/if}
		</div>
	</div>
</section>
