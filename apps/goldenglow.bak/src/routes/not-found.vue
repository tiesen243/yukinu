<template>
  <main
    class="container flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4"
  >
    <div class="flex items-center gap-4">
      <Typography variant="h2" class="mb-0">404</Typography>
      <div class="h-16 w-0.5 bg-secondary lg:h-20" />
      <Typography variant="h3" class="mb-0">Page Not Found</Typography>
    </div>

    <Button as="RouterLink" to="/">Take me home</Button>
  </main>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
</script>
