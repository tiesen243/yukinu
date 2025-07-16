<template>
  <header
    class="sticky inset-0 flex h-16 items-center border-b bg-background/70 backdrop-blur-xl backdrop-saturate-150"
  >
    <div class="container flex items-center justify-between">
      <RouterLink to="/" class="text-2xl font-bold"> Yukinu </RouterLink>

      <nav
        class="flex items-center gap-4 text-muted-foreground [&_a]:hover:text-foreground"
      >
        <RouterLink to="/about" class="text-sm">About</RouterLink>
        <RouterLink to="/contact" class="text-sm">Contact</RouterLink>
        <RouterLink to="/blog" class="text-sm">Blog</RouterLink>
        <RouterLink to="/projects" class="text-sm">Projects</RouterLink>

        <Button
          variant="ghost"
          size="icon"
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
        >
          <SunIcon v-if="mode === 'light'" />
          <MoonIcon v-else />
        </Button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { MoonIcon, SunIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'

const mode = useColorMode({ disableTransition: true })
</script>
