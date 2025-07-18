<template>
  <main class="container py-4">
    <template v-if="isLoading">
      <div class="flex min-h-[400px] items-center justify-center">
        <p class="text-lg">Loading...</p>
      </div>
    </template>

    <div v-else-if="data" class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div class="space-y-4">
        <img
          :src="data.image"
          :alt="data.name"
          class="h-96 w-full rounded-lg object-cover shadow-lg"
        />
      </div>

      <div class="space-y-6">
        <div>
          <span
            class="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
          >
            {{ data.category }}
          </span>
          <h1 class="text-3xl font-bold">{{ data.name }}</h1>
        </div>

        <p class="leading-relaxed text-muted-foreground">
          {{ data.description }}
        </p>

        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span
              v-if="data.discount > 0"
              class="text-2xl font-bold text-success"
            >
              ${{ discountedPrice.toFixed(2) }}
            </span>
            <span
              :class="
                data.discount > 0
                  ? 'text-lg text-muted-foreground line-through'
                  : 'text-2xl font-bold text-foreground'
              "
            >
              ${{ data.price.toFixed(2) }}
            </span>
            <span
              v-if="data.discount > 0"
              class="rounded bg-error/20 px-2 py-1 text-sm text-error"
            >
              {{ data.discount }}% OFF
            </span>
          </div>
          <p v-if="data.discount > 0" class="text-sm text-success">
            You save ${{ savings.toFixed(2) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <div :class="stockStatusClass" class="h-3 w-3 rounded-full"></div>
          <span :class="stockTextClass" class="font-medium">
            {{ stockStatus }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="flex min-h-[400px] items-center justify-center">
      <p class="text-lg text-muted-foreground">Product not found</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { productOptions } from '@/api/product'

const route = useRoute()
const { id } = route.params

const { data, isLoading } = useQuery(productOptions.byId({ id: String(id) }))

const discountedPrice = computed(() => {
  if (!data.value) return 0
  return data.value.price * (1 - data.value.discount / 100)
})

const savings = computed(() => {
  if (!data.value) return 0
  return data.value.price * (data.value.discount / 100)
})

const stockStatus = computed(() => {
  if (!data.value) return ''
  if (data.value.stock === 0) return 'Out of Stock'
  if (data.value.stock <= 5) return `Only ${data.value.stock} left in stock`
  return 'In Stock'
})

const stockStatusClass = computed(() => {
  if (!data.value) return ''
  if (data.value.stock === 0) return 'bg-error'
  if (data.value.stock <= 5) return 'bg-warning'
  return 'bg-success'
})

const stockTextClass = computed(() => {
  if (!data.value) return ''
  if (data.value.stock === 0) return 'text-error'
  if (data.value.stock <= 5) return 'text-warning'
  return 'text-success'
})
</script>
