<script>
	import { logout } from "../firebase";
	import { user } from "../utils/store";
</script>

{#if $user}
	<header>
		<div class="greeting">
			<h3>
				Welcome {$user.displayName.split(" ")[0]}
			</h3>
		</div>
		<button on:click={logout}> logout </button>
	</header>
{/if}

<style lang="scss">
	header {
		width: 100%;
		background: white;
		height: 80px;
		margin-bottom: 10px;
		font-family: $main-font;
		padding: 0 20px;
		border-bottom: 1px solid #d1d1d1;
		position: sticky;
		top: 0;
		left: 0;
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
