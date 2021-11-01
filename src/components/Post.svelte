<script>
	import { getContext } from "svelte";
	import { slide, fade } from "svelte/transition";

	export let searchedPost, postRead;
	let { title, content } = searchedPost.data();
	const openPost = getContext("openPost");
</script>

<div class="bg" transition:fade={{ duration: 300 }}>
	<article class="post" transition:slide>
		<span class="close" title="close" on:click={() => openPost(false)}>
			x
		</span>
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
		border-radius: $little-radius;
		position: relative;
		height: 500px;
		width: 500px;
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
