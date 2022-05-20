<script>
	import { db } from "../../firebase.js";
	import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
	import { onDestroy, setContext } from "svelte";
	import PostsList from "./PostsList.svelte";
	import AddOrEdit from "./AddOrEditForm.svelte";

	// Default Initialisations
	let posts,
		id,
		creatingPost = false,
		edit = false;

	// Firestore related
	let postsRef = collection(db, "posts");
	let postsQuery = query(postsRef, orderBy("pos", "desc"));
	let unsubscribe = onSnapshot(
		postsQuery,
		(snapShot) => (posts = snapShot.docs)
	);

	$: props = { id, edit };

	// Functions
	const toggleCreate = () => (creatingPost = !creatingPost);
	const toggleEdit = () => (edit = !edit);

	function handleEdit(e) {
		toggleEdit();
		id = e.detail;
	}

	onDestroy(unsubscribe);

	// Context Setters
	setContext("toggleCreate", toggleCreate);
	setContext("toggleEdit", toggleEdit);
</script>

{#if creatingPost || edit}
	<AddOrEdit {...props} />
{:else}
	<PostsList {posts} on:edit={handleEdit} />
{/if}
