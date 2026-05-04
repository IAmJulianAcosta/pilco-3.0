<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getFeaturedImage, stripHtml } from '$lib/api';

	let { data } = $props();

	const image = $derived(getFeaturedImage(data.page));
	const title = $derived(stripHtml(data.page.title.rendered));
	const subtitleFull = $derived(
		data.page.excerpt?.rendered ? stripHtml(data.page.excerpt.rendered) : '',
	);
	const subtitle = $derived(
		subtitleFull.length > 300
			? subtitleFull.substring(0, 300).replace(/\s+\S*$/, '') + '…'
			: subtitleFull,
	);
</script>

<svelte:head>
	<title>{title} - PILCO</title>
</svelte:head>

<Breadcrumb items={[{ label: title }]} />

<Hero {title} {subtitle} image={image || undefined} overlay={false} />

<main class="container-site py-12">
	<div class="max-w-4xl">
		<div class="prose prose-lg max-w-none text-gray-700">
			{@html data.page.content.rendered}
		</div>
	</div>
</main>
