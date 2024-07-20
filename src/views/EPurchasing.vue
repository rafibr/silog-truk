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

const namaPaketList = ref([]);

// date now
const startDate = ref("2024-06-01");
const endDate = ref("2024-06-30");
const params = {
  provinsi: ["Kalimantan Selatan"],
  Jenis_Katalog: ["KATALOG LOKAL"],
  pengelola: ["Kab. Tanah Laut"],
  "Tahun Anggaran": ["2024"],
  klpd: ["ALL"],
  "Nama Satker Transaksi": ["ALL"],
};

// data purchasing
const isTablePurchasingLoading = ref(false);
const headersDetilEPurchasing = ref([]);
const itemsPurchasing = ref([]);
const searchFieldPurchasing = ref([]);
const searchValuePurchasing = ref("");

const searchEtalaseKonstruksi = ref("");
const searchNamaPaket = ref("");

const handleSearchValuePurchasing = (searchType) => {
  // push search value to searchValuePurchasing

  if (searchType === "etalase") {
    searchValuePurchasing.value = searchEtalaseKonstruksi.value;
    searchNamaPaket.value = "";
  } else if (searchType === "paket") {
    searchValuePurchasing.value = searchNamaPaket.value;
    searchEtalaseKonstruksi.value = "";
  } else {
    searchValuePurchasing.value = "";
    searchEtalaseKonstruksi.value = "";
    searchNamaPaket.value = "";
  }

  console.log(searchValuePurchasing.value);
};

// get data purchasing
const getDataPurchasing = async () => {
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

  // reset search value
  searchValuePurchasing.value = "";

  // reset nama paket list
  namaPaketList.value = [];
  searchNamaPaket.value = "";

  isTablePurchasingLoading.value = true;

  await dataStore.getEPurchasing(params).then((responseData) => {
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

    itemsPurchasing.value = responseData.rows.map(function (x) {
      // push nama paket to namaPaketList (unique)
      if (!namaPaketList.value.includes(x["Nama Paket"])) {
        namaPaketList.value.push(x["Nama Paket"]);
      }

      return Object.fromEntries(
        Object.entries(x).map(([key, value]) => {
          return [key, value];
        })
      );
    });

    isTablePurchasingLoading.value = false;
  });
};
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <VCard class="flex space-x-4 py-4 rounded-md shadow-lg">
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
        @click="getDataPurchasing"
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
          @update:model-value="handleSearchValuePurchasing('etalase')"
        />

        <!-- search nama paket -->
        <VSelect
          v-model="searchNamaPaket"
          :items="namaPaketList"
          label="Nama Paket"
          placeholder="Search"
          :search="true"
          @update:model-value="handleSearchValuePurchasing('paket')"
        />

        <EasyDataTable
          :headers="headersDetilEPurchasing"
          :items="itemsPurchasing"
          :search-field="searchFieldPurchasing"
          :search-value="searchValuePurchasing"
          buttons-pagination
          :rows-per-page="5"
          :loading="isTablePurchasingLoading"
        />
      </div>
    </VCard>
  </div>
</template>
