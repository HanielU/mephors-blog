<script>
	import { db } from "../../firebase.js";
	import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
	import { onDestroy, setContext } from "svelte";
	import CreatePost from "./CreatePost.svelte";
	import EditPost from "./EditPost.svelte";
	import PostsList from "./PostsList.svelte";

	// Default Initialisations
	let creatingPost = false;
	let posts, id;
	let edit = false;

	// Firestore related
	let postsRef = collection(db, "posts");
	let postsQuery = query(postsRef, orderBy("pos", "desc"));
	let unsubscribe = onSnapshot(
		postsQuery,
		(snapShot) => (posts = snapShot.docs)
	);
	onDestroy(unsubscribe);

	// Functions
	const toggleCreate = () => (creatingPost = !creatingPost);
	const toggleEdit = () => (edit = !edit);

	function handleEdit(e) {
		toggleEdit();
		id = e.detail;
	}

	// Context Setters
	setContext("toggleCreate", toggleCreate);
	setContext("toggleEdit", toggleEdit);
</script>

{#if creatingPost}
	<CreatePost />
{:else if edit}
	<EditPost {id} />
{:else}
	<PostsList {posts} on:edit={handleEdit} />
{/if}
