<script>
	import { createEventDispatcher, setContext } from "svelte";
	import { showPost } from "../../utils/store";
	import Post from "../Post.svelte";

	export let searchedPost, postRead;
	const dispatch = createEventDispatcher();
	const openPost = (bool) => ($showPost = bool);

	setContext("openPost", openPost);

	/* $: if (postRead) {
		dispatch("read", postRead);
	} */
</script>

{#if searchedPost && !$showPost}
	<article>
		<div class="main">
			<h1>{searchedPost.data().title}</h1>
		</div>

		<div class="supplementary">
			<span class:postRead>
				{!postRead ? "Not read" : "Read"}
			</span>

			<span class="view-post" on:click={() => openPost(true)}> View </span>
		</div>
	</article>
{:else}
	<Post {searchedPost} {postRead} />
{/if}

<style lang="scss">
	article {
		max-width: 400px;
		background: white;
		@include border($color: $blue);
		border-radius: $basic-radius;
		margin: auto;

		.main {
			width: 100%;
			padding: 20px;
			border-bottom: 1px solid $light-gray;

			h1 {
				font-weight: $semibold;
				color: $dark;
			}
		}

		.supplementary {
			padding: 20px;
			@include flex($justify: space-between);
		}
	}

	span.postRead {
		color: $light-gray;
	}

	.view-post {
		cursor: pointer;
	}
</style>
