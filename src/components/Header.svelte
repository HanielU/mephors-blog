<script>
	import { logout } from "../firebase";
	export let user;
</script>

<header>
	<div class="greeting">
		<h3>
			Welcome {user.displayName.split(" ")[1]}
		</h3>
	</div>
	<button on:click={logout}> logout </button>
</header>

<style lang="scss">
	header {
		width: 100%;
		height: 80px;
		margin-bottom: 80px;
		font-family: $main-font;
		padding: 0 20px;
		@include border;
		@include flex($justify: space-between);

		button {
			@include border($color: $blue);
			padding: 8px 15px;
			border-radius: $little-radius;
			color: $blue;
		}
	}

	.greeting {
		h3 {
			font-size: $small;
			font-weight: $regular;
		}
	}
</style>
