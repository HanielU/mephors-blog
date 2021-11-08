<script>
	import { db } from "../../firebase.js";
	import {
		onSnapshot,
		collection,
		doc,
		addDoc,
		updateDoc,
	} from "firebase/firestore";
	import ShortUniqueId from "short-unique-id";
	import { fly } from "svelte/transition";
	import { getContext, onDestroy } from "svelte";

	// Prop declarations
	export let id,
		edit = false,
		creatingPost = false;

	// Variable declarations
	let title,
		content,
		postData,
		actionStatement = edit ? "Save Edit" : "Publish";

	const toggleCreate = getContext("toggleCreate");
	const toggleEdit = getContext("toggleEdit");

	let postRef;

	if (edit) {
		postRef = doc(db, "posts", id);
		let unsubscribe = onSnapshot(postRef, (data) => {
			postData = data.data();
			title = postData.title;
			content = postData.content;
		});
		onDestroy(unsubscribe);
	}

	// Functions
	async function publishPost() {
		let postsRef = collection(db, "posts");
		actionStatement = "Publishing...";
		await addDoc(postsRef, {
			title,
			content,
			postID: new ShortUniqueId({ length: 8 })(),
			pos: new Date(),
			postReadBy: [],
		});
		actionStatement = "Done!";
		setTimeout(toggleCreate, 500);
	}

	async function publishEdit() {
		actionStatement = "Saving Edit...";
		await updateDoc(postRef, {
			title,
			content,
		});
		actionStatement = "Done!";
		setTimeout(toggleEdit, 500);
	}

	const handleSubmit = () => (edit ? publishEdit() : publishPost());

	const toggleForm = () => (edit ? toggleEdit() : toggleCreate());

	function resizeTextArea() {
		this.style.height = "auto";
		this.style.height = `${this.scrollHeight}px`;
	}
</script>

<div class="form-wrapper">
	<form
		on:submit|preventDefault={handleSubmit}
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

		<span class="close" on:click|self={toggleForm}> Close </span>
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

	.form-wrapper {
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
