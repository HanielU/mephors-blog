<script>
	import { auth } from "./firebase";
	import { authState } from "rxfire/auth";
	import SignIn from "./components/SignIn.svelte";
	import Header from "./components/Header.svelte";
	import SearchBlog from "./components/user/SearchBlog.svelte";
	import AdminView from "./components/admin/AdminView.svelte";

	let user;
	let adminId = "bFkZyf72TuSoZe60AZxOtUDMyyY2";

	const unsubscribe = authState(auth).subscribe((usr) => (user = usr));
	$: console.log({ user, unsubscribe });
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
	/>
</svelte:head>

{#if user}
	<Header {user} />

	{#if user.uid === adminId}
		<AdminView />
	{:else}
		<SearchBlog />
	{/if}
{:else}
	<SignIn />
{/if}
