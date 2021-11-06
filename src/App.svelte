<script>
	import { auth } from "./firebase";
	import { authState } from "rxfire/auth";
	import { user, showPost } from "./utils/store";
	import SignIn from "./components/SignIn.svelte";
	import Header from "./components/Header.svelte";
	import Post from "./components/Post.svelte";
	import SearchBlog from "./components/user/SearchBlog.svelte";
	import AdminView from "./components/admin/AdminView.svelte";
	import { onDestroy, setContext } from "svelte";
	import { writable } from "svelte/store";

	let adminId = "bFkZyf72TuSoZe60AZxOtUDMyyY2";
	$: userIsAdmin = $user ? $user.uid === adminId : false;

	const postRead = writable(false);

	function checkRead(data) {
		if (!data) return;
		data.postReadBy.forEach((userID) => {
			if (userID === $user.uid) {
				$postRead = true;
			}
		});
	}

	setContext("postRead", postRead);
	setContext("checkRead", checkRead);

	let unsub = authState(auth).subscribe((usr) => ($user = usr));
	onDestroy(() => unsub.unsubscribe());
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
	/>
</svelte:head>

{#if $user}
	<Header />

	{#if userIsAdmin}
		<AdminView />
	{:else}
		<SearchBlog />
	{/if}

	{#if $showPost.value}
		<Post />
	{/if}
{:else}
	<SignIn />
{/if}
