<template>
  <q-page style="max-height: min-content; min-height: auto">
    <q-form
      @submit.prevent="addUser"
      class="row q-col-gutter-sm q-ma-md"
      v-if="!loading"
    >
      <q-input
        type="text"
        label="Nombre y Apellido"
        class="col-12 col-sm-6"
        v-model.trim="name"
        lazy-rules="ondemand"
        :rules="[(val) => (val && val.length > 0) || 'Campo vacío']"
      />
      <q-input
        type="number"
        label="DNI"
        class="col-12 col-sm-6"
        v-model.trim="identification"
        lazy-rules="ondemand"
        :rules="[
          (val) => (val && val.length > 0) || 'Campo vacío',
          (val) => val.length >= 8 || 'Mínimo 8 caracteres',
        ]"
        onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
        maxlength="8"
        oninput="if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
      />
      <q-input
        type="number"
        label="Teléfono"
        class="col-12 col-sm-6"
        v-model.trim="phone"
        lazy-rules="ondemand"
        :rules="[(val) => (val && val.length > 0) || 'Campo vacío']"
        onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
        maxlength="15"
        oninput="if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
      />
      <q-input
        type="text"
        label="Dirección"
        class="col-12 col-sm-6"
        v-model.trim="direction"
        lazy-rules="ondemand"
        :rules="[(val) => (val && val.length > 0) || 'Campo vacío']"
      />
      <div class="col-12">
        <q-btn label="guardar" type="submit" color="primary" />
      </div>
    </q-form>
    <MyLoading v-if="loading" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import MyLoading from "src/components/popups/MyLoading.vue";
import { useSession } from "src/stores/session";
import { useUser } from "src/stores/user";
import { useQuasar } from "quasar";

const $q = useQuasar();
const storeSession = useSession();
const storeUser = useUser();
const loading = ref(false);
const name = ref(null);
const identification = ref(null);
const phone = ref(null);
const direction = ref(null);

onMounted(async () => {
  await getUser();
});

const getUser = async () => {
  try {
    const user = (await storeSession.getUserId()).toString();
    loading.value = true;
    const response = await storeUser.listOneUser(user);
    if (response.status === 200) {
      name.value = response.value.name;
      identification.value = response.value.identification;
      phone.value = response.value.phone;
      direction.value = response.value.direction;
    }
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};
const addUser = async () => {
  const user = (await storeSession.getUserId()).toString();
  try {
    if (validation()) {
      loading.value = true;
      const data = {
        id: user,
        name: name.value,
        identification: identification.value,
        phone: phone.value,
        direction: direction.value,
      };
      const response = await storeUser.addUser(data);
      if (response.status === 200) {
        $q.notify({
          message: "Datos guardados",
          color: "positive",
        });
        goHome();
      }
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};
const validation = () => {
  if (
    name.value != "" &&
    identification.value != "" &&
    phone.value != "" &&
    direction.value != ""
  ) {
    return true;
  } else {
    $q.notify({
      message: "Complete todos los campos",
      color: "negative",
    });
    return false;
  }
};
const goHome = () => {
  $router.push({ name: "home" });
};
</script>

<style></style>
