import { writable } from "svelte/store";

export const user = writable(null);

export const showPost = writable({
	value: null,
	calledBy: null,
	postID: null,
});
