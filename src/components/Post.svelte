<script>
	import { db } from "../firebase.js";
	import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
	import { getContext, onDestroy } from "svelte";
	import { slide, fade } from "svelte/transition";
	import { user, showPost } from "../utils/store";

	let postData,
		title = "loading...",
		content = "loading...";

	let postRef = doc(db, "posts", $showPost.postID);
	let unsubscribe = onSnapshot(postRef, (data) => {
		postData = data.data();
		title = postData.title;
		content = postData.content;
	});
	onDestroy(unsubscribe);

	const postRead = getContext("postRead");
	const checkRead = getContext("checkRead");

	$: checkRead(postData);

	async function confirmRead(e) {
		$postRead = false;
		let sure = confirm("Are you sure you have read this post?");
		if (sure) {
			await updateDoc(postRef, {
				postReadBy: arrayUnion($user.uid),
			});
			$postRead = true;
		}
		e.target.checked = $postRead;
	}
</script>

<div class="bg" transition:fade={{ duration: 300 }}>
	<article class="post" transition:slide>
		<span
			class="close"
			title="close"
			on:click={() =>
				($showPost = { value: false, calledBy: null, postID: null })}
		>
			x
		</span>
		<h1>
			{title}
		</h1>
		<p>
			{content}
		</p>

		{#if $showPost.calledBy === "user"}
			{#if !$postRead}
				<label for="checkIfPostRead">
					<input
						type="checkbox"
						checked={$postRead}
						on:click={confirmRead}
						name="checkIfPostRead"
					/>
					I have read this post
				</label>
			{:else}
				<h4>You have read this post</h4>
			{/if}
		{/if}
	</article>
</div>

<style lang="scss">
	.bg {
		position: fixed;
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
		padding: 8px 15px;
		border-top-right-radius: $little-radius - 3px;
		cursor: pointer;
	}

	label,
	h4 {
		margin-top: auto;
	}
</style>
