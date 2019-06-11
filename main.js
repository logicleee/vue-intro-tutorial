Vue.component('product', {
  props: {
    premium: {
      required: true,
      type: Boolean
    }
  },

  template: `
      <div class="product">
        <div class="product-image">
          <img v-bind:src="image" >
        </div>
        <div class="product-info">
          <h1>{{ title }}</h1>
          <p>Shipping: {{ shipping }}</p>
          <p>{{ product.description }}</p>
          <p v-if="inventory > 10">In stock</p>
          <p v-else-if="inventory <= 10 &&
                        inventory > 0">Almost sold out!</p>
          <p v-else>Out of Stock</p>
          <ul>
            <li v-for="detail in product.details">{{ detail }}</li>
          </ul>
          <div v-for="(variant, index) in product.variants"
               :key="variant.variantId"
               class="color-box"
               :style="{ backgroundColor: variant.variantColor}"
               @mouseover="updateProduct(index)">
          </div>
        </div>
      <button v-on:click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">Add to Cart</button>
      </div>
    `,
  data() {
    return {
      product: {
        brand: 'Vue Mastery',
        title: 'Socks',
        description: 'They keep your feet toasty.',
        selectedVariant: 0,
        details: ['80% cotton', '20% ployester', 'Gender-neutral'],
        variants: [
          {
            variantId: 2234,
            variantColor: 'green',
            variantImage: './assets/vmSocks-green-onWhite.jpg',
            variantQuantity: 11
          },
          {
            variantId: 2235,
            variantColor: 'blue',
            variantImage: './assets/vmSocks-blue-onWhite.jpg',
            variantQuantity: 0
          }
        ]
      },
    };
  },
  methods: {
    addToCart() {
      this.product.variants[this.product.selectedVariant].variantQuantity--;
      this.$emit('add-to-cart',
                 this.product.variants[this.product.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.product.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return this.product.brand + ' ' + this.product.title;
    },
    image() {
      return this.product.variants[this.product.selectedVariant].variantImage;
    },
    inStock() {
      return this.inventory > 0;
    },
    inventory() {
      return this.product.variants[this.product.selectedVariant].variantQuantity;
    },
    shipping() {
      if(this.premium) {
        return 'Free';
      }
      return '2.99';
    }
  }
});

const app = new Vue ({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    }
  }
});
