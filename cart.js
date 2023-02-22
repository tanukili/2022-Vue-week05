import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "vuejslive2022";

const app = createApp({
  data() {
    return {
			products: [],
		};
  },
	methods: {
		getProducts() {
			axios.get(`${apiUrl}/api/${apiPath}/products`)
				.then(res => {
					console.log('產品列表:',res.data.products);
					this.products = res.data.products;
				})
				.catch(err => {
					alert(err.data.message);
				})
		}
	},
	mounted() {
		this.getProducts();
	}
});
// 產品 modal 元件
const productModal = {
	data() {
		return {
			// 暫存產品資料
			tempProduct: {},
		};
	},
	template: '#userProductModal',
};

app.component('productModal', {productModal});
app.mount("#app");
