<template>
  <q-page class="" style="max-height: min-content; min-height: auto">
    <div class="q-mt-md q-mb-md text-center">
      <q-img
        src="~src/assets/images/moments.jpg"
        alt="#MomentoStabuks"
        style="max-width: 95%; max-height: 350px"
      />
    </div>
    <div class="row q-mt-lg">
      <q-img
        class="col"
        src="~src/assets/images/spring.jpg"
        alt="Hello Primavera"
        style="max-width: 95%; max-height: 350px"
      />
      <q-img
        class="col"
        src="~src/assets/images/spring1.jpg"
        alt="Hello Primavera"
        style="max-width: 95%; max-height: 350px"
      />
    </div>
    <div class="col-12 text-center">
        <q-btn
          id="btnBuy"
          class="q-mt-md"
          color="primary"
          label="Ir a Comprar"
          outline
          @click="goToBuy"
        />
      </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useSession } from "src/stores/session";
import { useUser } from "src/stores/user";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const $router = useRouter();
const storeSession = useSession();
const storeUser = useUser();
onMounted(() => {
  verifyDataUser();
});

const verifyDataUser = async () => {
  try {
    const user = (await storeSession.getUserId()).toString();
    const response = await storeUser.listOneUser(user);
    if (response.status === 200) {
      if (response.value.name === null) {
        $q.notify({
          message: "Por favor ingrese sus datos",
          color: "warning",
          timeout: 2000,
        });
        $router.push("/mydata");
      }
    }
  } catch (error) {
    console.error(error);
  }
};
const goToBuy = () => {
  $router.push("/products");
};
</script>

<style></style>
