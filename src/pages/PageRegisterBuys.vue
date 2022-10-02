<template>
  <q-page>
    <q-table
      v-if="loading === false"
      fullscreen
      ref="tableRef"
      class="q-pa-none q-ma-none"
      :class="tableClass"
      tabindex="0"
      title="Lista de compras"
      :rows="rows"
      :columns="columns"
      row-key="name"
      v-model:selected="selected"
      v-model:pagination="pagination"
      :filter="filter"
      @focusin="activateNavigation"
      @focusout="deactivateNavigation"
      @keydown="onKey"
      no-data-label="No hay datos"
      no-results-label="No hay resultados"
      rows-per-page-label="Filas por página"
      style="margin-top: 110px"
    >
    </q-table>
    <MyLoading v-if="loading" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useBuys } from "src/stores/buys";
import { useSession } from "src/stores/session";
import MyLoading from "src/components/popups/MyLoading.vue";

const $q = useQuasar();
const storeBuy = useBuys();
const storeSession = useSession();

const rows = ref([]);
const columns = [
  {
    name: "date",
    align: "center",
    label: "Fecha",
    field: "date",
    sortable: true,
    style: "margin: 0px; padding: 0px",
  },
  {
    name: "count",
    align: "center",
    label: "Cantidad",
    field: "count",
    sortable: true,
    style: "margin: 0px; padding: 0px",
  },
  {
    name: "price",
    align: "center",
    label: "Precio",
    field: "price",
    sortable: true,
    style: "margin: 0px; padding: 0px",
  },
];

const tableRef = ref(null);
const navigationActive = ref(false);
const pagination = ref({});
const selected = ref([]);
const filter = ref("");
const tableClass = computed(() =>
  navigationActive.value === true ? "shadow-8 no-outline" : null
);
const activateNavigation = () => {
  navigationActive.value = true;
};

const deactivateNavigation = () => {
  navigationActive.value = false;
};

const onKey = (evt) => {
  if (
    navigationActive.value !== true ||
    [33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
    tableRef.value === null
  ) {
    return;
  }

  evt.preventDefault();

  const { computedRowsNumber, computedRows } = tableRef.value;

  if (computedRows.length === 0) {
    return;
  }

  const currentIndex =
    selected.value.length > 0 ? computedRows.indexOf(selected.value[0]) : -1;
  const currentPage = pagination.value.page;
  const rowsPerPage =
    pagination.value.rowsPerPage === 0
      ? computedRowsNumber
      : pagination.value.rowsPerPage;
  const lastIndex = computedRows.length - 1;
  const lastPage = Math.ceil(computedRowsNumber / rowsPerPage);

  let index = currentIndex;
  let page = currentPage;

  switch (evt.keyCode) {
    case 36: // Home
      page = 1;
      index = 0;
      break;
    case 35: // End
      page = lastPage;
      index = rowsPerPage - 1;
      break;
    case 33: // PageUp
      page = currentPage <= 1 ? lastPage : currentPage - 1;
      if (index < 0) {
        index = 0;
      }
      break;
    case 34: // PageDown
      page = currentPage >= lastPage ? 1 : currentPage + 1;
      if (index < 0) {
        index = rowsPerPage - 1;
      }
      break;
    case 38: // ArrowUp
      if (currentIndex <= 0) {
        page = currentPage <= 1 ? lastPage : currentPage - 1;
        index = rowsPerPage - 1;
      } else {
        index = currentIndex - 1;
      }
      break;
    case 40: // ArrowDown
      if (currentIndex >= lastIndex) {
        page = currentPage >= lastPage ? 1 : currentPage + 1;
        index = 0;
      } else {
        index = currentIndex + 1;
      }
      break;
  }

  if (page !== pagination.value.page) {
    pagination.value.page = page;

    nextTick(() => {
      const { computedRows } = tableRef.value;
      selected.value = [computedRows[Math.min(index, computedRows.length - 1)]];
    });
  } else {
    selected.value = [computedRows[index]];
  }
};

const loading = ref(false);

onMounted(() => {
  getBuys();
});

const getBuys = async () => {
  try {
    loading.value = true;
    const user = (await storeSession.getUserId()).toString();
    const response = await storeBuy.listBuys(user);
    rows.value = [];
    response.value.forEach((item) => {
      const fbRow = {
        date: item.date + " " + item.time,
        count: item.count,
        price: "$" + item.price,
      };
      rows.value.push(fbRow);
    });
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style></style>
