<script>
	import { auth, db } from "../../firebase";
	import { authState } from "rxfire/auth";
	import {
		collection,
		query,
		where,
		getDocs,
		doc,
		updateDoc,
		arrayUnion,
	} from "firebase/firestore";
	import PostPreview from "./PostPreview.svelte";
	import { onMount } from "svelte";

	let postID = "",
		usedPostID = "";

	let user,
		searchedPost,
		searchStarted = false,
		queryNotFound = false,
		postRead = false;

	const unsubscribe = authState(auth).subscribe((usr) => (user = usr));

	$: if (postRead) {
		addUserReadToDB();
	}

	// onMount(searchPosts);

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

		searchedPost.data().postReadBy.forEach((userID) => {
			if (userID == user.uid) {
				postRead = true;
			}
		});

		console.log(searchedPost.data());
	}

	async function addUserReadToDB() {
		let postsRef = doc(db, "posts", searchedPost.id);
		await updateDoc(postsRef, {
			postReadBy: arrayUnion(user.uid),
		});
	}

	function handleDispatch(e) {
		postRead = e.detail;
	}
</script>

<form on:submit|preventDefault={searchPosts}>
	<input type="text" bind:value={postID} />
	<button> Search </button>
</form>

{#if searchStarted}
	<p>loading, please wait</p>
{:else if !searchStarted && searchedPost}
	<PostPreview {searchedPost} {postRead} on:read={handleDispatch} />
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
