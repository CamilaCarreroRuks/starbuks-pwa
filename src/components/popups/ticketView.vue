<template>
  <q-dialog persistent style="min-width: 250px; min-height: 250px">
    <q-card class="" style="max-width: 420px; width: 100%; min-height: 350px">
      <q-card-section class="row items-center q-pa-none text-primary">
        <q-btn class="col-2" icon="close" flat round dense @click="goHome" />
        <q-img
          class="col-4"
          width="70px"
          src="~src/assets/Logo.png"
          style="border-radius: 3px"
        />
        <h6 class="col text-primary q-ma-none">Starbuks</h6>
      </q-card-section>
      <div class="q-mr-md q-ml-md" style="border-style: ridge">
        <p class="col q-ma-none">Cliente: {{ name }}</p>
        <p class="col q-ma-none">Fecha: {{ buy.date }} {{ buy.time }}</p>
        <p class="col q-ma-none">Nº ticket: {{ props.idBuy }}</p>
      </div>
      <div class="row q-ma-md" v-for="item of buy.products" v-bind:key="item">
        <div class="col-7">{{ item.name }}</div>
        <div class="col-3">x {{ item.stock }}</div>
        <div class="col-2">${{ item.stock * item.price }}</div>
      </div>
      <footer
        class="row q-ma-md"
        style="
          position: absolute;
          bottom: 0;
          min-width: 88%;
          border-top-style: ridge;
        "
      >
        <p class="col q-ma-none">Total:</p>
        <p class="col text-center q-ma-none">{{ buy.count }}</p>
        <p class="col-1 q-ma-none">x</p>
        <p class="col-3 text-center q-ma-none">${{ buy.price }}</p>
      </footer>
    </q-card>
    <MyLoading v-if="loading" />
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useBuys } from "src/stores/buys";
import { useUser } from "src/stores/user";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import MyLoading from "./MyLoading.vue";

const $router = useRouter();
const $q = useQuasar();
const storeBuy = useBuys();
const storeUser = useUser();
const buy = ref([]);
const name = ref(null);
const loading = ref(false);
const props = defineProps({
  idBuy: {
    type: String,
    required: true,
  },
});

onMounted(async () => {
  await getBuy();
  await getUserName();
});

const getBuy = async () => {
  try {
    loading.value = true;
    const response = await storeBuy.listOneBuy(props.idBuy);
    if (response.status === 200) {
      buy.value = response.value;
    }
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const getUserName = async () => {
  try {
    const response = await storeUser.listOneUser(buy.value.user);
    if (response.status === 200) {
      name.value = response.value.name;
    }
  } catch (error) {
    console.error(error);
  }
};
const goHome = () => {
  $router.push({ name: "home" });
};
</script>

<style>
.h6 {
  font-size: 0.8rem;
}
</style>
