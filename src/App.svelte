<script>
	import { auth, db } from "./firebase";
	import { authState } from "rxfire/auth";
	import { getDocs, collection } from "firebase/firestore";
	import { user, showPost } from "./utils/store";
	import { onMount, onDestroy, setContext } from "svelte";
	import { writable } from "svelte/store";
	import SignIn from "./components/SignIn.svelte";
	import Header from "./components/Header.svelte";
	import Post from "./components/Post.svelte";
	import SearchBlog from "./components/user/SearchBlog.svelte";
	import AdminView from "./components/admin/AdminView.svelte";

	// Variable declarations
	let app;
	let unsub = authState(auth).subscribe((usr) => ($user = usr));
	let adminData = [];
	const postRead = writable(false);

	// Reactive
	$: userIsAdmin = $user
		? adminData.some((data) => data.adminID === $user.uid)
		: false;

	// add overflow hidden when post is being shown
	$: if ($showPost.value === true) {
		app.classList.add("freeze");
	} else if ($showPost.value === false) {
		app.classList.remove("freeze");
	}

	// Functions
	function checkRead(data) {
		if (!data) return;
		data.postReadBy.forEach((userID) => {
			if (userID === $user.uid) {
				$postRead = true;
			}
		});
	}

	onMount(() => {
		app = document.querySelector("#app");
		getAdmins();
	});

	const getAdmins = async () => {
		try {
			const admins = await getDocs(collection(db, "admin"));
			adminData = admins.docs.map((doc) => doc.data());
		} catch (error) {
			console.log(error.message);
		}
	};

	onDestroy(() => unsub.unsubscribe());

	setContext("postRead", postRead);
	setContext("checkRead", checkRead);
</script>

{#if $user}
	<Header />

	{#if userIsAdmin}
		<AdminView />
	{:else}
		<SearchBlog />
	{/if}

	{#if $showPost.value === true}
		<Post />
	{/if}
{:else}
	<SignIn />
{/if}
