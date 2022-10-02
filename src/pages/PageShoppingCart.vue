<template>
  <q-page>
    <div class="row justify-center bg-primary q-pa-md">
      <q-btn
        class="self-center"
        icon="arrow_back"
        flat
        round
        dense
        size="md"
        color="white"
        @click="goHome"
      />
      <q-toolbar-title class="text-center text-white"
        >Carrito de Compra</q-toolbar-title
      >
      <q-btn
        class="self-center"
        icon="delete_outline"
        flat
        round
        dense
        size="md"
        color="white"
        @click="deleteBuy"
      />
    </div>
    <div>
      <div class="row q-ma-md" v-for="item of buy" v-bind:key="item">
        <q-btn class="col-1" icon="close" color="red" size="xs" flat round dense
        @click="deleteProduct(item.name)"/>
        <div class="col-6">{{ item.name }}</div>
        <div class="col-3">x {{ item.stock }}</div>
        <div class="col-2">${{ item.stock * item.price }}</div>
      </div>
    </div>
    <div v-if="buy.length === 0">
      <h6 class="text-center text-underline">Carrito Vacio</h6>
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
      <h6 class="col q-ma-none">Total:</h6>
      <h6 class="col text-center q-ma-none">{{ count }}</h6>
      <h6 class="col-1 q-ma-none">x</h6>
      <h6 class="col-3 text-center q-ma-none">${{ total }}</h6>
      <div class="col-12 text-center">
        <q-btn
          id="btnBuy"
          class="q-mt-md"
          color="primary"
          label="Comprar"
          @click="buyProducts"
        />
      </div>
    </footer>
    <ticket-view v-model="showTicket" v-if="showTicket" :idBuy="idBuy" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useSession } from "src/stores/session";
import { useUser } from "src/stores/user";
import { useBuys } from "src/stores/buys";
import { useProducts } from "src/stores/products";
import ticketView from "src/components/popups/ticketView.vue";

const $q = useQuasar();
const storeSession = useSession();
const storeUser = useUser();
const storeBuy = useBuys();
const storeProducts = useProducts();
const $router = useRouter();
const buy = ref([]);
const showTicket = ref(false);

const count = computed(() => {
  let ct = 0;
  buy.value.forEach((item) => {
    ct = ct + item.stock;
  });
  return ct;
});
const total = computed(() => {
  let ct = 0;
  buy.value.forEach((item) => {
    ct = ct + item.stock * item.price;
  });
  return ct;
});
const date = computed(() => {
  let data = new Date();
  return data.toLocaleDateString();
});
const time = computed(() => {
  let data = new Date();
  return data.toLocaleTimeString();
});
const idBuy = ref(null);

onMounted(() => {
  if (localStorage.length > 0) {
    buy.value = JSON.parse(localStorage.getItem("buy"));
  }
  if (buy.value.length === 0) {
    document.getElementById("btnBuy").disabled = true;
  }
});
const deleteBuy = () => {
  buy.value = [];
  localStorage.removeItem("buy");
};
const buyProducts = async () => {
  try {
    const verification = await verifyDataUser().then((res) => {return res});
    console.log(verification);
    if (verification === true) {
    const data = {
      user: (await storeSession.getUserId()).toString(),
      date: date.value,
      time: time.value,
      products: buy.value,
      count: count.value,
      price: total.value,
    };
    const response = await storeBuy.addBuy(data);
    if (response.status === 200) {

        idBuy.value = response.value;
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Compra Realizada",
        });
        buy.value.forEach((item) => {
          modifyProduct(item.name, item.stock);
        });
        localStorage.clear();
        showTicket.value = true;
    } else {
      $q.notify({
        color: "red-4",
        textColor: "black",
        icon: "cloud_done",
        message: "No se pudo realizar la compra",
      });
    }
  }
  } catch (error) {
    console.error(error);
  }
};
const deleteProduct = async (name) => {
  let newBuy = [];
  buy.value.forEach((item) => {
    if (item.name !== name) {
      newBuy.push(item);
    }
  })
  buy.value = newBuy;
};
const modifyProduct = async (name, count) => {
  try {
    const responseData = await storeProducts.listOneProduct(name);
    if (responseData.status === 200) {
      const data = {
        count: responseData.value[0].stock - count,
        id: responseData.value[0].id,
      };
      const response = await storeProducts.modifyProduct(data);
    }
  } catch (error) {
    console.error(error);
  }
};
const verifyDataUser = async () => {
  try {
    const user = (await storeSession.getUserId()).toString();
    const response = await storeUser.listOneUser(user);
    if (response.status === 200) {
      if (response.value === undefined) {
        $q.notify({
          message: "Por favor ingrese sus datos",
          color: "warning",
          timeout: 2000,
        });
        $router.push("/mydata");
      } else{
        return true;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
const goHome = () => {
  $router.replace({ name: "home" });
};
</script>

<style></style>
