import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "vuejslive2022";

const app = createApp({
  data() {
    return {
      products: [],
			product: {},
      productId: "",
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products`)
        .then((res) => {
          console.log("產品列表:", res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    getProduct(id) {
			this.productId = id;
			axios.get(`${apiUrl}/api/${apiPath}/product/${id}`)
				.then((res) => {
					this.product = res.data.product;
					this.$refs.productModal.openModal();
				})
				.catch((err) => {
					alert(err.data.message);
				})
    },
  },
  mounted() {
    this.getProducts();
  },
});
// 產品 modal 元件
const productModal = {
	// 1. 當 id 變動時取得遠端資料，並呈現 modal（使用  watch 監聽 props 傳入的值）
  // 2. 外層使用 ref 來取得內層 modal 方法，再用 prop 傳入內層
  props: {
		product: {
			// 進行型別驗證
			type: Object,
			default() {
				return {
					message: '資料錯誤'
				};
			},
		},
	},
  data() {
    return {
      modal: {},
      // 暫存產品資料
      tempProduct: {},
    };
  },
  template: "#userProductModal",
  methods: {
    openModal() {
			this.modal.show();
    },
  },
  mounted() {
    // modal 初始化（用 id 取得或用 ref 取得都可以）
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};

app.component("productModal", productModal);
app.mount("#app");
