<script>
	import { createEventDispatcher } from "svelte";

	export let searchedPost, postRead;
	const dispatch = createEventDispatcher();

	$: if (postRead) {
		dispatch("read", postRead);
	}
</script>

{#if searchedPost}
	<article>
		<h1>{searchedPost.data().title}</h1>
		<p>
			{searchedPost.data().content}
		</p>
		<div class="err">
			{searchedPost.id}
		</div>

		{#if !postRead}
			<label for="checkIfPostRead">
				<input type="checkbox" bind:checked={postRead} name="checkIfPostRead" />
				I have read this post
			</label>
		{:else}
			<h4>You have read this post</h4>
		{/if}
	</article>
{/if}

<style lang="scss">
	article {
		width: 400px;
		height: 300px;
		@include border;
		margin: auto;
	}
</style>
