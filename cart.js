import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "vuejslive2022";

const app = createApp({
  data() {
    return {
      products: [],
			product: {},
			cart: {},
			loadingItem: '', // 儲存 id (避免重複觸發)
    };
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
					alert(err.data.message);
        });
    },
    getProduct(id) {
			this.loadingItem = id;
			axios.get(`${apiUrl}/api/${apiPath}/product/${id}`)
				.then((res) => {
					this.product = res.data.product;
					this.$refs.productModal.openModal();
					this.loadingItem = '';
				})
				.catch((err) => {
					alert(err.data.message);
				})
    },
		addToCart(product_id, qty = 1){ // 參數預設值： qty 預設為 1
			const data = {
				product_id,
				qty,
			};
			this.loadingItem = product_id;
			axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
				.then((res) => {
					console.log(res.data);
					alert(res.data.message);
					this.$refs.productModal.closeModal(); // 新增關閉 modal 方法
					this.getCarts();
					this.loadingItem = '';
				})
				.catch((err) => {
					alert(err.data.message);
				})
		},
		getCarts() {
			axios.get(`${apiUrl}/api/${apiPath}/cart`)
				.then((res) => {
					this.cart = res.data.data; // 注意資料結構
					console.log(this.cart.carts.length === 0);
				})
				.catch((err) => {
					alert(err.data.message);
				})
    },
		editCartItem(cartItem) { 
			const data = {
				product_id: cartItem.product_id, // 產品 id
				qty: cartItem.qty,
			};
			this.loadingItem = cartItem.id;
			axios.put(`${apiUrl}/api/${apiPath}/cart/${cartItem.id}`, { data }) // 購物車 id
				.then((res) => {
					alert(res.data.message)
					this.getCarts();
					this.loadingItem = '';
				})
				.catch((err) => {
					alert(err.data.message);
				})
		},
		delCartItem(cartId) { // 需要購物車 id
			this.loadingItem = cartId;
			axios.delete(`${apiUrl}/api/${apiPath}/cart/${cartId}`)
				.then((res) => {
					alert(res.data.message)
					this.getCarts();
					this.loadingItem = '';
				})
				.catch((err) => {
					alert(err.data.message);
				})
		},
		delCarts() { 
			axios.delete(`${apiUrl}/api/${apiPath}/carts`)
				.then((res) => {
					alert(res.data.message)
					this.getCarts();
				})
				.catch((err) => {
					alert(err.data.message);
				})
		},
  },
  mounted() {
    this.getProducts();
		this.getCarts();
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
		addToCart: {},
	},
  data() {
    return {
      modal: {},
			qty: 1, // 預設為 1
    };
  },
  template: "#userProductModal",
  methods: {
    openModal() {
			this.modal.show();
    },
		closeModal() {
			this.modal.hide();
		}
  },
  mounted() {
    // modal 初始化（用 id 取得或用 ref 取得都可以）
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};

app.component("productModal", productModal);
app.mount("#app");
