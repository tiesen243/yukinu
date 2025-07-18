<template>
  <main class="container py-4">
    <template v-if="isLoading">
      <p>Loading...</p>
    </template>

    <div
      v-else-if="data"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <RouterLink
        v-for="product in data.products"
        :key="product.id"
        :to="`/${product.id}`"
        class="flex flex-col gap-4 rounded-xl border bg-card pb-6 text-card-foreground shadow-sm"
      >
        <img :src="product.image" class="rounded-t-xl" />
        <div
          class="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
        >
          <p class="leading-none font-semibold">{{ product.name }}</p>
          <p class="text-sm font-medium">${{ product.price }}</p>
          <p class="truncate text-sm text-muted-foreground">
            {{ product.description }}
          </p>
        </div>
      </RouterLink>
    </div>

    <p v-else class="text-center text-muted-foreground">No products found.</p>
  </main>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

import { productOptions } from '@/api/product'

const { data, isLoading } = useQuery(productOptions.all({ limit: 12 }))
</script>
