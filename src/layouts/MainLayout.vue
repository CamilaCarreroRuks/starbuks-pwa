<template>
  <div class="bg-secondary">
    <q-toolbar class="bg-primary text-secondary">
      <q-btn unelevated size="md" icon="menu" text-color="white">
        <q-menu auto-close>
          <q-list class="text-primary" style="min-width: 100px">
            <q-item clickable @click="goHome">
              <q-item-section>HOME</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable to="/products">
              <q-item-section>PRODUCTOS</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable to="shoppingCart">
              <q-item-section>CARRITO</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable to="/myData">
              <q-item-section>MIS DATOS</q-item-section>
            </q-item>
            <q-item clickable to="/buys">
              <q-item-section>MIS COMPRAS</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-toolbar-title class="text-center" @click="goHome">
        <q-img
          width="120px"
          src="~src/assets/Logo.png"
          style="border-radius: 3px; cursor: pointer"
        />
      </q-toolbar-title>
      <q-btn
        class="q-pa-lg text-h6"
        size="md"
        flat
        round
        dense
        icon="power_settings_new"
        @click="onLogout"
        color="white"
      />
    </q-toolbar>
  </div>
  <q-page-container>
    <router-view />
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="viewBtn">
      <q-btn
        fab
        icon="shopping_cart"
        color="primary"
        size="sm"
        to="/shoppingCart"
      />
    </q-page-sticky>
  </q-page-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useSession } from "src/stores/session";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const $router = useRouter();
const $route = useRoute();
const storeSession = useSession();
const $q = useQuasar();
const loading = ref(false);
const hashSelectedAuth = ref("");

const onLogout = () => {
  loading.value = true;
  $q.dialog({
    title: "Cerrar sesión",
    message: "¿Esta seguro que desea salir?",
    cancel: true,
  }).onOk(async () => {
    await storeSession.logout();
    hashSelectedAuth.value = "#/";
    await $router.replace({ name: "login" });
    loading.value = false;
    localStorage.clear();
  });
};

const viewBtn = () => {
  switch ($route.name) {
    case myData:
      return false;
      break;
    case buys:
      return false;
      break;
    case products:
      return true;
      break;
    default:
      break;
  }
};
const goHome = () => {
  $router.push({ name: "home" });
};
</script>

<style lang="sass">
.my-menu-link
    color: black
    background: #e8c352
</style>
