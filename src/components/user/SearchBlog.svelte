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

	let postID = "";

	let user,
		searchedPost,
		searchStarted = false,
		queryNotFound = false,
		postRead = false;

	const unsubscribe = authState(auth).subscribe((usr) => (user = usr));

	$: if (postRead) {
		addUserReadToDB();
	}

	async function searchPosts() {
		if (!postID) return;
		searchedPost = null; // resets searched Posts
		let postsRef = collection(db, "posts"); // creates posts reference
		let postQuery = query(
			postsRef,
			where("postID", "==", postID.toLowerCase())
		); // queries db for post with postID
		searchStarted = true; // for loading animation?
		let querySnapShot = await getDocs(postQuery);
		if (querySnapShot.empty) queryNotFound = true;
		querySnapShot.forEach((doc) => (searchedPost = doc));

		searchedPost.data().postReadBy.forEach((userID) => {
			if (userID == user.uid) {
				postRead = true;
			}
		});
		searchStarted = false;

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
	<p class="err">Nothing Found.</p>
{/if}

<style lang="scss">
	form {
		width: 100%;
		max-width: 400px;
		padding: 20px;
		margin: auto;
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
