<template>
  <q-page>
    <div class="q-ma-md">
      <q-card class="bg-primary text-white" v-if="dataHotDrink.length > 0">
        <h6 class="q-ma-none q-mb-sm q-mt-sm text-center">Bebidas Calientes</h6>
      </q-card>
      <div v-for="item of dataHotDrink" v-bind:key="item">
        <product-view
          with="90%"
          :name="item.name"
          :stock="item.stock"
          :price="item.price"
          :icon="item.icon"
        />
      </div>
      <q-card class="bg-primary text-white" v-if="dataColdDrink.length > 0">
        <h6 class="q-ma-none q-mb-sm q-mt-sm text-center">Bebidas Frias</h6>
      </q-card>
      <div v-for="item of dataColdDrink" v-bind:key="item">
        <product-view
          :name="item.name"
          :stock="item.stock"
          :price="item.price"
          :icon="item.icon"
        />
      </div>
      <q-card class="bg-primary text-white" v-if="dataEat.length > 0">
        <h6 class="q-ma-none q-mb-sm q-mt-sm text-center">Comidas</h6>
      </q-card>
      <div v-for="item of dataEat" v-bind:key="item">
        <product-view
          :name="item.name"
          :stock="item.stock"
          :price="item.price"
          :icon="item.icon"
        />
      </div>
    </div>
    <Loading v-if="loading" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProductView from "components/ProductView.vue";
import { useQuasar } from "quasar";
import { useProducts } from "src/stores/products";
import Loading from "src/components/popups/MyLoading.vue";

const storeProducts = useProducts();
const data = ref([]);
const dataHotDrink = ref([]);
const dataColdDrink = ref([]);
const dataEat = ref([]);
const loading = ref(false);
onMounted(async () => {
  await getProduct();
  await filterByType();
});

const getProduct = async () => {
  try {
    loading.value = true;
    const response = await storeProducts.listProducts();
    data.value = [];
    response.value.forEach((item) => {
      const fbRow = {
        id: item.id,
        name: item.name,
        icon: item.icon,
        stock: item.stock,
        price: item.price,
        type: item.type,
      };
      data.value.push(fbRow);
    });
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};
const filterByType = async () => {
  data.value.forEach((item) => {
    switch (item.type) {
      case "hotDrink":
        dataHotDrink.value.push(item);
        break;
      case "coldDrink":
        dataColdDrink.value.push(item);
        break;
      case "eat":
        dataEat.value.push(item);
        break;
      default:
        break;
    }
  });
};
</script>

<style>
.h6 {
  font-size: 1rem;
}
</style>
