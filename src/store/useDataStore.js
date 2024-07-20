// pinia useAuthStore.js

import axios from 'axios';
import { defineStore } from 'pinia'

export const useDataStore = defineStore({
  id: 'data',
  actions: {

    // get data purchasing
    async getEPurchasing(params) {
      const apiUrl = (apiCode) => {
        return `${import.meta.env.VITE_APP_URL}/api/queries/${apiCode}/results`;
      };

      console.log(apiUrl(157));

      return axios
        .post(apiUrl(157), {
          queryId: 157,
          parameters: params,
        })
        .then((response) => {
          const responseData = response.data.query_result.data;

          this.dataEPurchasing = responseData;

          return responseData;
        })
        .catch((error) => {
          console.error(error);
        });

    },

    // get data produk tayang berdasarkan etalase
    async getProdukEtalase(params) {


      const apiUrl = (apiCode) => {
        return `${import.meta.env.VITE_APP_URL}/api/queries/${apiCode}/results`;
      };

      return axios
        .post(apiUrl(123), {
          queryId: 123,
          parameters: params,
        })
        .then((response) => {
          const responseData = response.data.query_result.data;

          this.dataProdukEtalase = responseData;

          return responseData;
        })
        .catch((error) => {
          console.error(error);
        });

    },

    async getPenyediaProduk(params) {
      const apiUrl = (apiCode) => {
        return `${import.meta.env.VITE_APP_URL}/api/queries/${apiCode}/results`;
      };

      return axios
        .post(apiUrl(178), {
          queryId: 178,
          parameters: params,
        })
        .then((response) => {
          const responseData = response.data.query_result.data;

          this.dataProdukEtalase = responseData;

          return responseData;
        })
        .catch((error) => {
          console.error(error);
        });

    }

  },
  state: () => ({
    dataEPurchasing: [],
    dataProdukEtalase: [],
    dataPenyediaProduk: [],
  }),

})
