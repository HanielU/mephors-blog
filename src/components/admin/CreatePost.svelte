<script>
	import { db } from "../../firebase.js";
	import { collection, addDoc } from "firebase/firestore";
	import { v4 as uuidv4 } from "uuid";
	import { fly } from "svelte/transition";
	import { getContext } from "svelte";

	let title, content;
	const toggleCreate = getContext("toggleCreate");

	async function publishPost() {
		let postsRef = collection(db, "posts");
		await addDoc(postsRef, {
			title,
			content,
			postID: uuidv4(),
			pos: new Date(),
			postReadBy: [],
		});

		toggleCreate();
	}

	function resizeTextArea() {
		this.style.height = "auto";
		this.style.height = `${this.scrollHeight}px`;
	}
</script>

<div class="create-post-form" on:click|self={toggleCreate}>
	<form
		on:submit|preventDefault={publishPost}
		in:fly={{ delay: 200, x: 200, duration: 500 }}
		out:fly={{ x: 200, duration: 500 }}
	>
		<input type="text" bind:value={title} />
		<textarea
			placeholder="Take a note..."
			name="content"
			rows="8"
			class="modal-content"
			bind:value={content}
			on:input={resizeTextArea}
		/>
		<button> Publish Post </button>

		<span class="close" on:click|self={toggleCreate}> Close </span>
	</form>
</div>

<style lang="scss">
	.close {
		width: 90%;
		margin: 10px auto;
		padding: 15px;
		background: red;
		color: white;
		font-weight: $semibold;
		border-radius: $little-radius;
		cursor: pointer;
		text-align: center;
	}

	.create-post-form {
		position: fixed;
		top: 90px;
		left: 0;
		height: calc(100vh - 90px);
		width: 100%;
	}

	form {
		width: 100%;
		max-width: 400px;
		padding: 20px;
		margin: auto;
		@include border;

		input,
		textarea {
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

		textarea {
			font-family: $main-font;
		}
	}
</style>
