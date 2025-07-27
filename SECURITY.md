# Security Guidelines

## Environment Variables

### ⚠️ CRITICAL SECURITY NOTES

#### Client-Side Exposure
All environment variables prefixed with `VITE_` are **exposed to the browser** and **publicly accessible**. Never include:

- ❌ API keys or secrets
- ❌ Database credentials  
- ❌ Authentication tokens
- ❌ Private keys
- ❌ Internal URLs or sensitive endpoints

#### Safe Variables Only
Only include **public configuration** in `VITE_` variables:

- ✅ Public API endpoints
- ✅ Public GraphQL endpoints  
- ✅ Environment identifiers
- ✅ Feature flags
- ✅ Public CDN URLs

### Current Environment Variables

Our current setup is **secure** because:

```bash
VITE_API_BASE_URL=https://freshapi-development.up.railway.app  # ✅ Public API
VITE_GRAPHQL_ENDPOINT=/graphql                                 # ✅ Public endpoint
VITE_SCHEMA_SDL_ENDPOINT=/schema.graphql                      # ✅ Public schema (dev only)
VITE_SCHEMA_JSON_ENDPOINT=/schema.json                        # ✅ Public introspection (dev only)
VITE_PLAYGROUND_ENDPOINT=/playground                          # ✅ Public playground (dev only)
```

### Authentication Handling

For authentication, this app:
- ✅ Receives JWT tokens from GraphQL responses
- ✅ Stores tokens in memory or secure storage (not env vars)
- ✅ Sends tokens in Authorization headers
- ✅ Never exposes secrets in environment variables

### File Security

#### Protected Files (in .gitignore)
- `.env.local` - Local development configuration
- `.env` - Never commit any .env files
- `*.key`, `*.pem` - Certificate files
- `secrets.json` - Any secret files

#### Safe to Commit
- `.env.example` - Template with placeholder values
- All source code files
- Configuration files without secrets

### Railway Deployment

When deploying to Railway:

1. **Set environment variables** in Railway dashboard (not in code)
2. **Never commit** `.env.local` or `.env` files
3. **Use Railway's environment management** for sensitive values
4. **Keep development and production configs separate**

### Best Practices

1. **Regular Review**: Audit environment variables regularly
2. **Principle of Least Privilege**: Only expose what's absolutely necessary
3. **Environment Separation**: Different configs for dev/staging/production
4. **Secret Rotation**: Change API endpoints/URLs if compromised
5. **Documentation**: Keep security docs updated

### Emergency Response

If secrets are accidentally committed:

1. **Immediately rotate** all exposed credentials
2. **Force push** to remove from git history
3. **Update environment variables** in all environments
4. **Review access logs** for potential compromise
5. **Update team** about the incident

---

**Remember: If it's in a `VITE_` variable, it's public! 🔓**