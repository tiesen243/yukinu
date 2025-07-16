<template>
  <AppHeader />

  <RouterView />
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/app-header.vue'
import Index from '@/routes/_index.vue'
</script>
