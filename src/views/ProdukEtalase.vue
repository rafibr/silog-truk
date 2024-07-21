<script setup>
import { onMounted, ref, watch } from "vue";
import { DataTable } from "@jobinsjp/vue3-datatable";
import "@jobinsjp/vue3-datatable/dist/style.css";
import { useDataStore } from "@/store/useDataStore";
import { Chart, registerables } from "chart.js";
import { BarChart, DoughnutChart, LineChart, PieChart } from "vue-chart-3";

Chart.register(...registerables);

const dataStore = useDataStore();

const chartDataOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      fullSize: true,
      onHover: function (event, legendItem) {
        document.body.style.cursor = "pointer";
      },
      onLeave: function (event, legendItem) {
        document.body.style.cursor = "default";
      },
    },
  },
});

const chartProdukTKDNRef = ref();
const chartProdukTKDN = ref();

const chartProdukTanpaTKDNRef = ref();
const chartProdukTanpaTKDN = ref();

const chartProdukImportRef = ref();
const chartProdukImport = ref();

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
const isTableProdukEtalaseLoading = ref(false);
const headersDetilProdukEtalase = ref([]);
const itemsProdukEtalase = ref([]);
const searchFieldProdukEtalase = ref([]);
const searchValueProdukEtalase = ref("");

const searchEtalaseKonstruksi = ref("");

const handleSearchValueProdukEtalase = () => {
  if (searchEtalaseKonstruksi.value === "Semua") {
    searchValueProdukEtalase.value = "";
    return;
  }
  searchValueProdukEtalase.value = searchEtalaseKonstruksi.value;
};

// get data purchasing
const getDataProdukEtalase = async () => {
  // reset search value
  searchValueProdukEtalase.value = "";

  isTableProdukEtalaseLoading.value = true;

  await dataStore.getProdukEtalase(params).then((responseData) => {
    // map data
    headersDetilProdukEtalase.value = responseData.columns.map((x) => {
      return {
        text: x.name,
        value: x.name,
        sortable: true,
        width: 200,
      };
    });

    // search field
    searchFieldProdukEtalase.value = headersDetilProdukEtalase.value.map(
      (x) => x.value
    );

    itemsProdukEtalase.value = responseData.rows.map(function (x) {
      return Object.fromEntries(
        Object.entries(x).map(([key, value]) => {
          return [key, value];
        })
      );
    });

    handleProdukTKDNChart(itemsProdukEtalase.value);
    handleProdukTanpaTKDNChart(itemsProdukEtalase.value);
    handleProdukImportChart(itemsProdukEtalase.value);

    isTableProdukEtalaseLoading.value = false;
  });
};

// handle produk TKDN chart
const handleProdukTKDNChart = (items) => {
  // Etalase chart ----------------------------------------------
  const dataProdukTKDN = items.map((x) => {
    return {
      data: x["Produk Lokal TKDN"],
    };
  });

  chartProdukTKDN.value = {
    labels: items.map((x) => x.Etalase.substring(0, 25) + "..."),
    datasets: [{ data: dataProdukTKDN.map((x) => x.data) }],
  };
  chartProdukTKDNRef.value.update();
  // End Etalase chart ----------------------------------------------
};

// handle produk Tanpa TKDN chart
const handleProdukTanpaTKDNChart = (items) => {
  // Etalase chart ----------------------------------------------
  const dataProdukTanpaTKDN = items.map((x) => {
    return {
      data: x["Produk Lokal Tanpa TKDN"],
    };
  });

  chartProdukTanpaTKDN.value = {
    labels: items.map((x) => x.Etalase.substring(0, 25) + "..."),
    datasets: [{ data: dataProdukTanpaTKDN.map((x) => x.data) }],
  };
  chartProdukTanpaTKDNRef.value.update();
  // End Etalase chart ----------------------------------------------
};

// handle Produk Impor chart
const handleProdukImportChart = (items) => {
  // Etalase chart ----------------------------------------------
  const dataProdukImport = items.map((x) => {
    return {
      data: x["Produk Impor"],
    };
  });

  chartProdukImport.value = {
    labels: items.map((x) => x.Etalase.substring(0, 25) + "..."),
    datasets: [{ data: dataProdukImport.map((x) => x.data) }],
  };
  chartProdukImportRef.value.update();
  // End Etalase chart ----------------------------------------------
};

onMounted(() => {
  getDataProdukEtalase();
});
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <VCard class="flex space-x-4 py-4 rounded-md shadow-lg text-center">
      <button
        @click="getDataProdukEtalase"
        class="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded"
      >
        Ambil data
      </button>
    </VCard>

    <div class="p-4 bg-white rounded-md shadow-lg border border-gray-200">
      <div class="px-4">
        <!-- search etalase konstruksi -->
        <VSelect
          v-model="searchEtalaseKonstruksi"
          :items="searchEtalaseKonstruksiList"
          label="Etalase Konstruksi"
          placeholder="Search"
          :search="true"
          @update:model-value="handleSearchValueProdukEtalase('etalase')"
        />

        <EasyDataTable
          :headers="headersDetilProdukEtalase"
          :items="itemsProdukEtalase"
          :search-field="searchFieldProdukEtalase"
          :search-value="searchValueProdukEtalase"
          buttons-pagination
          :rows-per-page="5"
          :loading="isTableProdukEtalaseLoading"
        />
      </div>
    </div>

    <!-- chart produk TKDN -->
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
    >
      <h2 class="text-lg font-bold text-gray-700">Produk Lokal TKDN</h2>
      <PieChart
        ref="chartProdukTKDNRef"
        :chartData="chartProdukTKDN"
        :options="chartDataOptions"
      />
    </div>

    <!-- chart produk tanpa TKDN -->
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
    >
      <h2 class="text-lg font-bold text-gray-700">Produk Lokal Tanpa TKDN</h2>
      <PieChart
        ref="chartProdukTanpaTKDNRef"
        :chartData="chartProdukTanpaTKDN"
        :options="chartDataOptions"
      />
    </div>

    <!-- chart Produk Impor -->
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
    >
      <h2 class="text-lg font-bold text-gray-700">Produk Impor</h2>
      <PieChart
        ref="chartProdukImportRef"
        :chartData="chartProdukImport"
        :options="chartDataOptions"
      />
    </div>
  </div>
</template>
