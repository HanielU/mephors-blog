<script>
	import CrossIcon from "../svgs/CrossIcon.svelte";
</script>

<div class="close-btn" on:click title="close">
	<CrossIcon
		width="12px"
		height="12px"
		color="#fff"
		stroke="#fff"
		strokeWidth="2px"
	/>
</div>

<style lang="scss">
	.close-btn {
		background: #eb5e5e;
		display: inline-block;
		padding: 12px;
		border-radius: $little-radius - 2px;
		cursor: pointer;
	}
</style>
