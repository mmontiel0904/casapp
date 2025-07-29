import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://127.0.0.1:8080/schema.graphql',
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
        skipTypename: true
      }
    },
    './src/generated/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config