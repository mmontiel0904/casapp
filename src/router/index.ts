import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { permissionService } from '../services/permissions'

// Route components
const LoginPage = () => import('../views/LoginPage.vue')
const DashboardPage = () => import('../views/DashboardPage.vue')
const RegisterPage = () => import('../views/RegisterPage.vue')
const ForgotPasswordPage = () => import('../views/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('../views/ResetPasswordPage.vue')
const UserManagementPage = () => import('../views/UserManagementPage.vue')
const ProfilePage = () => import('../views/ProfilePage.vue')
const ProjectsPage = () => import('../views/ProjectsPage.vue')

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
    path: '/accept-invitation',
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
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagementPage,
    meta: { 
      requiresAuth: true,
      requiresPermission: 'user_management'
    }
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

// Authentication and permission guard
router.beforeEach(async (to, _from, next) => {
  const { isAuthenticated, initializeAuth } = useAuth()
  
  // Initialize auth state with async user data restoration
  const authRestored = await initializeAuth()
  
  console.log('🛡️ Router guard - Auth check:', {
    route: to.path,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest,
    isAuthenticated: isAuthenticated.value,
    authRestored
  })

  // Check authentication requirements
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    console.log('🚫 Protected route accessed without authentication, redirecting to login')
    next('/login')
    return
  }

  // Check guest-only routes (login page when already authenticated)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/')
    return
  }

  // Check permission requirements for authenticated routes
  if (isAuthenticated.value && to.meta.requiresPermission) {
    const requiredPermission = to.meta.requiresPermission as string
    
    try {
      // Use async permission check - this properly handles permission loading
      const hasPermission = await permissionService.hasPermission(requiredPermission)
      
      if (!hasPermission) {
        // Redirect to dashboard with permission error
        next({ 
          path: '/', 
          query: { error: 'insufficient_permissions', required: requiredPermission }
        })
        return
      }
    } catch (error) {
      console.error('Permission check failed:', error)
      // On permission check failure, redirect to dashboard
      next({ 
        path: '/', 
        query: { error: 'permission_check_failed' }
      })
      return
    }
  }

  next()
})

export default router