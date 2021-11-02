<script>
	import { db } from "../../firebase.js";
	import { collection, onSnapshot } from "firebase/firestore";
	import { fly } from "svelte/transition";
	import { setContext } from "svelte";
	import CreatePost from "./CreatePost.svelte";
	import PlusIcon from "../svgs/PlusIcon.svelte";

	let creatingPost = false;
	let transitioning = true; //set to true because on Mount, the "onoutroend" event runs toggleCreate
	let posts = [];
	const toggleCreate = () => (creatingPost = !creatingPost);
	const create = () => (transitioning = true);

	$: gettingPosts = posts.length > 0 ? false : true;
	setContext("toggleCreate", toggleCreate);

	let postsRef = collection(db, "posts");
	onSnapshot(postsRef, (snapShot) => {
		posts = snapShot.docs;
	});
</script>

{#if creatingPost}
	<CreatePost />
{:else}
	<div
		class="posts"
		in:fly={{ delay: 200, x: -200, duration: 500 }}
		out:fly={{ x: -200, duration: 500 }}
		on:introstart={() => (transitioning = true)}
		on:introend={() => (transitioning = false)}
	>
		<h3 class="posts__heading">Posts</h3>

		{#if gettingPosts}
			<p>Loading Please Wait</p>
		{:else}
			<section class="posts__list" in:fly={{ x: -200, duration: 250 }}>
				{#each posts as post (post.id)}
					<article>
						<span class="id">
							ID: {post.data().postID}
						</span>

						<div class="main">
							<h1>{post.data().title}</h1>
						</div>

						<div class="supplementary">
							<span class="edit-post" on:click> Edit </span>
							<span class="view-post" on:click> View </span>
						</div>
					</article>
				{/each}
			</section>
		{/if}

		{#if !transitioning}
			<div
				class="create-post"
				transition:fly={{ x: 200, duration: 200 }}
				on:outroend={toggleCreate}
			>
				<button on:click={create}>
					<PlusIcon width={"12px"} height={"12px"} />
					<span>Create New Post</span>
				</button>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.posts {
		// @include border;
		padding: 20px 20px 90px;

		&__heading {
			font-size: $big;
			margin-bottom: 10px;
			font-weight: $semibold;
		}
	}

	article {
		max-width: 400px;
		background: white;
		@include border($color: $blue);
		border-radius: $basic-radius;
		margin: 0 auto 20px;

		.id {
			font-size: $smallest - 2px;
			color: $light-gray;
			padding: 10px 5px 0px 20px;
			display: block;
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
