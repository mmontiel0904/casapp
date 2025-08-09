import type { CodegenConfig } from '@graphql-codegen/cli'
import { loadEnv } from 'vite'

// Load environment variables
const env = loadEnv('', process.cwd(), '')
const apiBaseUrl = env.VITE_API_BASE_URL || 'https://freshapi-development.up.railway.app'
const schemaEndpoint = env.VITE_SCHEMA_SDL_ENDPOINT || '/schema.graphql'

const config: CodegenConfig = {
  schema: `${apiBaseUrl}${schemaEndpoint}`,
  documents: ['src/**/*.vue', 'src/**/*.ts'],
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-vue-apollo'
      ],
      config: {
        withCompositionFunctions: true,
        vueCompositionApiImportFrom: 'vue',
        skipTypename: true,
      }
    },
    './src/generated/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config