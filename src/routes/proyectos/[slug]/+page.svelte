<script lang="ts">
	import { getContext } from 'svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getProjectImage, stripHtml } from '$lib/api';
	import type { SiteConfig, WPProject } from '$lib/api';

	let { data } = $props();

	const config = getContext<SiteConfig>('siteConfig');
	const project = $derived(data.project as WPProject);
	const image = $derived(getProjectImage(project));
	const title = $derived(stripHtml(project.title.rendered));
	const pilcoMeta = $derived(project.pilco_meta);
	const inProgress = $derived(
		!!pilcoMeta?.ejecutandose && pilcoMeta.ejecutandose !== '' && pilcoMeta.ejecutandose !== '0',
	);
	const gallery = $derived((project.pilco_gallery ?? []).filter((p) => p.url !== image));
	const prevSlug = $derived(data.prevSlug as string | null);
	const nextSlug = $derived(data.nextSlug as string | null);

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long' });
	}

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);
	const allPhotos = $derived([
		...(image ? [{ id: 0, url: image, thumb: image, title: title }] : []),
		...gallery,
	]);

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<svelte:head>
	<title>{title} - PILCO</title>
</svelte:head>

<Breadcrumb
	items={[
		{ label: 'Nuestros proyectos', href: '/proyectos' },
		{ label: inProgress ? 'Ejecución' : 'Terminados', href: '/proyectos' },
		{ label: title },
	]}
/>

