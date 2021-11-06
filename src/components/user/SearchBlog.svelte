<script>
	import { db } from "../../firebase";
	import { collection, query, where, getDocs } from "firebase/firestore";
	import { user } from "../../utils/store";
	import PostPreview from "./PostPreview.svelte";
	import { getContext } from "svelte";

	let postID = "",
		usedPostID = "";

	let searchedPost,
		searchStarted = false,
		queryNotFound = false;

	const checkRead = getContext("checkRead");
	const postRead = getContext("postRead");

	$: searchedPost ? checkRead(searchedPost.data()) : ($postRead = false);

	async function searchPosts() {
		if (!postID.trim()) return;
		searchedPost = null; // resets searched Posts
		let postsRef = collection(db, "posts"); // creates posts reference
		let postQuery = query(
			postsRef,
			where("postID", "==", postID.trim().toLowerCase())
		); // queries db for post with postID
		searchStarted = true; // for loading animation?
		let querySnapShot = await getDocs(postQuery);
		searchStarted = false;
		if (querySnapShot.empty) {
			queryNotFound = true;
			usedPostID = postID;
			return;
		}
		querySnapShot.forEach((doc) => (searchedPost = doc));
	}
</script>

<form on:submit|preventDefault={searchPosts}>
	<input type="text" bind:value={postID} />
	<button> Search </button>
</form>

{#if searchStarted}
	<p>loading, please wait</p>
{:else if !searchStarted && searchedPost}
	<PostPreview {searchedPost} />
{:else if !searchStarted && queryNotFound}
	<p class="err">Post with ID: "{usedPostID}" not found</p>
{/if}

<style lang="scss">
	p {
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
	}

	form {
		width: 100%;
		max-width: 400px;
		padding: 20px;
		margin: 0 auto 30px;
		@include border;

		input {
			@include border($color: $light-gray);
			@extend %form-reset;
			border-radius: $little-radius;
			font-size: $small;
			padding: 10px;
			margin-bottom: 10px;
			width: 90%;
		}

		button {
			@extend %form-reset;
			padding: 10px;
			background: $blue;
			border-radius: $little-radius;
			color: white;
			width: 90%;
			font-size: $small;
		}
	}

	.err {
		color: red;
	}
</style>
