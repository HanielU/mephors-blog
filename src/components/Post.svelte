<script>
	import { getContext, createEventDispatcher } from "svelte";
	import { slide, fade } from "svelte/transition";

	export let searchedPost, postRead;
	const dispatch = createEventDispatcher();
	$: if (postRead) {
		dispatch("read", postRead);
	}
	let { title, content } = searchedPost.data();
	const openPost = getContext("openPost");
</script>

<div class="bg" transition:fade={{ duration: 300 }}>
	<article class="post" transition:slide>
		<span class="close" title="close" on:click={() => openPost(false)}>
			x
		</span>
		<h1>
			{title}
		</h1>
		<p>
			{content}
		</p>

		{#if !postRead}
			<label for="checkIfPostRead">
				<input type="checkbox" bind:checked={postRead} name="checkIfPostRead" />
				I have read this post
			</label>
		{:else}
			<h4>You have read this post</h4>
		{/if}
	</article>
</div>

<style lang="scss">
	.bg {
		position: absolute;
		height: 100vh;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 2;
		background: #eee;
		@include flex;
	}

	.post {
		@include border;
		@include flex($justify: flex-start, $align: flex-start);
		flex-direction: column;
		border-radius: $little-radius;
		position: relative;
		height: 500px;
		width: 500px;
		padding: 20px;
		background: #fff;
		p {
			overflow-y: auto;
			max-height: 100%;
			margin: 20px 0;
		}
	}

	.close {
		position: absolute;
		right: 0;
		top: 0;
		background: rgb(195, 53, 53);
		padding: 3px 10px;
		border-top-right-radius: $little-radius - 3px;
		cursor: pointer;
	}

	label,
	h4 {
		margin-top: auto;
	}
</style>
