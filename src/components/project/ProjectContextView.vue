<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Project Header -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-base-content mb-2">{{ project?.name }}</h1>
            <p class="text-base-content/70 mb-4">{{ project?.description || 'No description available' }}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <div class="badge badge-primary">{{ project?.status || 'Active' }}</div>
              <div class="badge badge-secondary">{{ project?.type || 'Project' }}</div>
              <div v-if="project?.createdAt" class="badge badge-outline">
                Created {{ formatDate(project.createdAt) }}
              </div>
            </div>
          </div>
          
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </label>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a @click="openEmailIngestion">📧 Ingest Emails</a></li>
              <li><a @click="editProject">✏️ Edit Project</a></li>
              <li><a @click="goToSettings">⚙️ Settings</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Context Tabs -->
    <div class="tabs tabs-boxed bg-base-200 p-1">
      <a 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab"
        :class="{ 'tab-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="mr-2">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="badge badge-sm ml-2">{{ tab.count }}</span>
      </a>
    </div>

    <!-- Tab Content -->
    <div class="min-h-[400px]">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Project Stats -->
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h3 class="card-title text-lg">📊 Project Statistics</h3>
              <div class="stats stats-vertical">
                <div class="stat">
                  <div class="stat-title">Total Tasks</div>
                  <div class="stat-value text-2xl">{{ projectStats.totalTasks }}</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Completed</div>
                  <div class="stat-value text-2xl text-success">{{ projectStats.completedTasks }}</div>
                </div>
                <div class="stat">
                  <div class="stat-title">In Progress</div>
                  <div class="stat-value text-2xl text-warning">{{ projectStats.inProgressTasks }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h3 class="card-title text-lg">🕒 Recent Activity</h3>
              <div class="space-y-2">
                <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-8">
                      <span class="text-xs">{{ activity.user?.name?.charAt(0) || '?' }}</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm">{{ activity.description }}</p>
                    <p class="text-xs text-base-content/50">{{ formatDate(activity.createdAt) }}</p>
                  </div>
                </div>
                <div v-if="recentActivities.length === 0" class="text-base-content/50 text-sm text-center py-4">
                  No recent activity
                </div>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h3 class="card-title text-lg">👥 Team Members</h3>
              <div class="space-y-2">
                <div v-for="member in projectMembers" :key="member.id" class="flex items-center space-x-3">
                  <div class="avatar placeholder">
                    <div class="bg-primary text-primary-content rounded-full w-8">
                      <span class="text-xs">{{ member.name?.charAt(0) || '?' }}</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ member.name }}</p>
                    <p class="text-xs text-base-content/50">{{ member.role || 'Member' }}</p>
                  </div>
                </div>
                <div v-if="projectMembers.length === 0" class="text-base-content/50 text-sm text-center py-4">
                  No team members
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks Tab -->
      <div v-if="activeTab === 'tasks'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold">Project Tasks</h3>
          <button class="btn btn-primary btn-sm" @click="createTask">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>
        
        <!-- Task Filters -->
        <div class="flex flex-wrap gap-2">
          <select v-model="taskFilter.status" class="select select-sm select-bordered">
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select v-model="taskFilter.assignee" class="select select-sm select-bordered">
            <option value="">All Assignees</option>
            <option v-for="member in projectMembers" :key="member.id" :value="member.id">
              {{ member.name }}
            </option>
          </select>
        </div>

        <!-- Tasks List -->
        <div class="card bg-base-100 shadow">
          <div class="card-body p-0">
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in filteredTasks" :key="task.id">
                    <td>
                      <div>
                        <div class="font-medium">{{ task.name }}</div>
                        <div v-if="task.description" class="text-sm text-base-content/50 truncate max-w-xs">
                          {{ task.description }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="badge" :class="getStatusBadgeClass(task.status)">
                        {{ task.status }}
                      </div>
                    </td>
                    <td>
                      <div v-if="task.assignee" class="flex items-center space-x-2">
                        <div class="avatar placeholder">
                          <div class="bg-neutral text-neutral-content rounded-full w-6">
                            <span class="text-xs">{{ task.assignee.name?.charAt(0) || '?' }}</span>
                          </div>
                        </div>
                        <span class="text-sm">{{ task.assignee.name }}</span>
                      </div>
                      <span v-else class="text-base-content/50 text-sm">Unassigned</span>
                    </td>
                    <td>
                      <span v-if="task.dueDate" class="text-sm">
                        {{ formatDate(task.dueDate) }}
                      </span>
                      <span v-else class="text-base-content/50 text-sm">No due date</span>
                    </td>
                    <td>
                      <div class="badge" :class="getPriorityBadgeClass(task.priority)">
                        {{ task.priority }}
                      </div>
                    </td>
                    <td>
                      <div class="dropdown dropdown-end">
                        <label tabindex="0" class="btn btn-ghost btn-xs">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                          </svg>
                        </label>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                          <li><a @click="editTask(task)">Edit</a></li>
                          <li><a @click="completeTask(task)">Complete</a></li>
                          <li><a @click="deleteTask(task)">Delete</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="filteredTasks.length === 0" class="text-center py-8 text-base-content/50">
                No tasks found
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Files Tab -->
      <div v-if="activeTab === 'files'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold">Project Files</h3>
          <button class="btn btn-primary btn-sm" @click="uploadFile">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload File
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="file in projectFiles" :key="file.id" class="card bg-base-100 shadow">
            <div class="card-body p-4">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg class="w-8 h-8 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ file.name }}</p>
                  <p class="text-xs text-base-content/50">{{ formatFileSize(file.size) }} • {{ formatDate(file.createdAt) }}</p>
                </div>
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </label>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                    <li><a @click="downloadFile(file)">Download</a></li>
                    <li><a @click="deleteFile(file)">Delete</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div v-if="projectFiles.length === 0" class="col-span-full text-center py-8 text-base-content/50">
            No files uploaded yet
          </div>
        </div>
      </div>

      <!-- Activities Tab -->
      <div v-if="activeTab === 'activities'" class="space-y-4">
        <h3 class="text-xl font-semibold">Project Activities</h3>
        
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <div class="space-y-4">
              <div v-for="activity in projectActivities" :key="activity.id" class="flex space-x-4">
                <div class="avatar placeholder flex-shrink-0">
                  <div class="bg-neutral text-neutral-content rounded-full w-10">
                    <span class="text-sm">{{ activity.user?.name?.charAt(0) || '?' }}</span>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="font-medium">{{ activity.user?.name || 'Unknown User' }}</span>
                    <span class="text-sm text-base-content/50">{{ formatDate(activity.createdAt) }}</span>
                  </div>
                  <p class="text-sm text-base-content/70">{{ activity.description }}</p>
                  <div v-if="'metadata' in activity && activity.metadata" class="text-xs text-base-content/50 mt-1">
                    {{ formatActivityMetadata((activity as any).metadata) }}
                  </div>
                </div>
              </div>
              <div v-if="projectActivities.length === 0" class="text-center py-8 text-base-content/50">
                No activities recorded
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-4">
        <h3 class="text-xl font-semibold">Project Settings</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h4 class="card-title">General Settings</h4>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Project Name</span>
                </label>
                <input type="text" v-model="projectSettingsData.name" class="input input-bordered" />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Description</span>
                </label>
                <textarea v-model="projectSettingsData.description" class="textarea textarea-bordered"></textarea>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Status</span>
                </label>
                <select v-model="projectSettingsData.status" class="select select-bordered">
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h4 class="card-title">Team Management</h4>
              <button class="btn btn-primary btn-sm mb-4" @click="inviteTeamMember">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Invite Member
              </button>
              <div class="space-y-2">
                <div v-for="member in projectMembers" :key="member.id" class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="avatar placeholder">
                      <div class="bg-primary text-primary-content rounded-full w-8">
                        <span class="text-xs">{{ member.name?.charAt(0) || '?' }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ member.name }}</p>
                      <p class="text-xs text-base-content/50">{{ member.email }}</p>
                    </div>
                  </div>
                  <button class="btn btn-ghost btn-xs" @click="removeMember(member)">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow border-error">
          <div class="card-body">
            <h4 class="card-title text-error">Danger Zone</h4>
            <p class="text-sm text-base-content/70 mb-4">These actions cannot be undone.</p>
            <div class="space-y-2">
              <button class="btn btn-outline btn-warning btn-sm" @click="archiveProject">Archive Project</button>
              <button class="btn btn-outline btn-error btn-sm" @click="deleteProject">Delete Project</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Email Ingestion Modal -->
  <EmailIngestionModal 
    v-if="showEmailModal"
    :is-open="showEmailModal"
    :project-id="projectId"
    @update:is-open="showEmailModal = $event"
    @close="showEmailModal = false"
    @success="handleEmailIngestionSuccess"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EmailIngestionModal from '@/components/modals/EmailIngestionModal.vue'
