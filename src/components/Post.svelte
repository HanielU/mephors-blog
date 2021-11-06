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
	import { slide, fade } from "svelte/transition";
	import { user, showPost } from "../utils/store";

	onMount(() => {
		new ClipboardJS(".copy");
	});

	let postData,
		title = "loading...",
		content = "loading...",
		postID = "",
		actionStatement = "Delete";

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

<div class="bg" transition:fade={{ duration: 300 }}>
	<article class="post" transition:slide>
		<span class="close" title="close" on:click={hidePost}> x </span>
		<h1>
			{title}

			{#if $showPost.calledBy === "admin"}
				<span class="copy" data-clipboard-text={postID}> Copy ID </span>
			{/if}
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
		{:else if $showPost.calledBy === "admin"}
			<span class="del" on:click|self={deletePost}> {actionStatement} </span>
		{/if}
	</article>
</div>

<style lang="scss">
	.del {
		width: 90%;
		margin: 10px auto;
		padding: 15px;
		background: #e52929;
		color: white;
		font-weight: $semibold;
		border-radius: $little-radius;
		cursor: pointer;
		text-align: center;
	}

	.bg {
		position: fixed;
		height: 100vh;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 2;
		padding: 0 14px;
		background: #eee;
		@include flex;
	}

	.post {
		@include border;
		@include flex($justify: flex-start, $align: flex-start);
		flex-direction: column;
		border-radius: $little-radius;
		position: relative;
		height: 80vh;
		width: 500px;
		padding: 20px;
		background: #fff;

		h1 {
			max-width: 30ch;
			@include flex($justify: space-between, $align: flex-start);
			flex-direction: column;

			.copy {
				display: block;
				font-size: $smallest;
				padding: 6px 12px;
				margin-top: 10px;
				color: #333;
				cursor: pointer;
				background-color: #eee;
				background-image: linear-gradient(#fcfcfc, #eee);
				border: 1px solid #d5d5d5;
				border-radius: 3px;
				user-select: none;
				-webkit-appearance: none;
			}
		}

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
		background: #df5555;
		color: #333;
		font-weight: $semibold;
		padding: 8px 15px;
		border-top-right-radius: $little-radius - 3px;
		cursor: pointer;
	}

	label,
	h4,
	.del {
		margin-top: auto;
	}
</style>
