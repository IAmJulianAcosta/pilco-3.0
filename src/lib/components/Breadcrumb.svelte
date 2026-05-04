<script lang="ts">
	interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		items: Crumb[];
	}

	let { items }: Props = $props();
</script>

<div class="bg-pilco-gray border-b border-gray-200 relative z-10">
	<div class="container-site py-3">
		<nav class="text-sm text-gray-500 flex flex-wrap items-center gap-1">
			<a href="/" class="hover:text-pilco-blue">Inicio</a>
			{#each items as item}
				<span class="mx-1">&gt;</span>
				{#if item.href}
					<a href={item.href} class="hover:text-pilco-blue">{item.label}</a>
				{:else}
					<span class="text-gray-700 font-medium">{item.label}</span>
				{/if}
			{/each}
		</nav>
	</div>
</div>
