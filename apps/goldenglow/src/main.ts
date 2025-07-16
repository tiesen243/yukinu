import '@/globals.css'

import {
  defaultShouldDehydrateQuery,
  VueQueryPlugin,
} from '@tanstack/vue-query'
import SuperJSON from 'superjson'
import { createApp } from 'vue'

import App from '@/App.vue'
import { router } from '@/routes'

const app = createApp(App)
app.use(router)

app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  },
})

app.mount('#app')
