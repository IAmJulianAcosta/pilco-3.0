<script lang="ts">
	import { getProjectImage, stripHtml } from '$lib/api';
	import type { WPProject } from '$lib/api';

	interface Props {
		project: WPProject;
	}

	let { project }: Props = $props();

	const image = $derived(getProjectImage(project));
	const client = $derived(project.pilco_meta?.entidad_contratante || '');
</script>

<a href="/proyectos/{project.slug}" class="card group block">
	<div class="relative h-48 overflow-hidden" style="background-color:#003399">
		{#if image}
			<img
				src={image}
				alt={stripHtml(project.title.rendered)}
				width="400"
				height="300"
				loading="lazy"
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
			/>
		{:else}
			<div class="absolute inset-0 flex items-center justify-center">
				<img
					src="/images/logo-header.png"
					alt="PILCO"
					class="w-32 brightness-0 invert opacity-70"
				/>
			</div>
		{/if}
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
		<div class="absolute bottom-0 left-0 right-0 p-4">
			<h3 class="text-white font-bold text-sm leading-tight">
				{@html project.title.rendered}
			</h3>
		</div>
	</div>
	<div class="p-4">
		{#if client}
			<p class="text-xs text-gray-500">{client}</p>
		{/if}
		<span class="text-pilco-blue text-sm font-semibold mt-1 inline-block group-hover:underline"
			>Ver proyecto &rarr;</span
		>
	</div>
</a>
