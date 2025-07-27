# CasApp - Vue GraphQL SPA

A Vue 3 Single Page Application with automated GraphQL client generation and type safety.

## 🚀 Features

- **Vue 3** with TypeScript and Composition API
- **Apollo GraphQL Client** with automatic type generation
- **Zero-maintenance GraphQL integration** - types auto-generated from remote schema
- **Railway-ready deployment** configuration
- **Full type safety** for all GraphQL operations

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **GraphQL**: Apollo Client + Vue Apollo Composable
- **Code Generation**: GraphQL Code Generator
- **Styling**: Scoped Vue components + CSS
- **Package Manager**: Yarn (node-modules)

## 📋 Prerequisites

- Node.js 18+ 
- Yarn package manager
- Access to GraphQL API at `https://freshapi-development.up.railway.app`

## 🚀 Quick Start

1. **Clone and install dependencies**
   ```bash
   yarn install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API configuration
   ```

3. **Generate GraphQL types**
   ```bash
   yarn generate-types
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

5. **Visit** http://localhost:5173

## 📜 Available Scripts

### Development
- `yarn dev` - Start development server
- `yarn dev:full` - Update schema + start dev server  

### GraphQL Code Generation
- `yarn generate-types` - Generate types from remote schema
- `yarn codegen` - Run GraphQL code generation
- `yarn codegen:watch` - Watch mode for continuous generation
- `yarn update-schema` - Check for schema changes and regenerate

### Build & Deploy
- `yarn build` - Production build for deployment
- `yarn preview` - Preview production build locally

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```bash
VITE_API_BASE_URL=https://freshapi-development.up.railway.app
VITE_GRAPHQL_ENDPOINT=/graphql
VITE_SCHEMA_SDL_ENDPOINT=/schema.graphql
VITE_SCHEMA_JSON_ENDPOINT=/schema.json
VITE_PLAYGROUND_ENDPOINT=/playground
```

### GraphQL Code Generation

The project automatically generates TypeScript types and Vue composables from your GraphQL schema. Configuration is in `codegen.ts`.

**Generated files:**
- `src/generated/graphql.ts` - Types + Vue composables
- `src/generated/schema.graphql` - Local schema copy

## 🏗️ Project Structure

```
src/
├── components/           # Vue components
│   ├── HelloWorld.vue   # Welcome component  
│   └── LoginForm.vue    # Login form with GraphQL
├── generated/           # Auto-generated GraphQL files
│   ├── graphql.ts      # Types + composables
│   └── schema.graphql  # Schema copy
├── graphql/            # GraphQL operations
│   └── mutations.ts    # Mutation definitions
├── lib/                # Core libraries
│   ├── apollo.ts       # Apollo Client setup
│   └── apollo-provider.ts # Vue provider
├── App.vue             # Main app component
└── main.ts             # Application entry point
```

## 📡 GraphQL API Integration

### Available Operations

The API provides these operations:

**Mutations:**
- `login(input: LoginInput!)` - User authentication
- `register(input: RegisterInput!)` - User registration
- `verifyEmail(token: String!)` - Email verification

**Queries:**
- `me` - Get current user profile  
- `health` - API health check

### API Endpoints

- **GraphQL**: `/graphql`
- **Schema SDL**: `/schema.graphql` (development)
- **Introspection**: `/schema.json` (development)  
- **Playground**: `/playground` (development)

## 🔄 Development Workflow

### Adding New GraphQL Operations

1. **Define operations** in `src/graphql/` files:
   ```typescript
   import { gql } from 'graphql-tag'
   
   export const MY_QUERY = gql`
     query MyQuery {
       me {
         id
         email
       }
     }
   `
   ```

2. **Generate types**:
   ```bash
   yarn generate-types
   ```

3. **Use in components**:
   ```vue
   <script setup lang="ts">
   import { useMyQueryQuery } from '../generated/graphql'
   
   const { result, loading, error } = useMyQueryQuery()
   </script>
   ```

### Schema Updates

When the API schema changes:

```bash
yarn update-schema  # Checks for changes and regenerates if needed
```

## 🚀 Deployment

### Railway Deployment

1. **Build the project**:
   ```bash
   yarn build
   ```

2. **Deploy the `dist/` folder** to Railway

3. **Set environment variables** in Railway dashboard matching your `.env.local`

### Build Output

- `dist/index.html` - Entry point
- `dist/assets/` - Optimized JS/CSS bundles
- **Bundle size**: ~252KB JS (80KB gzipped)

## 🔧 Troubleshooting

### VS Code TypeScript Errors

If you see module resolution errors:

1. **Ensure node-modules** (not Yarn PnP):
   ```yaml
   # .yarnrc.yml should contain:
   nodeLinker: node-modules
   ```

2. **Restart TypeScript server** in VS Code:
   `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

### Apollo Client React Warnings

The React dependencies are intentionally installed as devDependencies to satisfy Apollo Client's peer dependencies. They won't be included in your production bundle.

## 📚 Documentation

- [Vue 3 Documentation](https://vuejs.org/)
- [Apollo Client Vue](https://apollo.vuejs.org/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Run `yarn generate-types` if you modified GraphQL operations
5. Test with `yarn build`
6. Submit a pull request

---

**Built with ❤️ using Vue 3, Apollo GraphQL, and automated type generation**