import { useFeedback } from '@/composables/useFeedback'

// Props
interface Props {
  projectId: string
}

const props = defineProps<Props>()
const router = useRouter()
const feedback = useFeedback()

// State
const activeTab = ref('overview')
const showEmailModal = ref(false)

// Mock data - replace with real GraphQL queries
const project = ref({
  id: props.projectId,
  name: 'Sample Project',
  description: 'This is a sample project for demonstration purposes',
  status: 'ACTIVE',
  type: 'Development',
  createdAt: new Date().toISOString()
})

const projectStats = ref({
  totalTasks: 15,
  completedTasks: 8,
  inProgressTasks: 4,
  todoTasks: 3
})

const recentActivities = ref([
  {
    id: '1',
    description: 'Task "Implement user authentication" was completed',
    user: { name: 'John Doe' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
  },
  {
    id: '2',
    description: 'New task "Design landing page" was created',
    user: { name: 'Jane Smith' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  }
])

const projectMembers = ref([
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Project Manager' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Developer' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Designer' }
])

const projectTasks = ref([
  {
    id: '1',
    name: 'Implement user authentication',
    description: 'Add login and registration functionality',
    status: 'COMPLETED',
    priority: 'HIGH',
    assignee: { id: '1', name: 'John Doe' },
    dueDate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Design landing page',
    description: 'Create wireframes and mockups for the main landing page',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignee: { id: '3', name: 'Bob Johnson' },
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days from now
  }
])

const projectFiles = ref([
  {
    id: '1',
    name: 'project-requirements.pdf',
    size: 2048576, // 2MB
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 1 week ago
  },
  {
    id: '2',
    name: 'design-mockups.figma',
    size: 5242880, // 5MB
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  }
])

const projectActivities = ref([
  {
    id: '1',
    description: 'Project created',
    user: { name: 'Admin User' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    metadata: { action: 'create' }
  },
  ...recentActivities.value
])

// Task filtering
const taskFilter = ref({
  status: '',
  assignee: ''
})

const filteredTasks = computed(() => {
  let filtered = [...projectTasks.value]
  
  if (taskFilter.value.status) {
    filtered = filtered.filter(task => task.status === taskFilter.value.status)
  }
  
  if (taskFilter.value.assignee) {
    filtered = filtered.filter(task => task.assignee?.id === taskFilter.value.assignee)
  }
  
  return filtered
})

// Project settings
const projectSettingsData = ref({
  name: project.value.name,
  description: project.value.description,
  status: project.value.status
})

// Computed
const tabs = computed(() => [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'tasks', label: 'Tasks', icon: '✅', count: projectStats.value.totalTasks },
  { key: 'files', label: 'Files', icon: '📁', count: projectFiles.value.length },
  { key: 'activities', label: 'Activities', icon: '🕒', count: projectActivities.value.length },
  { key: 'settings', label: 'Settings', icon: '⚙️' }
])

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
}

const formatActivityMetadata = (metadata: any) => {
  if (metadata?.action) {
    return `Action: ${metadata.action}`
  }
  return ''
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'badge-success'
    case 'IN_PROGRESS': return 'badge-warning'
    case 'TODO': return 'badge-info'
    default: return 'badge-ghost'
  }
}

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'HIGH': return 'badge-error'
    case 'MEDIUM': return 'badge-warning'
    case 'LOW': return 'badge-info'
    default: return 'badge-ghost'
  }
}

