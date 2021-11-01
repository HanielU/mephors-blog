<script>
	import { db } from "../../firebase.js";
	import { collection, addDoc } from "firebase/firestore";
	import { v4 as uuidv4 } from "uuid";

	let title, content;

	async function publishPost() {
		let postsRef = collection(db, "posts");
		await addDoc(postsRef, {
			title,
			content,
			postID: uuidv4(),
			pos: new Date(),
			postReadBy: [],
		});
	}

	function resizeTextArea() {
		this.style.height = "auto";
		this.style.height = `${this.scrollHeight}px`;
	}
</script>

<form on:submit|preventDefault={publishPost}>
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

<style lang="scss">
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
