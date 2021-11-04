<script>
	import { db } from "../../firebase.js";
	import { collection, onSnapshot } from "firebase/firestore";
	import { setContext } from "svelte";
	import CreatePost from "./CreatePost.svelte";
	import EditPost from "./EditPost.svelte";
	import ViewPost from "./ViewPost.svelte";
	import PostsList from "./PostsList.svelte";

	let creatingPost = false;
	let posts, id;
	let edit = false;
	let view = false;

	const toggleCreate = () => (creatingPost = !creatingPost);
	const toggleEdit = () => (edit = !edit);
	const toggleView = () => (view = !view);

	setContext("toggleCreate", toggleCreate);
	setContext("toggleEdit", toggleEdit);
	setContext("toggleView", toggleView);

	let postsRef = collection(db, "posts");
	onSnapshot(postsRef, (snapShot) => {
		posts = snapShot.docs;
	});

	function handleEdit(e) {
		toggleEdit();
		id = e.detail;
		console.log({ id });
	}

	function handleView(e) {
		toggleView();
		id = e.detail;
		console.log({ id });
	}

	$: console.log({ edit, view, creatingPost });
</script>

{#if creatingPost}
	<CreatePost />
{:else if edit}
	<EditPost {id} />
{:else if view}
	<ViewPost {id} />
{:else}
	<PostsList {posts} on:edit={handleEdit} on:view={handleView} />
{/if}
