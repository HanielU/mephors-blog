<script>
	import { db } from "../../firebase.js";
	import { doc, onSnapshot, updateDoc } from "firebase/firestore";
	import { fly } from "svelte/transition";
	import { getContext } from "svelte";

	export let id;
	let title, content, postData;
	const toggleView = getContext("toggleView");

	let postRef = doc(db, "posts", id);
	onSnapshot(postRef, (data) => {
		postData = data.data();
		title = postData.title;
		content = postData.content;
	});
</script>

<div
	class="bg"
	in:fly={{ delay: 200, x: 200, duration: 500 }}
	out:fly={{ x: 200, duration: 200 }}
>
	<article class="post">
		<span class="close" title="close" on:click={toggleView}> x </span>
		<h1>
			{title}
		</h1>
		<p>
			{content}
		</p>
	</article>
</div>

<style lang="scss">
	.bg {
		position: absolute;
		height: calc(100vh - 80px);
		width: 100%;
		top: 80px;
		left: 0;
		z-index: 2;
		background: #eee;
		@include flex;
	}

	.post {
		@include border;
		border-radius: $little-radius;
		position: relative;
		height: 80%;
		width: 100%;
		max-width: 600px;
		padding: 20px;
		background: #fff;
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
</style>
