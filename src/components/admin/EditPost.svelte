<script>
	import { db } from "../../firebase.js";
	import { doc, onSnapshot, updateDoc } from "firebase/firestore";
	import { fly } from "svelte/transition";
	import { getContext, onDestroy } from "svelte";

	export let id;
	let title,
		content,
		postData,
		publishing = false,
		actionStatement = "Save Edit";
	const toggleEdit = getContext("toggleEdit");

	let postRef = doc(db, "posts", id);
	let unsubscribe = onSnapshot(postRef, (data) => {
		postData = data.data();
		title = postData.title;
		content = postData.content;
	});

	onDestroy(unsubscribe);

	async function publishPost() {
		actionStatement = "Saving Edit...";
		await updateDoc(postRef, {
			title,
			content,
		});
		actionStatement = "Done!";
		setTimeout(toggleEdit, 500);
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
		<button> {actionStatement} </button>

		<span class="close" on:click|self={toggleEdit}> Close </span>
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
