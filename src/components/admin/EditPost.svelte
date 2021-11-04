<script>
	import { db } from "../../firebase.js";
	import { doc, onSnapshot, updateDoc } from "firebase/firestore";
	import { fly } from "svelte/transition";
	import { getContext } from "svelte";

	export let id;
	let title, content, postData;
	const toggleEdit = getContext("toggleEdit");

	let postRef = doc(db, "posts", id);
	onSnapshot(postRef, (data) => {
		postData = data.data();
		title = postData.title;
		content = postData.content;
	});

	async function publishPost() {
		await updateDoc(postRef, {
			title,
			content,
		});
		toggleEdit();
	}

	function resizeTextArea() {
		this.style.height = "auto";
		this.style.height = `${this.scrollHeight}px`;
	}
</script>

<div class="edit-post-form" on:click|self={toggleEdit}>
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
	</form>
</div>

<style lang="scss">
	.edit-post-form {
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