// Actions
const openEmailIngestion = () => {
  showEmailModal.value = true
}

const editProject = () => {
  feedback.info('Feature Coming Soon', 'Project editing will be available soon')
}

const goToSettings = () => {
  activeTab.value = 'settings'
}

const createTask = () => {
  feedback.info('Feature Coming Soon', 'Task creation will be available soon')
}

const editTask = (task: any) => {
  feedback.info('Feature Coming Soon', `Editing task: ${task.name}`)
}

const completeTask = (task: any) => {
  feedback.success('Task Completed', `"${task.name}" has been marked as completed`)
}

const deleteTask = (task: any) => {
  if (confirm(`Are you sure you want to delete "${task.name}"?`)) {
    feedback.success('Task Deleted', `"${task.name}" has been deleted`)
  }
}

const uploadFile = () => {
  feedback.info('Feature Coming Soon', 'File upload will be available soon')
}

const downloadFile = (file: any) => {
  feedback.info('Download Started', `Downloading ${file.name}`)
}

const deleteFile = (file: any) => {
  if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
    feedback.success('File Deleted', `"${file.name}" has been deleted`)
  }
}

const inviteTeamMember = () => {
  feedback.info('Feature Coming Soon', 'Team member invitation will be available soon')
}

const removeMember = (member: any) => {
  if (confirm(`Are you sure you want to remove ${member.name} from this project?`)) {
    feedback.success('Member Removed', `${member.name} has been removed from the project`)
  }
}

const archiveProject = () => {
  if (confirm('Are you sure you want to archive this project?')) {
    feedback.warning('Project Archived', 'This project has been archived')
  }
}

const deleteProject = () => {
  if (confirm('Are you sure you want to delete this project? This action cannot be undone!')) {
    feedback.error('Project Deleted', 'This project has been permanently deleted')
    router.push('/projects')
  }
}

const handleEmailIngestionSuccess = () => {
  feedback.success('Email Processing', 'Email screenshots have been sent for processing')
  // Refresh project data if needed
}

// Lifecycle
onMounted(() => {
  // Load project data from GraphQL
  // TODO: Replace mock data with real queries
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
