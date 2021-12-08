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
	import { fly, fade } from "svelte/transition";
	import { getContext, onDestroy } from "svelte";
	import CloseBtn from "../shared/CloseBtn.svelte";

	// Prop declarations
	export let id,
		edit = false;

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

<div class="form-wrapper" transition:fade={{ duration: 300 }}>
	<form
		on:submit|preventDefault={handleSubmit}
		in:fly={{ delay: 200, x: 200, duration: 400 }}
		out:fly={{ x: 200, duration: 500 }}
	>
		<div class="exit">
			<CloseBtn on:click={toggleForm} />
		</div>

		<input type="text" bind:value={title} placeholder="Topic..." />

		<div class="content" contenteditable="true" bind:innerHTML={content} />
		<!-- <textarea
			placeholder="Take a note..."
			name="content"
			rows="8"
			class="modal-content"
			bind:value={content}
			on:input={resizeTextArea}
		/> -->

		<div class="submit">
			<button> {actionStatement} </button>
		</div>
	</form>
</div>

<style lang="scss">
	@import "../../styles/AddOrEditForm/AddOrEditForm.scss";
</style>
