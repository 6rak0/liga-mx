<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	export let data;
</script>

{#each data.matches as match}
	<Card.Root class="mx-auto">
		<Card.Header>
			<Card.Title class="mx-auto">{match.date} - {match.hour}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="mx-auto flex justify-evenly">
				<img src={match.local.logo} alt="logo" />
				<div />
				<img src={match.visit.logo} alt="logo" />
			</div>
			<div class="mx-auto flex justify-evenly bold text-2xl">
				<p>{match.local.score || '-'}</p>
				<div />
				<p>{match.visit.score || '-'}</p>
			</div>
		</Card.Content>
		<Card.Footer>
			<p class="mx-auto">{match.broadcast}</p>
		</Card.Footer>
	</Card.Root>
{/each}
