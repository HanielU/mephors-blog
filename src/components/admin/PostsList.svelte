<script>
	import { createEventDispatcher, getContext } from "svelte";
	import { fly, fade } from "svelte/transition";
	import PlusIcon from "../svgs/PlusIcon.svelte";

	export let posts = [];
	const dispatch = createEventDispatcher();
	let transitioning = true; //set to true because on Mount, the "onoutroend" event runs toggleCreate

	let action = "",
		actionId = "",
		runDelayedEV;

	const toggleCreate = getContext("toggleCreate");

	$: gettingPosts = posts.length > 0 ? false : true;
	$: if (action === "create") {
		runDelayedEV = toggleCreate;
	} else {
		runDelayedEV = dispatch(action, actionId);
	}

	const setAction = (act, id) => {
		transitioning = true;
		action = act;
		if (id) {
			actionId = id;
		}
	};

	$: console.log({ transitioning });
</script>

<div
	class="posts"
	in:fly={{ delay: 200, x: -200, duration: 500 }}
	out:fly|local={{ x: -200, duration: 500 }}
	on:introstart={() => (transitioning = true)}
	on:introend={() => (transitioning = false)}
>
	<h3 class="posts__heading">Posts</h3>

	{#if gettingPosts}
		<p>Loading Please Wait</p>
	{:else}
		<section class="posts__list" in:fade={{ duration: 500 }}>
			{#each posts as post (post.id)}
				<article>
					<span class="id">
						ID: {post.data().postID}
					</span>

					<span class="views">
						Views: {post.data().postReadBy.length}
					</span>

					<div class="main">
						<h1>{post.data().title}</h1>
					</div>

					<div class="supplementary">
						<span class="edit-post" on:click={() => setAction("edit", post.id)}>
							Edit
						</span>
						<span class="view-post" on:click={() => setAction("view", post.id)}>
							View
						</span>
					</div>
				</article>
			{/each}
		</section>
	{/if}

	{#if !transitioning}
		<div
			class="create-post"
			transition:fly={{ x: 200, duration: 200 }}
			on:outroend={runDelayedEV}
		>
			<button on:click={() => setAction("create")}>
				<PlusIcon width={"12px"} height={"12px"} />
				<span>Create New Post</span>
			</button>
		</div>
	{/if}
</div>

<style lang="scss">
	%width-settings {
		max-width: 400px;
		margin: 0 auto;
	}

	.posts {
		// @include border;
		padding: 20px 20px 90px;

		&__heading {
			font-size: $big;
			margin-bottom: 10px;
			font-weight: $semibold;
			@extend %width-settings;
		}
		&__list {
			@extend %width-settings;
		}
	}

	article {
		width: 100%;
		background: white;
		@include border($color: $blue);
		border-radius: $basic-radius;
		margin-bottom: 20px;

		%span-settings {
			font-size: $smallest - 2px;
			color: $light-gray;
			display: block;
		}

		.id {
			@extend %span-settings;
			padding: 10px 5px 0px 20px;
		}
		.views {
			@extend %span-settings;
			padding: 0 20px;
		}

		.main {
			width: 100%;
			padding: 5px 20px 20px;
			border-bottom: 1px solid $light-gray;

			h1 {
				font-weight: $semibold;
				color: $dark;
			}
		}

		.supplementary {
			padding: 10px 20px 20px;
			@include flex($justify: space-between);

			span {
				cursor: pointer;
			}
		}
	}

	.create-post {
		position: fixed;
		bottom: 0;
		left: 0;

		height: 80px;
		width: 100%;
		@include flex($justify: flex-end);
		// @include border;

		button {
			padding: 15px 30px 15px 15px;
			background: $blue;
			border-top-left-radius: $basic-radius;
			border-bottom-left-radius: $basic-radius;
			@include flex;

			span {
				display: block;
				margin-left: 5px;
				color: white;
				font-size: $small;
				font-family: $main-font;
			}
		}
	}
</style>
