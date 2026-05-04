<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { getProjectImage, stripHtml } from '$lib/api';

	let { data } = $props();

	const featuredImage = $derived(data.featured ? getProjectImage(data.featured) : '');
	const featuredMeta = $derived(data.featured?.pilco_meta);

	const services = [
		{
			icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0v-2M5 21H3m2 0v-2m4-16v4m4-4v4',
			title: 'Pilotajes',
			desc: 'Pilotes hincados, pre-excavados y especiales',
		},
		{
			icon: 'M3 15a4 4 0 004 4h10a4 4 0 000-8 5 5 0 00-9.9-1H7a4 4 0 00-4 4zM14 11V3M10 7l4-4 4 4',
			title: 'Marítimas',
			desc: 'Muelles, espolones y obras portuarias',
		},
		{
			icon: 'M3 17h1m15 0h2M5.5 17a2.5 2.5 0 110-5h13a2.5 2.5 0 010 5M3 12h1m15 0h2M5.5 12a2.5 2.5 0 110-5h13a2.5 2.5 0 010 5',
			title: 'Fluviales',
			desc: 'Protección de orillas y dragados',
		},
		{
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-6a1 1 0 011-1h2a1 1 0 011 1v6m-6 0h6',
			title: 'Terrestres',
			desc: 'Construcciones y tablestacados',
		},
	];
</script>

<svelte:head>
	<title>PILCO - Creando Progreso en Nuestras Aguas</title>
</svelte:head>

<!-- HERO -->
<Hero tall section="home">
	{#snippet children()}
		<p class="text-xl md:text-2xl font-light text-white mb-1">Desde</p>
		<p class="text-5xl md:text-7xl font-bold text-white mb-4">1994</p>
		<h1 class="text-xl md:text-3xl text-white leading-tight mb-8 max-w-2xl">
			somos la empresa <strong>referente en pilotajes y estabilización de orillas,</strong> con proyectos
			exitosos que perduran.
		</h1>
		<a href="/acerca-de-pilco" class="btn-primary text-lg">Conozca más</a>
	{/snippet}
</Hero>

<!-- SERVICES -->
<section class="py-16 bg-white">
	<div class="container-site">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
			{#each services as service}
				<div class="text-center p-6">
					<div
						class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-pilco-gray text-pilco-blue"
					>
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d={service.icon}
							/>
						</svg>
					</div>
					<h3 class="font-bold text-pilco-navy mb-1">{service.title}</h3>
					<p class="text-sm text-gray-500">{service.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- FEATURED PROJECT -->
{#if data.featured}
	<section class="bg-pilco-navy text-white py-12">
		<div class="container-site">
			<div class="grid md:grid-cols-2 gap-8 items-center">
				{#if featuredImage}
					<div class="rounded-lg overflow-hidden">
						<img
							src={featuredImage}
							alt={stripHtml(data.featured.title.rendered)}
							class="w-full h-64 md:h-80 object-cover"
						/>
					</div>
				{/if}
				<div>
					<p class="text-pilco-blue text-sm font-semibold uppercase tracking-wider mb-2">
						Proyecto Destacado
					</p>
					<h2 class="text-2xl md:text-3xl font-bold mb-4">{@html data.featured.title.rendered}</h2>
					{#if featuredMeta}
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<div>
								<p class="text-xs text-gray-400 uppercase">Año</p>
								<p class="font-bold text-lg">
									{#if featuredMeta.ejecutandose}
										En ejecución
									{:else if featuredMeta.fecha_inicio}
										{new Date(featuredMeta.fecha_inicio).getFullYear()}
									{/if}
								</p>
							</div>
							<div>
								<p class="text-xs text-gray-400 uppercase">Ubicación</p>
								<p class="font-bold">{featuredMeta.entidad_contratante || 'Colombia'}</p>
							</div>
							{#if featuredMeta.titulo_largo}
								<div>
									<p class="text-xs text-gray-400 uppercase">Alcance</p>
									<p class="font-bold text-sm">
										{featuredMeta.titulo_largo.split(' ').slice(0, 8).join(' ')}
									</p>
								</div>
							{/if}
							{#if featuredMeta.valor_contrato}
								<div>
									<p class="text-xs text-gray-400 uppercase">Contrato</p>
									<p class="font-bold">{featuredMeta.valor_contrato}</p>
								</div>
							{/if}
						</div>
					{/if}
					<a href="/proyectos/{data.featured.slug}" class="btn-outline">Ver proyecto</a>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- LATEST PROJECTS -->
{#if data.latest.length}
	<section class="py-16 bg-pilco-gray">
		<div class="container-site">
			<h2 class="section-title text-center mb-2">Últimos Trabajos Realizados</h2>
			<p class="text-center text-gray-500 mb-10">Conozca nuestros proyectos más recientes</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.latest as project}
					<ProjectCard {project} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- CONTACT CTA -->
<section class="py-16 bg-white">
	<div class="container-site max-w-3xl text-center">
		<h2 class="section-title">¿Tiene un proyecto similar?</h2>
		<p class="text-gray-500 mb-8">
			Contáctenos para discutir cómo podemos ayudarle con su próximo proyecto de infraestructura.
		</p>
		<div class="bg-pilco-navy rounded-xl p-8 text-left">
			<h3 class="text-xl font-bold mb-6 text-white">Contáctenos</h3>
			<form class="space-y-4">
				<div>
					<label for="nombre" class="block text-sm font-bold text-white mb-1">Nombre</label>
					<input
						type="text"
						id="nombre"
						class="w-full px-4 py-2 rounded-lg bg-white text-pilco-navy"
					/>
				</div>
				<div>
					<label for="empresa" class="block text-sm font-bold text-white mb-1">Empresa</label>
					<input
						type="text"
						id="empresa"
						class="w-full px-4 py-2 rounded-lg bg-white text-pilco-navy"
					/>
				</div>
				<div>
					<label for="ubicacion" class="block text-sm font-bold text-white mb-1">Ubicación</label>
					<input
						type="text"
						id="ubicacion"
						class="w-full px-4 py-2 rounded-lg bg-white text-pilco-navy"
					/>
				</div>
				<div>
					<label for="email" class="block text-sm font-bold text-white mb-1">e mail</label>
					<input
						type="email"
						id="email"
						class="w-full px-4 py-2 rounded-lg bg-white text-pilco-navy"
					/>
				</div>
				<div>
					<label for="telefono" class="block text-sm font-bold text-white mb-1">Teléfono</label>
					<input
						type="tel"
						id="telefono"
						class="w-full px-4 py-2 rounded-lg bg-white text-pilco-navy"
					/>
				</div>
				<div>
					<label for="comentario" class="block text-sm font-bold text-white mb-1">Comentario</label>
					<textarea
						id="comentario"
						rows="4"
						class="w-full px-4 py-2 rounded-lg bg-white text-pilco-navy"
					></textarea>
				</div>
				<button
					type="submit"
					class="bg-white text-pilco-navy px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
					>Enviar</button
				>
			</form>
		</div>
	</div>
</section>
