import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { permissionService } from '../services/permissions'
import { useFeedback } from '../composables/useFeedback'

// Route components
const LoginPage = () => import('../views/LoginPage.vue')
const DashboardPage = () => import('../views/DashboardPage.vue')
const RegisterPage = () => import('../views/RegisterPage.vue')
const ForgotPasswordPage = () => import('../views/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('../views/ResetPasswordPage.vue')
const UserManagementPage = () => import('../views/UserManagementPage.vue')
const RolePermissionAdminPage = () => import('../views/RolePermissionAdminPage.vue')
const ProfilePage = () => import('../views/ProfilePage.vue')
const ProjectsPage = () => import('../views/ProjectsPage.vue')
const MyTasksPage = () => import('../views/MyTasksPage.vue')
const UserDebugPage = () => import('../views/UserDebugPage.vue')

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
    meta: { 
      requiresAuth: true,
      requiresPermission: 'project_system:read'
    }
  },
  {
    path: '/my-tasks',
    name: 'MyTasks',
    component: MyTasksPage,
    meta: { 
      requiresAuth: true,
      requiresPermission: 'task_system:read'
    }
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
    path: '/admin/roles',
    name: 'RolePermissionAdmin',
    component: RolePermissionAdminPage,
    meta: { 
      requiresAuth: true,
      requiresPermission: 'system_admin'
    }
  },
  {
    path: '/debug/user',
    name: 'UserDebug',
    component: UserDebugPage,
    meta: { 
      requiresAuth: true
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
        // Use global feedback system to show permission error
        const { error } = useFeedback()
        
        // Get friendly names for permissions
        const permissionNames: Record<string, string> = {
          'task_system:read': 'Task Management',
          'project_system:read': 'Project Management',
          'user_management': 'User Management'
        }
        
        const permissionName = permissionNames[requiredPermission] || requiredPermission
        
        error(
          'Access Denied',
          `You don't have permission to access ${permissionName}. Please contact your administrator.`,
          7000
        )
        
        // Redirect to dashboard without query params
        next('/')
        return
      }
    } catch (error) {
      console.error('Permission check failed:', error)
      
      // Use global feedback system for permission check failures
      const { error: showError } = useFeedback()
      showError(
        'Permission Check Failed',
        'Unable to verify your permissions. Please try again or contact support.',
        7000
      )
      
      // Redirect to dashboard without query params
      next('/')
      return
    }
  }

  next()
})

export default router