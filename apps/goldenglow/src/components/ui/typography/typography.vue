<script setup lang="ts">
import { cn } from '@yuki/ui'
import { typographyVariants } from '@yuki/ui/typography'

interface Props {
  variant?: NonNullable<Parameters<typeof typographyVariants>[0]>['variant']
  component?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'p',
  component: 'p',
})
</script>

<template>
  <component
    :is="component"
    :class="cn(typographyVariants({ variant }), $attrs.class ?? '')"
  >
    <slot />
  </component>
</template>
