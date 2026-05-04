<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import type { WPProject } from '$lib/api';

	let { data } = $props();

	const PAGE_SIZE = 12;
	let currentPage = $state(1);

	const enEjecucion = $derived(
		data.projects.filter(
			(p: WPProject) =>
				p.pilco_meta?.ejecutandose &&
				p.pilco_meta.ejecutandose !== '' &&
				p.pilco_meta.ejecutandose !== '0',
		),
	);
	const ejecutados = $derived(
		data.projects.filter(
			(p: WPProject) =>
				!p.pilco_meta?.ejecutandose ||
				p.pilco_meta.ejecutandose === '' ||
				p.pilco_meta.ejecutandose === '0',
		),
	);
	const totalPages = $derived(Math.ceil(ejecutados.length / PAGE_SIZE));
	const paginatedEjecutados = $derived(
		ejecutados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
	);

	function goToPage(page: number) {
		currentPage = page;
		document.getElementById('ejecutados-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head>
	<title>Proyectos - PILCO</title>
</svelte:head>

<Breadcrumb items={[{ label: 'Proyectos' }]} />

<Hero
	title="Nuestros proyectos"
	subtitle="Desarrollamos proyectos de infraestructura con altos estándares de calidad, seguridad y sostenibilidad."
	section="proyectos"
	overlay={false}
/>

{#if enEjecucion.length > 0}
	<section class="py-12 bg-white">
		<div class="container-site">
			<h2 class="section-title mb-8">En Ejecución</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each enEjecucion as project}
					<ProjectCard {project} />
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if ejecutados.length > 0}
	<section id="ejecutados-section" class="py-12 bg-pilco-gray">
		<div class="container-site">
			<h2 class="section-title mb-8">Proyectos Ejecutados</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each paginatedEjecutados as project}
					<ProjectCard {project} />
				{/each}
			</div>

			{#if totalPages > 1}
				<div class="flex items-center justify-center gap-2 mt-10 flex-wrap">
					{#if currentPage > 1}
						<button
							onclick={() => goToPage(currentPage - 1)}
							class="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:border-pilco-blue hover:text-pilco-blue transition-colors bg-white"
						>
							&larr; Anterior
						</button>
					{/if}

					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
						<button
							onclick={() => goToPage(page)}
							class="inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors bg-white"
							style={page === currentPage
								? 'border-color:#1a56db;color:#1a56db;font-weight:700;font-size:1.15em'
								: 'border-color:#d1d5db;color:#374151;font-size:14px'}
						>
							{page}
						</button>
					{/each}

					{#if currentPage < totalPages}
						<button
							onclick={() => goToPage(currentPage + 1)}
							class="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:border-pilco-blue hover:text-pilco-blue transition-colors bg-white"
						>
							Siguiente &rarr;
						</button>
					{/if}
				</div>
				<p class="text-center text-sm text-gray-400 mt-3">Página {currentPage} de {totalPages}</p>
			{/if}
		</div>
	</section>
{/if}
