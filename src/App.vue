<script setup>
import { ref } from "vue";
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VItem,
  VItemGroup,
  VList,
  VListGroup,
  VListItem,
  VListItemTitle,
  VMain,
  VNavigationDrawer,
} from "vuetify/components";
import routes from "./router/routes";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { RouterLink, RouterView } from "vue-router";

const mobileMenuOpen = ref(false);

const setMobileMenuOpen = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const navigation = routes.map((route) => ({
  name: route.name,
  path: route.path,
}));
</script>

<template>
  <VApp>
    <div class="flex items-center p-4 shadow-xl justify-between bg-blue-500">
      <VAppBarTitle>
        <RouterLink to="/" width="100">
          <span class="flex items-center space-x-2 text-white">
            <img
              src="@/assets/logo192.png"
              alt="Silog-Truk"
              class="h-10 w-auto"
            />
            <span class="font-bold">Silog-Truk</span>
          </span>
        </RouterLink>
      </VAppBarTitle>

      <div class="hidden sm:block space-x-4">
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              :class="[
                item.current
                  ? 'text-gray-900 bg-blue-200'
                  : 'text-white hover:bg-blue-800 hover:text-white ',
                'rounded-md px-4 py-2 text-sm font-medium-500',
              ]"
              :aria-current="item.current ? 'page' : undefined"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="sm:hidden">
        <VAppBarNavIcon @click="setMobileMenuOpen">
          <Bars3Icon
            class="h-6 w-6 text-white"
            aria-hidden="true"
            v-if="!mobileMenuOpen"
          />
        </VAppBarNavIcon>
      </div>
    </div>

    <VNavigationDrawer
      v-model="mobileMenuOpen"
      app
      temporary
      location="end"
      width="140"
    >
      <!-- XMarkIcon -->
      <VAppBarNavIcon @click="setMobileMenuOpen">
        <XMarkIcon class="h-6 w-6" aria-hidden="true" v-if="mobileMenuOpen" />
      </VAppBarNavIcon>
      <VList>
        <VListItem
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          class="px-4 py-2"
        >
          <span class="font-bold text-md">{{ item.name }}</span>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain>
      <div>
        <RouterView />
      </div>
    </VMain>
  </VApp>
</template>
