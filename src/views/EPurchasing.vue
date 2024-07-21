<script setup>
import { onMounted, ref, watch } from "vue";
import { useDataStore } from "@/store/useDataStore";
import { Chart, registerables } from "chart.js";
import { BarChart, DoughnutChart, LineChart, PieChart } from "vue-chart-3";

Chart.register(...registerables);

const dataStore = useDataStore();

const chartEtalaseRef = ref();
const chartPaketRef = ref();

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
const dateNow = new Date();
const dateThisMonth = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
const startDate = ref(dateThisMonth.toISOString().split("T")[0]);
const endDate = ref(dateNow.toISOString().split("T")[0]);
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

// data chart etalase
const chartDataEtalase = ref();
// data chart paket
const chartDataPaket = ref();

const handleSearchValuePurchasing = (searchType) => {
  // push search value to searchValuePurchasing
  if (searchType === "etalase") {
    // if semua
    if (searchEtalaseKonstruksi.value === "Semua") {
      searchValuePurchasing.value = "";
      searchNamaPaket.value = "";
    } else {
      searchValuePurchasing.value = searchEtalaseKonstruksi.value;
      searchNamaPaket.value = "";
    }
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
    let temp = startDate.value;
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
      if (!namaPaketList.value.includes(x["Nama Paket"])) {
        namaPaketList.value.push(x["Nama Paket"]);
      }

      return Object.fromEntries(
        Object.entries(x).map(([key, value]) => {
          return [key, value];
        })
      );
    });

    handleEtalaseChart(itemsPurchasing.value);
    handlePaketChart(itemsPurchasing.value);

    isTablePurchasingLoading.value = false;
  });
};

// handle etalase chart
const handleEtalaseChart = (items) => {
  // Etalase chart ----------------------------------------------
  const etalaseRows = items.map((x) => x.Etalase.slice(0, 25) + "...");

  const etalaseRowsUnique = [...new Set(etalaseRows)];

  // data count etalase
  const dataCountEtalase = etalaseRowsUnique.map((x) => {
    return {
      labels: x,
      data: etalaseRows.filter((y) => y === x).length,
    };
  });

  chartDataEtalase.value = {
    labels: ["Etalase Konstruksi"],
    datasets: dataCountEtalase.map((x) => {
      return {
        label: x.labels,
        data: [x.data],
      };
    }),
  };

  chartEtalaseRef.value.update();
  // End Etalase chart ----------------------------------------------
};

// handle paket chart
const handlePaketChart = (items) => {
  // Paket chart ----------------------------------------------
  const paketRows = items.map((x) => x["Nama Paket"].slice(0, 25) + "...");

  const paketRowsUnique = [...new Set(paketRows)];

  // data count paket
  const dataCountPaket = paketRowsUnique.map((x) => {
    return {
      labels: x,
      data: paketRows.filter((y) => y === x).length,
    };
  });

  chartDataPaket.value = {
    labels: ["Paket"],
    datasets: dataCountPaket.map((x) => {
      return {
        label: x.labels,
        data: [x.data],
      };
    }),
  };

  chartPaketRef.value.update();
  // End Paket chart ----------------------------------------------
};

// on mounted
onMounted(() => {
  chartEtalaseRef.value.update();
  getDataPurchasing();
});
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

    <div class="p-4 bg-white rounded-md shadow-lg border border-gray-200">
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

    <div class="flex gap-4">
      <div
        class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full overflow-clip"
      >
        <h2 class="text-lg font-bold text-gray-700">Etalase Konstruksi</h2>
        <BarChart
          ref="chartEtalaseRef"
          :chartData="chartDataEtalase"
          :options="chartDataOptions"
        />
      </div>

      <div
        class="p-4 bg-white rounded-md shadow-lg border border-gray-200 w-full"
      >
        <h2 class="text-lg font-bold text-gray-700">Nama Paket</h2>
        <BarChart
          ref="chartPaketRef"
          :chartData="chartDataPaket"
          :options="chartDataOptions"
        />
      </div>
    </div>
  </div>
</template>
