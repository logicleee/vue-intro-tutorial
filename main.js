var eventBus = new Vue();

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-show="errors.length">
        <b>Please correct the following errors:</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>
`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        }
        eventBus.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.errors = [];
      } else {
        if (!this.name) this.errors.push("Name required.")
        if (!this.review) this.errors.push("Review required.")
        if (!this.rating) this.errors.push("Rating required.")
      }

    }

  }
});

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true,
      default: []
    }
  },
  template: `
      <div>
          <span class="tab" v-for="(tab, index) in tabs" 
            :class="{ activeTab: selectedTab === tab }"
            :key="index"
            @click="selectedTab = tab">
              {{ tab }}
          </span>
        <div>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-show="reviews.length < 1">There are no reviews yet</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>Review: {{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Write a Review'"></product-review>
        </div>
      </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Write a Review'],
      selectedTab: 'Reviews'
    }
  }
})
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
          <button v-on:click="addToCart"
                  :disabled="!inStock"
                  :class="{ disabledButton: !inStock }">
                    Add to Cart
          </button>
        </div>
      <product-tabs :reviews="reviews"></product-tabs>
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
        ],
      },
      reviews: []
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
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })

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
