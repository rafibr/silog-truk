<script setup>
import { ref, watch } from "vue";
import { DataTable } from "@jobinsjp/vue3-datatable";
import "@jobinsjp/vue3-datatable/dist/style.css";
import { useDataStore } from "@/store/useDataStore";

const dataStore = useDataStore();

const searchEtalaseKonstruksiList = [
  "Semua",
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

// date now
const params = {
  provinsi: ["Kalimantan Selatan"],
  Jenis_Katalog: ["KATALOG LOKAL"],
  pengelola: ["Kab. Tanah Laut"],
};

// data purchasing
const isTablePenyediaProdukLoading = ref(false);
const headersDetilPenyediaProduk = ref([]);
const itemsPenyediaProduk = ref([]);
const searchFieldPenyediaProduk = ref([]);
const searchValuePenyediaProduk = ref("");

const searchEtalaseKonstruksi = ref("");

const handleSearchValuePenyediaProduk = () => {
  if (searchEtalaseKonstruksi.value === "Semua") {
    searchValuePenyediaProduk.value = "";
    return;
  }
  searchValuePenyediaProduk.value = searchEtalaseKonstruksi.value;
};

// get data purchasing
const getDataPenyediaProduk = async () => {
  // reset search value
  searchValuePenyediaProduk.value = "";

  isTablePenyediaProdukLoading.value = true;

  await dataStore.getPenyediaProduk(params).then((responseData) => {
    // map data
    headersDetilPenyediaProduk.value = responseData.columns.map((x) => {
      return {
        text: x.name,
        value: x.name,
        sortable: true,
        width: 200,
      };
    });

    // search field
    searchFieldPenyediaProduk.value = headersDetilPenyediaProduk.value.map(
      (x) => x.value
    );

    itemsPenyediaProduk.value = responseData.rows.map(function (x) {
      return Object.fromEntries(
        Object.entries(x).map(([key, value]) => {
          return [key, value];
        })
      );
    });

    isTablePenyediaProdukLoading.value = false;
  });
};
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <VCard class="flex space-x-4 py-4 rounded-md shadow-lg text-center">
      <button
        @click="getDataPenyediaProduk"
        class="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded"
      >
        Ambil data
      </button>
    </VCard>

    <VCard class="flex py-4 rounded-md shadow-lg">
      <div class="px-4">
        <!-- search etalase konstruksi -->
        <VSelect
          v-model="searchEtalaseKonstruksi"
          :items="searchEtalaseKonstruksiList"
          label="Etalase Konstruksi"
          placeholder="Search"
          :search="true"
          @update:model-value="handleSearchValuePenyediaProduk('etalase')"
        />

        <EasyDataTable
          :headers="headersDetilPenyediaProduk"
          :items="itemsPenyediaProduk"
          :search-field="searchFieldPenyediaProduk"
          :search-value="searchValuePenyediaProduk"
          buttons-pagination
          :rows-per-page="5"
          :loading="isTablePenyediaProdukLoading"
        />
      </div>
    </VCard>
  </div>
</template>
