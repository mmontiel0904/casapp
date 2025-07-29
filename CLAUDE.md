# CasApp - Vue GraphQL Project Memory

## Project Overview
- **Type**: Vue 3 SPA (Single Page Application)
- **Purpose**: Frontend client for GraphQL API deployed on Railway
- **API**: `https://freshapi-development.up.railway.app`
- **Target Platform**: Railway deployment

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite
- **UI Framework**: DaisyUI v5.0.49 + Tailwind CSS v4.1.11 with professional themes
- **GraphQL Client**: Apollo Client with Vue Apollo Composable
- **Type Generation**: GraphQL Code Generator
- **Package Manager**: Yarn with node-modules (not PnP)
- **Styling**: DaisyUI utility-first components + Tailwind CSS

## Key Dependencies
### Production
- `vue@^3.5.17` - Vue 3 framework
- `tailwindcss@^4.1.11` - Utility-first CSS framework
- `@tailwindcss/vite@^4.1.11` - Vite integration for Tailwind CSS
- `@apollo/client@^3.13.8` - GraphQL client
- `@vue/apollo-composable@^4.2.2` - Vue integration for Apollo
- `graphql@^16.11.0` - GraphQL implementation
- `graphql-tag@^2.12.6` - GraphQL query parsing

### Development
- `daisyui@^5.0.49` - Professional component library for Tailwind CSS
- `@graphql-codegen/cli@^5.0.7` - Code generation CLI
- `@graphql-codegen/typescript@^4.1.6` - TypeScript types generation
- `@graphql-codegen/typescript-operations@^4.6.1` - Operation types
- `@graphql-codegen/typescript-vue-apollo@^4.1.2` - Vue composables
- `@vue/compiler-sfc@^3.5.18` - Vue SFC compilation
- `react@^19.1.0` & `react-dom@^19.1.0` - DevDep only (Apollo peer dependency)

## Project Structure
```
src/
├── components/
│   ├── HelloWorld.vue          # Welcome component
│   └── LoginForm.vue           # GraphQL login form with styling
├── composables/                # Vue 3 composables
│   ├── useApiState.ts         # Reactive API state management
│   └── useAuth.ts             # Authentication composable
├── generated/                  # Auto-generated GraphQL files
│   ├── graphql.ts             # Types + Vue composables
│   └── schema.graphql         # Local schema copy
├── graphql/
│   └── mutations.ts           # GraphQL operations
├── lib/
│   ├── apollo.ts              # Enhanced Apollo Client with error handling
│   └── apollo-provider.ts     # Vue provider integration
├── services/                   # API service layer
│   ├── api.ts                 # Base API services with type safety
│   └── README.md              # Service architecture documentation
├── types/
│   └── feedback.ts            # Feedback system types for UI components
├── App.vue                    # Main app component
└── main.ts                    # App entry point
```

## Configuration Files
- `.env.local` - Local environment variables
- `.env.example` - Environment template
- `.yarnrc.yml` - Yarn configuration (node-modules instead of PnP)
- `codegen.ts` - GraphQL code generation config
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS and DaisyUI configuration

## Environment Variables
```bash
VITE_API_BASE_URL=https://freshapi-development.up.railway.app
VITE_GRAPHQL_ENDPOINT=/graphql
VITE_SCHEMA_SDL_ENDPOINT=/schema.graphql
VITE_SCHEMA_JSON_ENDPOINT=/schema.json
VITE_PLAYGROUND_ENDPOINT=/playground
```

## Available Scripts
- `yarn dev` - Start development server
- `yarn build` - Production build
- `yarn preview` - Preview production build
- `yarn generate-types` - Generate GraphQL types from remote schema
- `yarn codegen` - Run code generation
- `yarn codegen:watch` - Watch mode for code generation
- `yarn update-schema` - Check for schema changes and regenerate
- `yarn dev:full` - Update schema + start dev server

## GraphQL API Integration
### Schema Source
- **Development**: `https://freshapi-development.up.railway.app/schema.graphql`
- **Introspection**: `https://freshapi-development.up.railway.app/schema.json`
- **Playground**: `https://freshapi-development.up.railway.app/playground`

### Available Operations
- `login(input: LoginInput!)` - User authentication
- `register(input: RegisterInput!)` - User registration  
- `verifyEmail(token: String!)` - Email verification
- `me` - Get current user profile
- `health` - API health check

### Auto-Generation Workflow
1. GraphQL operations defined in `src/graphql/` or components
2. Code generator reads remote schema + local operations
3. Generates TypeScript types + Vue composables in `src/generated/`
4. Components import and use type-safe composables

## Important Setup Notes

### Yarn Configuration
- **Issue**: Default Yarn PnP doesn't work well with VS Code TypeScript language server
- **Solution**: Added `.yarnrc.yml` with `nodeLinker: node-modules`
- **Result**: Proper module resolution in VS Code

### Apollo Client React Dependency
- **Issue**: Apollo Client has `rehackt` dependency that expects React
- **Solution**: Added React as devDependency (not bundled in production)
- **Result**: No console errors, pure Vue app in production

### CORS and Authentication Setup
- **Issue**: CORS preflight failures with `credentials: 'include'`
- **Solution**: Changed to `credentials: 'omit'` and use Bearer token authentication
- **Result**: Proper authentication flow with local and remote APIs

### GraphQL Schema Compatibility
- **Issue**: Generated types expecting `token` field, backend returns `accessToken`/`refreshToken`
- **Solution**: Updated mutations and composables to match actual backend schema
- **Result**: Type-safe authentication with proper token handling

### UI Component Strategy
- **DaisyUI**: Utility-first component library built on Tailwind CSS
- **Professional Themes**: "corporate" (light blue) and "business" (dark) themes
- **Available Components**: Cards, buttons, forms, alerts, tables with utility classes
- **Design System**: Consistent spacing, colors, and typography via Tailwind tokens
- **Theme System**: Automatic dark/light mode support with CSS custom properties
- **Accessibility**: WCAG-compliant color combinations and focus states built-in

## API Service Architecture (NEW)
- **Scalable Service Layer**: Type-safe API services with centralized error handling
- **Reactive State Management**: Vue composables for loading/error states
- **Enhanced Apollo Client**: Error links, auth headers, optimized caching
- **Future-Ready Feedback**: Prepared types for UI notification components

### Service Usage
```typescript
// Using API services directly
import { authService } from '@/services/api'
const result = await authService.login(email, password)

// Using reactive composables
import { useAuth } from '@/composables/useAuth'
const { login, isLoggingIn, loginError } = useAuth()
await login(email, password)
```

### UI Component Usage
```vue
<template>
  <!-- DaisyUI Components -->
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Login</h2>
      <div class="form-control">
        <input type="email" class="input input-bordered input-primary" />
      </div>
      <button class="btn btn-primary">Submit</button>
    </div>
  </div>
</template>
```

## Development Workflow
1. **Schema Updates**: Run `yarn update-schema` to sync with API changes
2. **New Operations**: Add GraphQL operations to `src/graphql/` files
3. **Type Generation**: Run `yarn generate-types` after adding operations
4. **Component Development**: Use generated composables or service layer with full type safety
5. **Build & Deploy**: `yarn build` creates optimized bundle for Railway

## VS Code Setup
- TypeScript language server works correctly with node-modules
- All dependencies properly resolved
- No additional VS Code extensions required for GraphQL

## Deployment Ready
- Production build tested and working
- Environment variables configured for Railway
- Bundle optimized: ~252KB JS (80KB gzipped)
- No React code in final bundle despite devDependency