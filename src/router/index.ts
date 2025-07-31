import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

// Route components
const LoginPage = () => import('../views/LoginPage.vue')
const DashboardPage = () => import('../views/DashboardPage.vue')
const RegisterPage = () => import('../views/RegisterPage.vue')
const ForgotPasswordPage = () => import('../views/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('../views/ResetPasswordPage.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/invite',
    name: 'AcceptInvitation',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
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
router.beforeEach((to, _from, next) => {
  const { isAuthenticated, initializeAuth } = useAuth()
  
  // Initialize auth state from localStorage
  initializeAuth()

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

  next()
})

export default router