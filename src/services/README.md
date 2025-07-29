# API Services Architecture

## Overview
Scalable, type-safe API service layer with comprehensive error handling and reactive state management.

## Key Files

### Core Services
- `api.ts` - Base API service classes with error handling
- `../composables/useAuth.ts` - Authentication composable
- `../composables/useApiState.ts` - Reactive API state management

### Error Handling
- `../types/feedback.ts` - Feedback system for UI components
- `../lib/apollo.ts` - Enhanced Apollo Client with error links

## Usage Examples

### Basic API Call
```typescript
import { authService } from './services/api'

const result = await authService.login(email, password)
if (result.isSuccess) {
  console.log('User:', result.data?.user)
} else {
  console.error('Error:', result.error?.message)
}
```

### Using with Composables
```typescript
import { useAuth } from './composables/useAuth'

const { login, isLoggingIn, loginError } = useAuth()

const handleLogin = async () => {
  const result = await login(email, password)
  // Error handling and loading states are automatic
}
```

### Custom API Operations
```typescript
import { useApiOperation } from './composables/useApiState'

const { execute, loading, error, data } = useApiOperation<MyType>()

const fetchData = () => execute(() => myService.getData())
```

## Architecture Benefits

1. **Type Safety** - Full TypeScript support with generated GraphQL types
2. **Centralized Error Handling** - Consistent error format across the app
3. **Reactive State** - Vue composables for loading/error states
4. **Scalable** - Easy to extend with new services and operations
5. **Maintainable** - Clear separation of concerns
6. **Cache Management** - Built-in Apollo cache policies
7. **Future-Ready** - Prepared for feedback UI components

## Error Types
- `NETWORK_ERROR` - Connection issues
- `GRAPHQL_ERROR` - Server-side errors
- `VALIDATION_ERROR` - Input validation
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Permission denied

## Best Practices
1. Always use `ApiResult<T>` wrapper for consistency
2. Handle errors at the UI level using feedback system
3. Use composables for reactive state management
4. Extend `BaseApiService` for new service classes
5. Keep GraphQL operations in separate files for code generation