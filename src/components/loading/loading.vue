<template>
	<div v-if="isShowLoading" class="loading-container">
		<div class="loading-box">
			<div   style="fill: blue; width: 50px; height: 50px;">
				<svg x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
					<path
						d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
						<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25"
							to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
					</path>
				</svg>
			</div>

			<span class="loading-txt">{{content}}</span>
		</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
			isShowLoading: false,
			content: '',
			
		}
	}
}
</script>

<style scoped>
.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(25, 7, 222, 0);
	z-index: 2147483647 ;
}

/* .loading-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100px;
		height: 100px;
		border-radius: 10px;
		background: #e7e7e7;
	} */

.loading-txt {
	font-size: 12px;
	color: #000;
}
</style>
