import { writable } from "svelte/store";

export const user = writable(null);

export const showPost = writable({
	value: false,
	calledBy: null,
	postID: null,
});
