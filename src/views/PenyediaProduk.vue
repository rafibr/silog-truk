<script setup>
import { onMounted, ref, watch } from "vue";
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

const chartMikroRef = ref();
const chartMikro = ref();

const chartKecilRef = ref();
const chartKecil = ref();

const chartMenengahRef = ref();
const chartMenengah = ref();

const chartNonUKMRef = ref();
const chartNonUKM = ref();

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

    handleMikroChart(itemsPenyediaProduk.value);
    handleKecilChart(itemsPenyediaProduk.value);
    handleMenengahChart(itemsPenyediaProduk.value);
    handleNonUKMChart(itemsPenyediaProduk.value);

    isTablePenyediaProdukLoading.value = false;
  });
};

// handle mikro chart
const handleMikroChart = (items) => {
  // Etalase chart ----------------------------------------------
  const dataMikro = items.map((x) => {
    return {
      data: x["Usaha Mikro"],
    };
  });

  chartMikro.value = {
    labels: items.map((x) => x.Etalase.substring(0, 25) + "..."),
    datasets: [{ data: dataMikro.map((x) => x.data) }],
  };
  chartMikroRef.value.update();
  // End Etalase chart ----------------------------------------------
};

// handle kecil chart
const handleKecilChart = (items) => {
  // Etalase chart ----------------------------------------------
  const dataKecil = items.map((x) => {
    return {
      data: x["Usaha Kecil"],
    };
  });

  chartKecil.value = {
    labels: items.map((x) => x.Etalase.substring(0, 25) + "..."),
    datasets: [{ data: dataKecil.map((x) => x.data) }],
  };
  chartKecilRef.value.update();
  // End Etalase chart ----------------------------------------------
};

// handle menengah chart
const handleMenengahChart = (items) => {
  // Etalase chart ----------------------------------------------
  const dataMenengah = items.map((x) => {
    return {
      data: x["Usaha Menengah"],
    };
  });

  chartMenengah.value = {
    labels: items.map((x) => x.Etalase.substring(0, 25) + "..."),
    datasets: [{ data: dataMenengah.map((x) => x.data) }],
  };
  chartMenengahRef.value.update();
  // End Etalase chart ----------------------------------------------
};

// handle non UKM chart
const handleNonUKMChart = (items) => {
  // Etalase chart ----------------------------------------------
  const dataNonUKM = items.map((x) => {
    return {
      data: x["Non-UKM"],
    };
  });

  chartNonUKM.value = {
    labels: items.map((x) => x.Etalase.substring(0, 25) + "..."),
    datasets: [{ data: dataNonUKM.map((x) => x.data) }],
  };
  chartNonUKMRef.value.update();
  // End Etalase chart ----------------------------------------------
};

onMounted(() => {
  getDataPenyediaProduk();
});
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

    <div class="p-4 bg-white rounded-md shadow-lg border border-gray-200">
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
    </div>

    <!-- chart Produk mikro -->
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
    >
      <h2 class="text-lg font-bold text-gray-700">Produk Mikro</h2>
      <PieChart
        ref="chartMikroRef"
        :chartData="chartMikro"
        :options="chartDataOptions"
      />
    </div>

    <!-- chart Produk kecil -->
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
    >
      <h2 class="text-lg font-bold text-gray-700">Produk Kecil</h2>
      <PieChart
        ref="chartKecilRef"
        :chartData="chartKecil"
        :options="chartDataOptions"
      />
    </div>

    <!-- chart Produk menengah -->
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
    >
      <h2 class="text-lg font-bold text-gray-700">Produk Menengah</h2>
      <PieChart
        ref="chartMenengahRef"
        :chartData="chartMenengah"
        :options="chartDataOptions"
      />
    </div>

    <!-- chart Produk non UKM -->
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
    >
      <h2 class="text-lg font-bold text-gray-700">Produk Non UKM</h2>
      <PieChart
        ref="chartNonUKMRef"
        :chartData="chartNonUKM"
        :options="chartDataOptions"
      />
    </div>
  </div>
</template>
