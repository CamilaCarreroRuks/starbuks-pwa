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
                Recibirá un correo a la dirección indicada.
              </div>
            </div>
          </div>
          <div class="row q-mb-sm justify-center q-col-gutter-md">
            <div class="col-xs-10 col-sm self-center">
              <q-input
                class="q-pb-none"
                outlined
                dense
                type="email"
                v-model="email"
                label="Correo electrónico"
                lazy-rules="ondemand"
                :rules="[(val) => (val && val.length > 0) || '']"
              >
                <template v-slot:append>
                  <q-icon name="eva-email-outline" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-xs-10 col-sm-auto text-center self-center">
              <q-btn
                rounded
                outline
                class="q-px-md"
                type="submit"
                color="primary"
                label="Enviar"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const name = ref("ComponentPasswordRecoveryView");

const emit = defineEmits(["didTapSend"]);
const popUpStarted = ref(false);
const email = ref("");

const show = (props) => {
  email.value = props ?? "";
  popUpStarted.value = true;
};
const hide = () => {
  email.value = "";
  popUpStarted.value = false;
};
const didTapSend = () => {
  emit("didTapSend", email.value);
};

defineExpose({
  show,
  hide,
  didTapSend,
});
</script>