<!-- HERO -->
<section class="page-hero page-hero--gradient">
	{#if image}
		<img
			src={image}
			alt={title}
			fetchpriority="high"
			class="absolute inset-0 w-full h-full object-cover"
		/>
	{:else}
		<img
			src={config.hero_fallback}
			alt=""
			fetchpriority="high"
			class="absolute inset-0 w-full h-full object-cover"
		/>
	{/if}
	<div class="page-hero-overlay absolute inset-0"></div>
	<div class="relative container-site py-12 md:py-16">
		<div class="md:max-w-[70%]">
			<p
				class="flex items-center gap-2 text-white text-sm font-semibold uppercase tracking-wider mb-4"
			>
				<span class="w-6 h-0.5 bg-white inline-block"></span>
				{inProgress ? 'Proyecto en Ejecución' : 'Proyecto Ejecutado'}
			</p>
			<h1 class="text-2xl md:text-4xl font-bold text-white leading-tight mb-8">
				{@html project.title.rendered}
			</h1>

			{#if pilcoMeta}
				<div class="flex flex-wrap gap-4 md:gap-6">
					<div class="flex items-start gap-3">
						<svg
							class="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/></svg
						>
						<div>
							<p class="text-xs text-gray-400 uppercase font-semibold">Fecha</p>
							<p class="text-white font-bold text-lg">
								{#if inProgress}
									En ejecución
								{:else if pilcoMeta.fecha_inicio && pilcoMeta.fecha_terminacion}
									{formatDate(pilcoMeta.fecha_inicio)} – {formatDate(pilcoMeta.fecha_terminacion)}
								{:else if pilcoMeta.fecha_inicio}
									{formatDate(pilcoMeta.fecha_inicio)}
								{/if}
							</p>
						</div>
					</div>
					{#if pilcoMeta.entidad_contratante}
						<div class="flex items-start gap-3">
							<svg
								class="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0v-2M5 21H3m2 0v-2"
								/></svg
							>
							<div>
								<p class="text-xs text-gray-400 uppercase font-semibold">Entidad</p>
								{#if pilcoMeta.link_entidad}
									<a
										href={pilcoMeta.link_entidad}
										target="_blank"
										rel="noopener"
										class="text-white font-bold hover:text-pilco-blue transition-colors"
										>{pilcoMeta.entidad_contratante}</a
									>
								{:else}
									<p class="text-white font-bold">{pilcoMeta.entidad_contratante}</p>
								{/if}
							</div>
						</div>
					{/if}
					{#if pilcoMeta.valor_contrato}
						<div class="flex items-start gap-3">
							<svg
								class="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
							<div>
								<p class="text-xs text-gray-400 uppercase font-semibold">Valor</p>
								<p class="text-white font-bold">{pilcoMeta.valor_contrato}</p>
							</div>
						</div>
					{/if}
					{#if pilcoMeta.k_contratacion}
						<div class="flex items-start gap-3">
							<svg
								class="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/></svg
							>
							<div>
								<p class="text-xs text-gray-400 uppercase font-semibold">K Contratación</p>
								<p class="text-white font-bold">{pilcoMeta.k_contratacion}</p>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- CONTENT -->
<main class="py-12 bg-white">
	<div class="container-site">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
			<!-- LEFT: content + info table -->
			<div>
				{#if project.content.rendered && project.content.rendered.trim()}
					<section class="mb-10">
						<h2 class="flex items-center gap-3 text-xl font-bold text-pilco-navy mb-5">
							<span class="w-6 h-0.5 bg-pilco-blue inline-block"></span>
							Descripción del proyecto
						</h2>
						<div class="text-gray-600 leading-relaxed prose">
							{@html project.content.rendered}
						</div>
					</section>
				{/if}

				{#if pilcoMeta}
					<section class="mb-10">
						<h2 class="flex items-center gap-3 text-xl font-bold text-pilco-navy mb-5">
							<span class="w-6 h-0.5 bg-pilco-blue inline-block"></span>
							Información general
						</h2>
						<div class="border border-gray-200 rounded-lg divide-y divide-gray-200">
							{#if pilcoMeta.entidad_contratante}
								<div class="flex items-center gap-4 px-4 py-3">
									<span class="text-sm text-gray-500 font-medium w-40 shrink-0"
										>Entidad Contratante:</span
									>
									<span class="text-sm text-pilco-navy font-semibold">
										{#if pilcoMeta.link_entidad}
											<a
												href={pilcoMeta.link_entidad}
												target="_blank"
												rel="noopener"
												class="hover:text-pilco-blue transition-colors"
												>{pilcoMeta.entidad_contratante}</a
											>
										{:else}
											{pilcoMeta.entidad_contratante}
										{/if}
									</span>
								</div>
							{/if}
							{#if pilcoMeta.firma_contratista}
								<div class="flex items-center gap-4 px-4 py-3">
									<span class="text-sm text-gray-500 font-medium w-40 shrink-0"
										>Firma Contratista:</span
									>
									<span class="text-sm text-pilco-navy font-semibold"
										>{pilcoMeta.firma_contratista}</span
									>
								</div>
							{/if}
							{#if pilcoMeta.titulo_largo}
								<div class="flex items-start gap-4 px-4 py-3">
									<span class="text-sm text-gray-500 font-medium w-40 shrink-0"
										>Objeto del Contrato:</span
									>
									<span class="text-sm text-pilco-navy font-semibold">{pilcoMeta.titulo_largo}</span
									>
								</div>
							{/if}
							{#if pilcoMeta.fecha_inicio}
								<div class="flex items-center gap-4 px-4 py-3">
									<span class="text-sm text-gray-500 font-medium w-40 shrink-0"
										>Fecha de Inicio:</span
									>
									<span class="text-sm text-pilco-navy font-semibold"
										>{formatDate(pilcoMeta.fecha_inicio)}</span
									>
								</div>
							{/if}
							{#if pilcoMeta.fecha_terminacion}
								<div class="flex items-center gap-4 px-4 py-3">
									<span class="text-sm text-gray-500 font-medium w-40 shrink-0"
										>Fecha de Terminación:</span
									>
									<span class="text-sm text-pilco-navy font-semibold">
										{#if inProgress}
											En ejecución
										{:else}
											{formatDate(pilcoMeta.fecha_terminacion)}
										{/if}
									</span>
								</div>
							{/if}
							{#if pilcoMeta.valor_contrato}
								<div class="flex items-center gap-4 px-4 py-3">
									<span class="text-sm text-gray-500 font-medium w-40 shrink-0"
										>Valor del Contrato:</span
									>
									<span class="text-sm text-pilco-navy font-semibold"
										>{pilcoMeta.valor_contrato}</span
									>
								</div>
							{/if}
							{#if pilcoMeta.k_contratacion}
								<div class="flex items-center gap-4 px-4 py-3">
									<span class="text-sm text-gray-500 font-medium w-40 shrink-0"
										>K de Contratación:</span
									>
									<span class="text-sm text-pilco-navy font-semibold"
										>{pilcoMeta.k_contratacion}</span
									>
								</div>
							{/if}
						</div>
					</section>
				{/if}

				<!-- CTA -->
				<div class="bg-pilco-gray rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
					<div class="flex items-center gap-3 flex-1">
						<div
							class="w-12 h-12 bg-pilco-navy rounded-lg flex items-center justify-center shrink-0"
						>
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/></svg
							>
						</div>
						<div>
							<p class="font-bold text-pilco-navy text-sm">¿Tienes un proyecto similar?</p>
							<p class="text-xs text-gray-500">
								Hablemos sobre cómo podemos ayudarte a hacerlo realidad.
							</p>
						</div>
					</div>
					<a href="/contactenos" class="btn-primary whitespace-nowrap text-sm">Contáctanos</a>
				</div>
			</div>

			<!-- RIGHT: featured image + gallery -->
			<div>
				{#if image}
					<div
						class="mb-6 rounded-xl overflow-hidden shadow-lg cursor-pointer"
						role="button"
						tabindex="0"
						onclick={() => openLightbox(0)}
						onkeydown={(e) => e.key === 'Enter' && openLightbox(0)}
					>
						<img
							src={image}
							alt={title}
							width="800"
							height="400"
							loading="lazy"
							class="w-full h-auto max-h-[400px] object-cover"
						/>
					</div>
				{/if}

				{#if gallery.length > 0}
					<h3 class="text-lg font-bold text-pilco-navy mb-4">Galería del proyecto</h3>
					<div class="grid grid-cols-2 gap-3">
						{#each gallery as photo, i}
							<div
								class="rounded-lg overflow-hidden shadow cursor-pointer hover:shadow-lg transition-shadow"
								role="button"
								tabindex="0"
								onclick={() => openLightbox(i + (image ? 1 : 0))}
								onkeydown={(e) => e.key === 'Enter' && openLightbox(i + (image ? 1 : 0))}
							>
								<img
									src={photo.thumb}
									alt={photo.title}
									width="400"
									height="160"
									loading="lazy"
									class="w-full h-40 object-cover"
								/>
								{#if photo.title}
									<p class="text-xs text-gray-600 p-2 truncate">{photo.title}</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="border-t border-gray-200 pt-6 mt-10 flex items-center justify-between">
			<a href="/proyectos" class="text-pilco-blue font-semibold hover:underline"
				>&larr; Volver a proyectos</a
			>
			<div class="flex gap-4">
				{#if prevSlug}
					<a href="/proyectos/{prevSlug}" class="text-pilco-blue font-semibold hover:underline"
						>&larr; Anterior</a
					>
				{/if}
				{#if nextSlug}
					<a href="/proyectos/{nextSlug}" class="text-pilco-blue font-semibold hover:underline"
						>Siguiente &rarr;</a
					>
				{/if}
			</div>
		</div>
	</div>
</main>

<!-- LIGHTBOX -->
{#if lightboxOpen && allPhotos.length > 0}
	<div
		class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
		role="dialog"
		onclick={() => (lightboxOpen = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') lightboxOpen = false;
			if (e.key === 'ArrowRight' && lightboxIndex < allPhotos.length - 1) lightboxIndex++;
			if (e.key === 'ArrowLeft' && lightboxIndex > 0) lightboxIndex--;
		}}
		tabindex="-1"
	>
		<button
			class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
			onclick={() => (lightboxOpen = false)}>&times;</button
		>

		{#if lightboxIndex > 0}
			<button
				class="absolute left-4 text-white text-4xl hover:text-gray-300 z-10 top-1/2 -translate-y-1/2"
				onclick={(e) => {
					e.stopPropagation();
					lightboxIndex--;
				}}>&lsaquo;</button
			>
		{/if}

		{#if lightboxIndex < allPhotos.length - 1}
			<button
				class="absolute right-4 text-white text-4xl hover:text-gray-300 z-10 top-1/2 -translate-y-1/2"
				onclick={(e) => {
					e.stopPropagation();
					lightboxIndex++;
				}}>&rsaquo;</button
			>
		{/if}

		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
		<div class="max-w-5xl max-h-[90vh] p-4" onclick={(e) => e.stopPropagation()}>
			<img
				src={allPhotos[lightboxIndex].url}
				alt={allPhotos[lightboxIndex].title}
				class="max-w-full max-h-[80vh] object-contain mx-auto"
			/>
			{#if allPhotos[lightboxIndex].title}
				<p class="text-white text-center mt-3">{allPhotos[lightboxIndex].title}</p>
			{/if}
			<p class="text-gray-400 text-center text-sm mt-1">{lightboxIndex + 1} / {allPhotos.length}</p>
		</div>
	</div>
{/if}
