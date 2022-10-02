<template>
  <q-dialog v-model="popUpStarted">
    <q-card style="max-width: 420px; width: 100%">
      <q-card-section class="row items-center q-pa-none text-primary">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="didTapSend">
          <div class="row">
            <div class="col-xs-12">
              <div class="text-primary text-h6 q-mb-md text-center">
                Ingresa tus datos
              </div>
            </div>
          </div>
          <div class="row q-mt-xs q-mx-md justify-center">
            <div class="col-xs-10">
              <q-input
                outlined
                dense
                type="email"
                v-model="email"
                label="Correo electrónico"
                lazy-rules="ondemand"
                bg-color="white"
                color="black"
                :rules="[(val) => (val && val.length > 0) || '']"
              >
                <template v-slot:append>
                  <q-icon name="eva-email-outline" color="primary" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-mt-xs q-mx-md justify-center">
            <div class="col-xs-10">
              <q-input
                class="custom-input-field"
                outlined
                dense
                :type="isPasswordHide ? 'password' : 'text'"
                v-model="password"
                label="Contraseña"
                lazy-rules="ondemand"
                bg-color="white"
                color="black"
                :rules="[
                  (val) =>
                    (val && val.length > 0 && val.length >= 6) ||
                    'Mínimo 6 caracteres',
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    color="primary"
                    :name="
                      isPasswordHide ? 'eva-eye-off-outline' : 'eva-eye-outline'
                    "
                    class="cursor-pointer"
                    @click="isPasswordHide = !isPasswordHide"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-mt-xs q-mx-md justify-center">
            <div class="col-xs-10">
              <q-input
                class="custom-input-field"
                outlined
                dense
                :type="isPasswordHide2 ? 'password' : 'text'"
                v-model="password2"
                label="Contraseña"
                lazy-rules="ondemand"
                bg-color="white"
                color="black"
                :rules="[
                  (val) =>
                    (val && val.length > 0 && val.length >= 6) ||
                    'Mínimo 6 caracteres',
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    color="primary"
                    :name="
                      isPasswordHide2
                        ? 'eva-eye-off-outline'
                        : 'eva-eye-outline'
                    "
                    class="cursor-pointer"
                    @click="isPasswordHide2 = !isPasswordHide2"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="col-xs-10 col-sm-auto text-center self-center">
            <q-btn
              rounded
              outline
              class="q-px-md"
              type="submit"
              color="primary"
              label="Registrarse"
              :ripple="{ center: true }"
              @click="didTapSend"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useQuasar } from "quasar";

const name = ref("ComponentPasswordRecoveryView");
const $q = useQuasar();
const emit = defineEmits(["didTapRegister"]);
const popUpStarted = ref(false);
const email = ref("");
const password = ref("");
const isPasswordHide = ref(true);
const password2 = ref("");
const isPasswordHide2 = ref(true);

const show = (props) => {
  email.value = props ?? "";
  popUpStarted.value = true;
};
const hide = () => {
  email.value = "";
  popUpStarted.value = false;
};
const didTapSend = () => {
  if (
    email.value.length > 0 &&
    password.value.length > 0 &&
    password2.value.length > 0
  ) {
    if (password.value == password2.value) {
      emit("didTapRegister", email.value, password.value);
    } else {
      $q.notify({
        message: "Las contraseñas no coinciden",
        color: "negative",
        timeout: 2000,
      });
    }
  } else {
    $q.notify({
      message: "Debe ingresar todos los datos",
      color: "red",
      icon: "report_off",
    });
  }
};

defineExpose({
  show,
  hide,
  didTapSend,
});
</script>
