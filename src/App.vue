<script setup>
import { ref } from "vue";
import routes from "./router/routes";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "./store/useAuthStore";
import { VMenu } from "vuetify/components";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const mobileMenuOpen = ref(true);
const isDialogOpen = ref(false);
const isAgreeTerm = ref(false);

const setMobileMenuOpen = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleLogin = () => {
  let username = "admin";
  authStore.login(username);

  // close dialog
  isDialogOpen.value = false;

  // re init navigation
  navigation.value = routes.filter((route) => {
    if (route.auth) {
      return authStore.isLoggedIn;
    }
    return true;
  });

  // redirect to home
  router.push("/");
};

const handleLogout = () => {
  authStore.logout();

  // re init navigation
  navigation.value = routes.filter((route) => {
    if (route.auth) {
      return authStore.isLoggedIn;
    }
    return true;
  });

  // redirect to home
  router.push("/");
};

// get where navigation auth is based on authS
const navigation = ref(
  routes.filter((route) => {
    if (route.auth) {
      return authStore.isLoggedIn;
    }
    return true;
  })
);
</script>

<template>
  <VApp>
    <!-- space between -->
    <div class="flex items-center shadow-xl h-14 justify-between">
      <div>
        <VAppBarNavIcon @click="setMobileMenuOpen" class="font-bold">
          <Bars3Icon class="h-6 w-6" />
        </VAppBarNavIcon>
      </div>

      <div class="flex items-center mx-5">
        <div v-if="authStore.isLoggedIn" class="mx-2">
          <!-- dropdown -->
          <VMenu offset-y>
            <template v-slot:activator="{ props }">
              <VBtn color="primary" v-bind="props">
                {{ authStore.username }}
              </VBtn>
            </template>
            <VList>
              <VListItem @click="handleLogout">
                <VListItemTitle>Logout</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>
        <VBtn
          v-if="!authStore.isLoggedIn"
          @click="isDialogOpen = true"
          class="mx-2"
          color="primary"
          outlined
        >
          Login
        </VBtn>
      </div>
    </div>
    <div class="shadow-xl">
      <VNavigationDrawer
        v-model="mobileMenuOpen"
        class="shadow-lg"
        width="250"
        floating
      >
        <div class="h-full bg-gradient-to-b from-green-500 to-blue-400">
          <div class="flex flex-row items-center h-14 gap-2 px-2">
            <!-- image -->
            <img
              src="@/assets/logo.png"
              alt="logo"
              class="h-10 w-10 rotate-[10deg]"
            />
            <!-- app name -->
            <span class="text-white font-bold">
              {{ $appConfig.name }}
            </span>
          </div>

          <VList>
            <VListItem
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              class="px-4 my-2"
            >
              <div class="flex flex-row items-center text-white text-lg gap-2">
                <span :class="'mdi ' + item.icon" />
                <span class="font-bold">{{ item.name }}</span>
              </div>
            </VListItem>
          </VList>
        </div>
      </VNavigationDrawer>
    </div>

    <VDialog v-model="isDialogOpen" max-width="400">
      <VCard>
        <VCardTitle>Login</VCardTitle>
        <VCardText>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
            nobis, commodi velit totam, accusantium veniam distinctio culpa
            optio sapiente ullam, non eum maxime esse dolore harum nemo at est
            unde?
          </p>
        </VCardText>
        <VCardActions>
          <!-- setuju dan tidak -->
          <VBtn @click="handleLogin" color="primary" class="mr-2" outlined>
            Setuju
          </VBtn>
          <VBtn @click="isDialogOpen = false" color="red" outlined>
            Cancel
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>
