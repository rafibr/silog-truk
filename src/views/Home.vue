<script setup>
</script>

<template>
  <!-- background from image -->
  <div
    class="flex flex-col xl:flex-row lg:items-center h-full items-center p-8 bg-[url('@/assets/background.jpg')] bg-center bg-no-repeat bg-cover md:justify-center"
  >
    <div
      class="lg:order-1 overflow-ellipsis backdrop-blur-sm bg-white/20 rounded-lg p-8 shadow-lg"
    >
      <h1
        class="text-4xl font-bold text-gray-900 lg:text-left text-center drop-shadow-lg"
      >
        <span>Selamat datang di Silog-Truk</span>
      </h1>
      <p class="mt-4 text-lg text-gray-700 lg:text-left text-center">
        Sistem informasi katalog lokal konstruksi.
      </p>
    </div>
    <div class="lg:order-2 lg:pl-8">
      <img src="@/assets/logo512.png" alt="Silog-Truk" class="w-64 h-64" />
    </div>
  </div>
</template>
