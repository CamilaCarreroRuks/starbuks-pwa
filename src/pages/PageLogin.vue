<template>
  <q-page class="bg-primary">
    <div class="q-pa-sm row justify-center absolute-center">
      <div
        class="row q-py-sm bg-primary justify-center"
        style="
          display: flex;
          flex-wrap: wrap;
          border-radius: 16px;
          width: 50%;
          max-height: 30%;
          min-width: 350px;
          align-items: center;
        "
      >
        <div class="col" style="margin: 2px; flex: 1; min-width: 200px">
          <img
            class="justify-end"
            alt="Starbuks"
            src="~assets/Logo.png"
            style="
              max-width: 60%;
              min-height: 2%;
              margin-left: auto;
              margin-right: auto;
              display: block;
            "
          />
        </div>
        <div class="col" style="margin: 5px; flex: 1; min-width: 200px">
          <div class="justify-center q-mt-sm">
            <div class="text-center text-white">
              <h5 class="q-ma-none">Iniciar Sesión</h5>
            </div>
          </div>
          <q-form @submit.prevent="onSubmitLogin" class="q-mt-sm">
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
                        isPasswordHide
                          ? 'eva-eye-off-outline'
                          : 'eva-eye-outline'
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
                <q-btn
                  label="Iniciar Sesión"
                  color="black"
                  class="full-width"
                  type="submit"
                  :ripple="{ center: true }"
                />
              </div>
            </div>
            <div class="row q-mt-md q-mx-md justify-center">
              <div class="col-9" v-on:click="didTapPasswordRecovery">
                <div class="text-center text-h7 text-white cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </div>
              </div>
            </div>
            <div class="row q-mt-md q-mx-md justify-center">
              <div class="col-9" v-on:click="didTapRegisterUserPopUp">
                <div
                  class="text-center text-h7 text-bold text-white cursor-pointer"
                >
                  Registrarse
                </div>
              </div>
            </div>
          </q-form>
          <PasswordRecoveryView
            ref="passwordRecoveryPopUp"
            key="passwordRecoveryPopUp"
            @didTapSend="handleSendEmail"
          />
          <RegisterUserView
            ref="registerUserPopUp"
            @didTapRegister="registerUser"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import PasswordRecoveryView from "components/popups/PasswordRecoveryView.vue";
import { useQuasar } from "quasar";
import { useSession } from "src/stores/session";
import { useRouter } from "vue-router";
import RegisterUserView from "../components/popups/RegisterUserView.vue";

const name = "PageLogin";
const storeSession = useSession();
const $q = useQuasar();
const $router = useRouter();
const email = ref("");
const password = ref("");
const isPasswordHide = ref(true);
const passwordRecoveryPopUp = ref(null);
const registerUserPopUp = ref(null);

const didTapRegisterUserPopUp = () => {
  registerUserPopUp.value.show();
};
const didTapPasswordRecovery = () => {
  passwordRecoveryPopUp.value.show(email.value);
};
const registerUser = async (email, password) => {
  const registerUserResponse = await storeSession.createUser(email, password);
  if (registerUserResponse) {
    $q.notify({
      message: "Usuario registrado correctamente",
      color: "positive",
      timeout: 2000,
    });
    registerUserPopUp.value.hide();
  }
};
const handleSendEmail = async (email) => {
  try {
    const recoverPasswordResponse = await storeSession.recoverPassword({
      email: email,
    });
    passwordRecoveryPopUp.value.hide();
    if (recoverPasswordResponse) {
      $q.notify({
        message: "Se envió un correo a su casilla para cambiar la contraseña",
        color: "positive",
        icon: "done_all",
      });
    }
  } catch (e) {
    passwordRecoveryPopUp.value.hide();
    $q.notify({
      message: "Se produjo un error. Por favor, vuelva a intentarlo",
      color: "red",
      icon: "report_off",
    });
  }
};
const onSubmitLogin = async () => {
  try {
    const loginResponse = await storeSession.login({
      email: email.value,
      password: password.value,
    });
    if (loginResponse) {
      await $router.push({ name: "home" });
    }
  } catch (e) {
    $q.notify({
      message: "Se produjo un error. Por favor, vuelva a intentarlo",
      color: "red",
      icon: "report_off",
    });
  }
};
</script>

<style lang="scss"></style>
