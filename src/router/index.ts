import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

// Route components
const LoginPage = () => import('../views/LoginPage.vue')
const DashboardPage = () => import('../views/DashboardPage.vue')
const ApiTestingPage = () => import('../views/ApiTestingPage.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/api-testing',
    name: 'ApiTesting',
    component: ApiTestingPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    // Catch all route - redirect to login or dashboard
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const { isAuthenticated } = useAuth()
      return isAuthenticated.value ? '/' : '/login'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Authentication guard
router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated, currentUser, initializeAuth } = useAuth()
  
  // Initialize auth state if needed
  if (!isAuthenticated.value && localStorage.getItem('auth_token')) {
    await initializeAuth()
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
    return
  }

  // Check guest-only routes (login page when already authenticated)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/')
    return
  }

  // Check admin requirements
  if (to.meta.requiresAdmin) {
    if (!currentUser.value) {
      next('/login')
      return
    }
    
    // For now, assume any authenticated user can access API testing
    // In the future, you might check user roles or permissions
    // Example: if (!currentUser.value.isAdmin) { next('/'); return }
  }

  next()
})

export default router