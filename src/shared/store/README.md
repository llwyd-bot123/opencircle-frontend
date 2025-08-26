# Store

This directory contains global state management using Zustand.

## Available Stores

### Auth Store

Manages authentication state including user data and authentication status.

```typescript
// Import the auth store
import { useAuthStore } from '@/shared/store';

// Access the auth state
const { user, isAuthenticated } = useAuthStore();

// Login a user
const { login } = useAuthStore();
login(apiResponseData); // Pass the API response data

// Logout a user
const { logout } = useAuthStore();
logout();
```

The auth store persists data in localStorage, so the authentication state will be preserved across page refreshes.