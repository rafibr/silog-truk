<script setup>
import { ref } from 'vue';
import {
  VApp, VAppBar, VAppBarNavIcon, VAppBarTitle, VItem, VItemGroup, VList, VListGroup, VListItem, VListItemTitle, VMain, VNavigationDrawer
} from 'vuetify/components';
import routes from './router/routes';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';
import { RouterLink, RouterView } from 'vue-router';


const mobileMenuOpen = ref(false);

const setMobileMenuOpen = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const navigation = routes.map(route => ({
  name: route.name,
  path: route.path,
}));

</script>

<template>
  <VApp class="">
    <div class="flex items-center justify-between bg-gray-800 p-4 shadow-md">
      <VAppBarTitle>
        <RouterLink to="/">
          <span class="flex items-center space-x-2 text-white">
            <img src="@/assets/logo192.png" alt="Silog-Truk" class="h-10 w-auto" />
            <span class="font-bold">Silog-Truk</span>
          </span>
        </RouterLink>
      </VAppBarTitle>

      <div class="hidden sm:flex space-x-4">
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <RouterLink v-for="item in navigation" :key="item.name" :to="item.path"
              :class="[item.current ?
                'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md', 'rounded-md px-3 py-2 text-sm font-medium']"
              :aria-current="item.current ? 'page' : undefined">
              {{
                item.name }}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="sm:hidden">
        <VAppBarNavIcon @click="setMobileMenuOpen">
          <Bars3Icon class="h-6 w-6 text-white" aria-hidden="true" v-if="!mobileMenuOpen" />
        </VAppBarNavIcon>
      </div>
    </div>

    <VNavigationDrawer v-model="mobileMenuOpen" app temporary location="end" width="140">
      <!-- XMarkIcon -->
      <VAppBarNavIcon @click="setMobileMenuOpen">
        <XMarkIcon class="h-6 w-6 " aria-hidden="true" v-if="mobileMenuOpen" />
      </VAppBarNavIcon>
      <VList>
        <VListItem v-for="item in navigation" :key="item.name" :to="item.path" class="px-4 py-2">
          <VListItemTitle>{{ item.name }}</VListItemTitle>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain class="p-4 bg-gradient-to-br from-gray-200 via-stone-200 to-zinc-400 ">
      <RouterView />
    </VMain>
  </VApp>
</template>
