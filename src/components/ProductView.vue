<template>
  <q-card
    class="row"
    style="min-width: 280px; max-width: 400px; max-height: 150px"
  >
    <div class="col-5 q-ma-sm self-center bg-secondary">
      <q-img id="image" class="" :alt="name"
      :src="icon" style="max-height: 100%;" />
    </div>
    <div class="col-6">
      <p class="text-center text-bold q-ma-none q-mt-sm">{{ name }}</p>
      <p class="text-center q-mt-md q-mb-none">{{ price }}</p>
      <div class="row q-mr-sm q-ml-md justify-center">
        <q-btn
          class="col-2 q-ma-sm q-mt-md q-mb-md"
          color="primary"
          icon="remove"
          size="sm"
          @click="removeProduct"
        />
        <p class="col-2 text-center self-center q-mt-md">{{ stock }}</p>
        <q-btn
          class="col-2 q-ma-sm q-mt-md q-mb-md"
          color="primary"
          icon="add"
          size="sm"
          @click="addProduct"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useProducts } from "src/stores/products";

const $q = useQuasar();
const storageProduct = useProducts();
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  price: {
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});
const name = ref(props.name);
const price = ref("$" + props.price);
const stock = ref(0);
const icon = ref(null);
const product = ref({
  name: name.value,
  price: props.price,
  stock: stock.value,
});
const order = ref([]);
const productAdded = ref(false);

onMounted(async () => {
  order.value = [];
  icon.value = await getUrl(props.icon + ".png");
  //localStorage.removeItem('buy');
});
const addProduct = () => {
  if (stock.value < props.stock) {
    order.value = [];
    stock.value++;
    const data = JSON.parse(localStorage.getItem("buy"));
    if (data !== null) {
      if (data[0] !== null) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === name.value) {
            data[i].stock = stock.value;
            productAdded.value = true;
          }
          order.value.push(data[i]);
        }
      }
    }
    if (!productAdded.value) {
      product.value.stock = stock.value;
      order.value.push(product.value);
      productAdded.value = false;
    }
    const parsed = JSON.stringify(order.value);
    localStorage.setItem("buy", parsed);
  } else {
    $q.notify({
        color: "red-4",
        textColor: "black",
        icon: "cloud_done",
        message: "No hay stock disponible",
      });
  }
};
const removeProduct = () => {
  if (stock.value > 0) {
    stock.value--;
    order.value = [];
    const data = JSON.parse(localStorage.getItem("buy"));
    if (data !== null) {
      if (data[0] !== null) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === name.value) {
            data[i].stock = stock.value;
            if (stock.value !== 0) {
              order.value.push(data[i]);
            }
          } else {
            order.value.push(data[i]);
          }
        }
      }
    }
    const parsed = JSON.stringify(order.value);
    localStorage.setItem("buy", parsed);
  }
};
const getUrl = async (url) => {
  try {
    const response = await storageProduct.getUrl(url);
    if (response.status === 200) {
      return response.value[0];
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style></style>
