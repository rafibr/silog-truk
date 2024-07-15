<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { DataTable } from "@jobinsjp/vue3-datatable"
import "@jobinsjp/vue3-datatable/dist/style.css"
import { VCard, VInput, VSlideGroupItem, VTabs, VTabsWindowItem, VTextField } from 'vuetify/components';

const tab = ref(0);

// from env APP_URL + SERVER_PORT
const server = import.meta.env.VITE_APP_URL + ':' + import.meta.env.VITE_APP_SERVER_PORT;
const apiUrl = (apiCode) => {
  return `${server}/api/queries/${apiCode}/results`;
}

const apiList = [
  { name: 'Transaksi Purchasing', code: 157, key: 'transaksi_purchasing' },
];

// date now
const startDate = ref('2024-06-01');
const endDate = ref('2024-06-30');
const isTablePurchasingLoading = ref(false);
const headersDetilEPurchasing = ref([]);
const itemsPurchasing = ref([]);
const searchFieldPurchasing = ref([]);
const searchValuePurchasing = ref('');

const params = {
  provinsi: ['Kalimantan Selatan'],
  Jenis_Katalog: ['KATALOG LOKAL'],
  pengelola: ['Kab. Tanah Laut'],
  'Tahun Anggaran': ['2024'],
  klpd: ['ALL'],
  'Nama Satker Transaksi': ['ALL']
};

const getDataPurchasing = () => {

  isTablePurchasingLoading.value = true;

  //flips the date if the start date is greater than the end date
  if (new Date(startDate.value) > new Date(endDate.value)) {
    const temp = startDate.value;
    startDate.value = endDate.value;
    endDate.value = temp;
  }

  // add tanggal to params
  params.Tanggal = {
    start: startDate.value,
    end: endDate.value
  };

  axios.post(apiUrl(apiList.find(x => x.key === 'transaksi_purchasing').code), {
    queryId: apiList.find(x => x.key === 'transaksi_purchasing').code,
    parameters: params
  })
    .then(response => {
      isTablePurchasingLoading.value = false;
      const responseData = response.data.query_result.data;

      // map data
      headersDetilEPurchasing.value = responseData.columns.map(x => {
        return {
          text: x.name,
          value: x.name,
          sortable: true,
          width: 200
        };
      });

      // search field
      searchFieldPurchasing.value = headersDetilEPurchasing.value.map(x => x.value);

      itemsPurchasing.value = responseData.rows.map(x =>
        Object.fromEntries(
          Object.entries(x).map(([key, value]) => {
            return [key, value];
          })
        )
      );
    })
    .catch(error => {
      isTablePurchasingLoading.value = false;
      console.log(error);
    });
};

// watch startDate and endDate
watch([startDate, endDate], () => {
  getDataPurchasing();
});

</script>

<template>
  <div class="p-4">
    <div class="flex space-x-4 border-b border-gray-300 pb-4 rounded-md shadow-sm bg-white p-4">
      <VLabel class="text-gray-700">Tanggal Awal</VLabel>
      <input type="date" v-model="startDate" class="mr-4 border border-gray-300 rounded-md p-2 shadow-sm bg-white" />

      <VLabel>Tanggal Akhir</VLabel>
      <input type="date" v-model="endDate" class="mr-4 border border-gray-300 rounded-md p-2 shadow-sm bg-white" />

      <VBtn @click="getDataPurchasing()">Get Data</VBtn>
    </div>

    <!-- card with tabs -->
    <VCard class="mt-4 p-4">
      <VTabs v-model="tab">
        <VTab v-for="(item, index) in apiList" :key="index" :value="index">
          <div class="text-sm">
            {{ item.name }}
          </div>
        </VTab>
      </VTabs>

      <VTabsWindow v-model="tab">
        <VTabsWindowItem v-for="(item, index) in apiList" :key="index" :value="index">
          <div v-if="apiList[tab].key === 'transaksi_purchasing'" class="m-4">
            <VTextField v-model="searchValuePurchasing" placeholder="Search">
              <template v-slot:prepend>
                <VIcon>mdi-magnify</VIcon>
              </template>
            </VTextField>

            <EasyDataTable :headers="headersDetilEPurchasing" :items="itemsPurchasing"
              :search-field="searchFieldPurchasing" buttons-pagination :search-value="searchValuePurchasing"
              :rows-per-page="5" :loading="isTablePurchasingLoading">
              <template #loading>
                <img src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
                  style="width: 100px; height: 80px;" />
              </template>
            </EasyDataTable>
          </div>
        </VTabsWindowItem>
      </VTabsWindow>


    </VCard>
  </div>
</template>
