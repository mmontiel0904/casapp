import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://freshapi-development.up.railway.app/schema.graphql',
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
        vueCompositionApiImportFrom: '@vue/apollo-composable',
        skipTypename: true
      }
    },
    './src/generated/schema.graphql': {
      plugins: ['schema-ast']
    }
  }
}

export default config