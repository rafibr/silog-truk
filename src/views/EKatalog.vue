<script setup>
import axios from "axios";
import { ref, watch } from "vue";
import { DataTable } from "@jobinsjp/vue3-datatable";
import "@jobinsjp/vue3-datatable/dist/style.css";
import {
  VCard,
  VInput,
  VSelect,
  VSlideGroupItem,
  VTabs,
  VTabsWindowItem,
  VTextField,
} from "vuetify/components";

const tab = ref(0);

const server =
  import.meta.env.VITE_APP_URL +
  (import.meta.env.VITE_APP_SERVER_PORT
    ? `:${import.meta.env.VITE_APP_SERVER_PORT}`
    : "");

const apiUrl = (apiCode) => {
  return `${server}/api/queries/${apiCode}/results`;
};

const searchList = [
  "Aspal Kabupaten Tanah Laut",
  "Beton Precast Pemerintah Daerah Kabupaten Tanah Laut",
  "Beton Ready Mix Kabupaten Tanah Laut",
  "Drainase Lingkungan Kabupaten Tanah Laut",
  "Pekerjaan Konstruksi Prasarana Sistem Penyediaan Air Minum Terpasang",
  "Pekerjaan Jalan dan Jembatan Terpasang Kabupaten Tanah Laut",
  "Pekerjaan Konstruksi Irigasi, Sungai, Dan Pantai Kabupaten Tanah Laut",
  "Instalasi Sistem Kelistrikan, Mekanikal dan Perlengkapan Jalan Kabupaten Tanah Laut",
  "Pemeliharaan Bangunan Gedung Pemerintah Daerah Kabupaten Tanah Laut",
  "Pembangunan Gedung Negara",
];

const apiList = [
  { name: "Transaksi Purchasing", code: 157, key: "transaksi_purchasing" },
];

// date now
const startDate = ref("2024-06-01");
const endDate = ref("2024-06-30");

// data purchasing
const isTablePurchasingLoading = ref(false);
const headersDetilEPurchasing = ref([]);
const itemsPurchasing = ref([]);
const searchFieldPurchasing = ref([]);
const searchValuePurchasing = ref("");

// data jumlah_produk_tayang_all_time
const isTableJumlahProdukTayangAllTimeLoading = ref(false);
const headersJumlahProdukTayangAllTime = ref([]);
const itemsJumlahProdukTayangAllTime = ref([]);
const searchFieldJumlahProdukTayangAllTime = ref([]);
const searchValueJumlahProdukTayangAllTime = ref("");

const params = {
  provinsi: ["Kalimantan Selatan"],
  Jenis_Katalog: ["KATALOG LOKAL"],
  pengelola: ["Kab. Tanah Laut"],
  "Tahun Anggaran": ["2024"],
  klpd: ["ALL"],
  "Nama Satker Transaksi": ["ALL"],
};

// get data purchasing
const getDataPurchasing = () => {
  isTablePurchasingLoading.value = true;

  axios
    .post(apiUrl(apiList.find((x) => x.key === "transaksi_purchasing").code), {
      queryId: apiList.find((x) => x.key === "transaksi_purchasing").code,
      parameters: params,
    })
    .then((response) => {
      isTablePurchasingLoading.value = false;
      const responseData = response.data.query_result.data;

      // map data
      headersDetilEPurchasing.value = responseData.columns.map((x) => {
        return {
          text: x.name,
          value: x.name,
          sortable: true,
          width: 200,
        };
      });

      // search field
      searchFieldPurchasing.value = headersDetilEPurchasing.value.map(
        (x) => x.value
      );

      itemsPurchasing.value = responseData.rows.map((x) =>
        Object.fromEntries(
          Object.entries(x).map(([key, value]) => {
            return [key, value];
          })
        )
      );
    })
    .catch((error) => {
      isTablePurchasingLoading.value = false;
      console.log(error);
    });
};

const getAllData = async () => {
  //flips the date if the start date is greater than the end date
  if (new Date(startDate.value) > new Date(endDate.value)) {
    const temp = startDate.value;
    startDate.value = endDate.value;
    endDate.value = temp;
  }

  // add tanggal to params
  params.Tanggal = {
    start: startDate.value,
    end: endDate.value,
  };

  await getDataPurchasing();
};
</script>

<template>
  <div class="p-4">
    <div
      class="flex space-x-4 border-b border-gray-300 pb-4 rounded-md shadow-lg bg-white p-4 border border-gray-300"
    >
      <VLabel class="text-gray-700">Tanggal Awal</VLabel>
      <input
        type="date"
        v-model="startDate"
        class="mr-4 border border-gray-300 rounded-md p-2 shadow-sm bg-white"
      />

      <VLabel>Tanggal Akhir</VLabel>
      <input
        type="date"
        v-model="endDate"
        class="mr-4 border border-gray-300 rounded-md p-2 shadow-sm bg-white"
      />

      <button
        @click="getAllData()"
        class="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded"
      >
        Ambil data
      </button>
    </div>

    <!-- card with tabs -->
    <VCard class="mt-4 p-4">
      <VTabs v-model="tab" class="bg-blue-500 text-white">
        <VTab v-for="(item, index) in apiList" :key="index" :value="index">
          <div class="text-sm">
            {{ item.name }}
          </div>
        </VTab>
      </VTabs>

      <VTabsWindow v-model="tab">
        <VTabsWindowItem
          v-for="(item, index) in apiList"
          :key="index"
          :value="index"
        >
          <!-- transaksi_purchasing -->
          <div v-if="apiList[tab].key === 'transaksi_purchasing'" class="m-4">
            <!-- dropdown -->
            <VSelect
              v-model="searchValuePurchasing"
              :items="searchList"
              label="Etalase Konstruksi"
              placeholder="Search"
            ></VSelect>
            <VSelect
              v-model="searchValuePurchasing"
              :items="searchList"
              label="Nama Paket"
              placeholder="Search"
            ></VSelect>

            <EasyDataTable
              :headers="headersDetilEPurchasing"
              :items="itemsPurchasing"
              :search-field="searchFieldPurchasing"
              buttons-pagination
              :search-value="searchValuePurchasing"
              :rows-per-page="5"
              :loading="isTablePurchasingLoading"
            />
          </div>
        </VTabsWindowItem>
      </VTabsWindow>
    </VCard>
  </div>
</template>
