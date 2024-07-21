<script setup>
import { useDataDukungStore } from "@/store/useDataDukungStore";
import jsPDF from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import { onMounted, ref, watch } from "vue";
import { VDatePicker, VIcon, VSnackbar, VTextField } from "vuetify/components";
import { VDateInput } from "vuetify/labs/VDateInput";

applyPlugin(jsPDF);

const dataDukungStore = useDataDukungStore();

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("");

// form with dynamic table row
const tableHeader = ref([
  { text: "Nama Produk", value: "namaProduk" },
  { text: "Kuantitas", value: "kuantitas" },
  { text: "Mata Uang", value: "mataUang" },
  { text: "Harga Satuan", value: "hargaSatuan" },
  { text: "Harga Kirim", value: "hargaKirim" },
  { text: "Harga Negosiasi", value: "hargaNegosiasi" },
  { text: "Tanggal Pengiriman", value: "tanggalPengiriman" },
  { text: "Harga Terbaik", value: "hargaTerbaik" },
  { text: "Catatan Tambahan", value: "catatanTambahan" },
  { text: "Total Harga Produk", value: "totalHargaProduk" },
]);

const data = ref([]);

const handleAddRow = () => {
  data.value.push({
    id: data.value.length + 1,
    namaProduk: "",
    kuantitas: 0,
    mataUang: "",
    hargaSatuan: 0,
    hargaKirim: 0,
    hargaNegosiasi: 0,
    tanggalPengiriman: "",
    hargaTerbaik: 0,
    catatanTambahan: "",
    totalHargaProduk: 0,
  });
};

const getDataDukung = () => {
  dataDukungStore.getDataDukung().then((res) => {
    // set data to data.value
    data.value = dataDukungStore.dataDukung.data;

    // format text based on mataUang
    data.value.forEach((item) => {
      countTotalHargaProduk(item);
    });
  });
};

const saveDataDukung = () => {
  // send with json format
  let dataToSend = {
    data: data.value,
  };

  dataDukungStore.saveDataDukung(dataToSend).then((res) => {});

  snackbarText.value = "Data berhasil disimpan";
  snackbarColor.value = "success";
  snackbar.value = true;
};

onMounted(() => {
  getDataDukung();
});

// watch for data changes. update totalHargaProduk = kuantitas * hargaNegosiasi
const countTotalHargaProduk = (item) => {
  // format text based on mataUang
  item.totalHargaProduk = item.kuantitas * item.hargaNegosiasi;
  if (item.mataUang === "IDR") {
    const formattedRupiah = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(item.totalHargaProduk);

    item.totalHargaProduk = formattedRupiah;
  } else if (item.mataUang === "USD") {
    const formattedDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(item.totalHargaProduk);

    item.totalHargaProduk = formattedDollar;
  } else if (item.mataUang === "EUR") {
    const formattedEuro = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(item.totalHargaProduk);

    item.totalHargaProduk = formattedEuro;
  }
};

// print table data (jspdf)
const printDataDukung = () => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [tableHeader.value.map((item) => item.text)],
    body: data.value.map((item) => [
      item.namaProduk,
      item.kuantitas,
      item.mataUang,
      item.hargaSatuan,
      item.hargaKirim,
      item.hargaNegosiasi,
      item.tanggalPengiriman,
      item.hargaTerbaik,
      item.catatanTambahan,
      item.totalHargaProduk,
    ]),
  });

  doc.save("data_dukung.pdf");
};
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <div
      class="p-4 bg-white rounded-md shadow-lg border border-gray-200 overflow-x-auto"
    >
      <div class="flex justify-end mb-4 gap-4">
        <VBtn @click="handleAddRow" color="primary" outlined>
          <span class="mdi mdi-plus" />
          Tambah Baris
        </VBtn>
        <VBtn @click="saveDataDukung" color="success" outlined>
          <span class="mdi mdi-content-save" />
          Save Data
        </VBtn>

        <VBtn @click="printDataDukung" color="info" outlined>
          <span class="mdi mdi-printer" />
          Print Data
        </VBtn>
      </div>

      <!-- table -->
      <table
        class="w-full p-2 table-auto border-collapse"
        id="dataDukung"
        v-if="data.length > 0"
      >
        <thead class="pb-2 mb-2">
          <tr>
            <th
              v-for="item in tableHeader"
              :key="item.value"
              class="py-5 border border-gray-200 px-2 text-xs"
            >
              {{ item.text }}
            </th>
            <!-- actions -->
            <th class="py-5 border border-gray-200 px-2 text-xs"></th>
          </tr>
        </thead>

        <tbody v-if="data.length > 0">
          <tr class="my-2" v-for="item in data" :key="item.id">
            <td class="border border-gray-200 px-2 w-[200px]">
              <VTextField v-model="item.namaProduk" variant="underlined" />
            </td>
            <td class="border border-gray-200 px-2 w-[80px]">
              <VTextField
                v-model="item.kuantitas"
                type="number"
                variant="underlined"
                @keyup="countTotalHargaProduk(item)"
                @change="countTotalHargaProduk(item)"
              />
            </td>
            <td class="border border-gray-200 px-2 w-[100px]">
              <!-- dropdown -->
              <VSelect
                v-model="item.mataUang"
                :items="['IDR', 'USD', 'EUR']"
                variant="underlined"
                @change="countTotalHargaProduk(item)"
              />
            </td>
            <td class="border border-gray-200 px-2">
              <VTextField v-model="item.hargaSatuan" variant="underlined" />
            </td>
            <td class="border border-gray-200 px-2">
              <VTextField v-model="item.hargaKirim" variant="underlined" />
            </td>

            <td class="border border-gray-200 px-2">
              <VTextField
                v-model="item.hargaNegosiasi"
                type="number"
                variant="underlined"
                @keyup="countTotalHargaProduk(item)"
                @change="countTotalHargaProduk(item)"
              />
            </td>
            <td class="border border-gray-200 items-center w-[150px]">
              <VTextField
                v-model="item.tanggalPengiriman"
                variant="underlined"
                type="date"
              />
            </td>
            <td class="border border-gray-200 px-2">
              <VTextField v-model="item.hargaTerbaik" variant="underlined" />
            </td>
            <td class="border border-gray-200 px-2">
              <VTextField v-model="item.catatanTambahan" variant="underlined" />
            </td>
            <td
              class="border border-gray-200 px-2 w-[150px] overflow-hidden text-right"
            >
              <span class="text-xs">{{ item.totalHargaProduk }}</span>
            </td>

            <td class="border border-gray-200 px-2 w-[10px]">
              <span
                class="mdi mdi-delete cursor-pointer text-red-500"
                @click="data.splice(data.indexOf(item), 1)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else>
        <p class="text-center text-gray-500">Data tidak ditemukan</p>
      </div>

      <!-- snackbar -->
      <VSnackbar v-model="snackbar" color="success">
        {{ snackbarText }}
      </VSnackbar>
    </div>
  </div>
</template>


