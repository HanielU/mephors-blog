<script>
	import { login } from "../firebase";
</script>

<section>
	<div class="card">
		<div class="logo-wrapper">
			<h1>Logo</h1>
		</div>

		<p class="undertext">
			This is some dummy text that has something to oo with the product
		</p>

		<div class="sign-in-btn">
			<button on:click={login}> Sign In With Google </button>
		</div>
	</div>
</section>

<style lang="scss">
	section {
		height: 100%;
		width: 100%;
		@include flex;
		font-family: $main-font;
	}

	.card {
		padding: 30px 10px;
		width: 100%;
		max-width: 400px;
		margin: auto;
	}

	.logo-wrapper {
		width: 200px;
		height: 200px;
		background: #f7f7f7;
		margin: 0 auto 30px;
		@include flex;

		h1 {
			font-style: normal;
			font-weight: $semibold;
			font-size: $big + 10px;
		}
	}

	.undertext {
		text-align: center;
		margin-bottom: 40px;
		color: $light-gray;
	}

	.sign-in-btn {
		width: 100%;
		@include flex;

		button {
			padding: 10px 30px;
			font-family: Nunito;
			border: 1px solid $blue;
			border-radius: $little-radius;
			font-weight: $semibold;
			font-size: $small;
			text-align: center;
			color: $blue;
		}
	}

	@media screen and (min-width: 768px) {
		.card {
			max-width: 500px;
			height: 500px;
		}
	}
</style>
