import type { App } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './apollo'

export function provideApolloClient(app: App) {
  app.provide(DefaultApolloClient, apolloClient)
}