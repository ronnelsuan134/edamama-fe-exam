<script setup lang="ts">
import { useProductStore } from '~~/store/product';
const productStore = useProductStore()
</script>

<template>
  <div class="relative">
    <header class="sticky top-0 z-50 flex items-center justify-between p-4 space-x-1 border-b shadow-md bg-ghostWhite">
      <div class="flex justify-between w-full">
        <nuxt-link to="/">
          <img src="assets/images/web-logo.png" alt="" class="object-contain h-14">
        </nuxt-link>
      </div>
    </header>
  </div>
</template>