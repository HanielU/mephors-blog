<script>
	import { db } from "../firebase.js";
	import {
		doc,
		onSnapshot,
		updateDoc,
		arrayUnion,
		deleteDoc,
	} from "firebase/firestore";
	import { getContext, onDestroy, onMount } from "svelte";
	import { scale, fade } from "svelte/transition";
	import { user, showPost } from "../utils/store";
	import CloseBtn from "./shared/CloseBtn.svelte";

	let postData,
		title = "loading...",
		content = "loading...",
		postID = "",
		actionStatement = "Delete";

	let width, height;

	let postRef = doc(db, "posts", $showPost.postID);
	let unsubscribe = onSnapshot(postRef, (data) => {
		if (data.exists) {
			postData = data.data();
			title = postData.title;
			content = postData.content;
			postID = postData.postID;
		}
	});
	onDestroy(unsubscribe);

	const postRead = getContext("postRead");
	const checkRead = getContext("checkRead");

	onMount(() => {
		new ClipboardJS(".copy");
	});

	$: checkRead(postData);

	const hidePost = () => {
		$showPost = { value: false, calledBy: null, postID: null };
	};

	async function confirmRead(e) {
		$postRead = false;
		let sure = confirm("Are you sure you have read this post?");
		if (sure) {
			await updateDoc(postRef, {
				postReadBy: arrayUnion($user.uid),
			});
			$postRead = true;
		}
		e.target.checked = $postRead; // necessary because checkboxes don't play fair
	}

	async function deletePost() {
		if (confirm("Are you sure you want to delete this post?")) {
			unsubscribe();
			actionStatement = "Deleting...";
			await deleteDoc(postRef);
			actionStatement = "Done!";
			setTimeout(hidePost, 500);
		}
	}
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="bg" transition:fade={{ duration: 300 }}>
	<article class="post" transition:scale>
		<div class="post__header">
			<h1>
				{title}

				{#if $showPost.calledBy === "admin"}
					<span class="copy" data-clipboard-text={postID}> Copy ID </span>
				{/if}
			</h1>

			<CloseBtn on:click={hidePost} />
		</div>

		<p>
			{@html content}
			<!-- height {height}
			width {width} -->
		</p>

		<div class="action-wrapper">
			{#if $showPost.calledBy === "user"}
				{#if !$postRead}
					<label for="checkIfPostRead">
						<input
							type="checkbox"
							checked={$postRead}
							on:click={confirmRead}
							id="checkIfPostRead"
						/>
						I have read this post
					</label>
				{:else}
					<h4>You have read this post</h4>
				{/if}
			{:else if $showPost.calledBy === "admin"}
				<span class="del" on:click|self={deletePost}> {actionStatement} </span>
			{/if}
		</div>
	</article>
</div>

<style lang="scss">
	@import "../styles/PostComponent/post.scss";
	@import "../styles/PostComponent/post_responsive.scss";
</style>
