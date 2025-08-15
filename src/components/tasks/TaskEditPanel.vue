<template>
  <!-- Task Edit Side Panel -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 overflow-hidden"
    @click.self="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-base-content/20 backdrop-blur-sm transition-opacity"></div>
    
    <!-- Side Panel -->
    <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-base-100 shadow-2xl transform transition-transform ease-in-out duration-300 flex flex-col">
      <!-- Panel Header with Editable Task Name -->
      <div class="flex items-center justify-between p-6 bg-base-100">
        <div class="flex-1 mr-4">
          <input 
            v-model="form.name"
            type="text"
            class="input input-ghost text-xl font-semibold text-base-content w-full focus:input-bordered focus:bg-base-50 hover:bg-base-100/50 placeholder:text-base-content/40 transition-all duration-200"
            placeholder="Task name"
            maxlength="255"
            @blur="handleTaskNameBlur"
          />
        </div>
        
        <button 
          @click="$emit('close')"
          class="btn btn-ghost btn-square btn-sm hover:bg-base-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Form Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
          
          <!-- Task Information -->
          <div class="bg-base-50 rounded-lg">
            <div class="p-4">
              <!-- Collapsible Header -->
              <div 
                class="flex items-center justify-between cursor-pointer hover:bg-base-200/50 -m-2 p-2 rounded-lg transition-colors"
                @click="taskInfoExpanded = !taskInfoExpanded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-semibold text-base">Basic Information</span>
                </div>
                <svg 
                  class="w-5 h-5 text-base-content/60 transition-transform duration-200"
                  :class="{ 'rotate-180': taskInfoExpanded }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <!-- Collapsible Content -->
              <div 
                v-show="taskInfoExpanded"
                class="space-y-4 mt-4 transition-all duration-200"
              >
                <!-- Status and Priority -->
                <div class="flex flex-col gap-4 md:flex-row md:gap-6">
                  <!-- Status -->
                  <div class="w-full md:w-auto md:min-w-48">
                    <div class="form-control w-full">
                      <select 
                        v-model="form.status"
                        class="select select-ghost select-lg w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
                      >
                        <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                          {{ status.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <!-- Priority -->
                  <div class="w-full md:w-auto md:min-w-48">
                    <div class="form-control w-full">
                      <select 
                        v-model="form.priority"
                        class="select select-ghost select-lg w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
                      >
                        <option v-for="priority in priorityOptions" :key="priority.value" :value="priority.value">
                          {{ priority.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <!-- Description -->
                <div class="w-full">
                  <div class="form-control w-full">
                    <textarea 
                      v-model="form.description"
                      class="textarea textarea-ghost textarea-lg w-full bg-base-100 placeholder:text-base-content/60 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200 resize-none"
                      placeholder="Description"
                      rows="3"
                      maxlength="1000"
                    ></textarea>
                    <span class="text-xs text-base-content/60 mt-1">{{ form.description?.length || 0 }}/1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section Divider -->
          <div v-if="taskInfoExpanded || assignmentExpanded" class="border-t border-dotted border-base-300 my-4"></div>
          
          <!-- Assignment & Scheduling -->
          <div class="bg-base-50 rounded-lg">
            <div class="p-4">
              <!-- Collapsible Header -->
              <div 
                class="flex items-center justify-between cursor-pointer hover:bg-base-200/50 -m-2 p-2 rounded-lg transition-colors"
                @click="assignmentExpanded = !assignmentExpanded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
                  </svg>
                  <span class="font-semibold text-base">Assignment & Timeline</span>
                </div>
                <svg 
                  class="w-5 h-5 text-base-content/60 transition-transform duration-200"
                  :class="{ 'rotate-180': assignmentExpanded }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <!-- Collapsible Content -->
              <div 
                v-show="assignmentExpanded"
                class="space-y-4 mt-4 transition-all duration-200"
              >
                <div class="flex flex-col gap-4 md:flex-row md:gap-6">
                  <!-- Assignee -->
                  <div class="w-full">
                    <div class="form-control w-full">
                      <select 
                        v-model="form.assigneeId"
                        class="select select-ghost select-lg w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
                        :disabled="usersLoading"
                      >
                        <option value="">Unassigned</option>
                        <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                          {{ getUserDisplayName(user) }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <!-- Due Date -->
                  <div class="w-full md:w-auto md:min-w-48">
                    <div class="form-control w-full">
                      <input 
                        v-model="form.dueDate"
                        type="date"
                        class="input input-ghost input-lg w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
                        :min="todayDate"
                      />
                    </div>
                  </div>
                </div>
                <!-- Project -->
                <div v-if="showProject" class="form-control w-full">
                  <select 
                    v-model="form.projectId"
                    class="select select-ghost select-lg w-full bg-base-100 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
                    :disabled="projectsLoading"
                    required
                  >
                    <option value="">Select project</option>
                    <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                      {{ project.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section Divider -->
          <div v-if="assignmentExpanded || recurrenceExpanded" class="border-t border-dotted border-base-300 my-4"></div>
          
          <!-- Recurrence Management -->
          <div class="bg-base-50 rounded-lg">
            <div class="p-4">
              <!-- Collapsible Header -->
              <div 
                class="flex items-center justify-between cursor-pointer hover:bg-base-200/50 -m-2 p-2 rounded-lg transition-colors"
                @click="recurrenceExpanded = !recurrenceExpanded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span class="font-semibold text-base">Recurrence Settings</span>
                  <div v-if="isRecurringTask" class="badge badge-info badge-sm">
                    {{ formatRecurrenceType(task?.recurrenceType) }}
                  </div>
                  <div v-if="isRecurringInstance" class="badge badge-outline badge-sm">
                    Instance
                  </div>
                </div>
                <svg 
                  class="w-5 h-5 text-base-content/60 transition-transform duration-200"
                  :class="{ 'rotate-180': recurrenceExpanded }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <!-- Collapsible Content -->
              <div 
                v-show="recurrenceExpanded"
                class="space-y-4 mt-4 transition-all duration-200"
              >
                <!-- Warning for Recurring Instances -->
                <div v-if="isRecurringInstance" class="alert alert-warning">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span class="text-sm">This is a recurring task instance. Recurrence settings are managed by the parent task.</span>
                  <button v-if="task?.parentTaskId" @click="$emit('viewParent', task.parentTaskId)" class="btn btn-warning btn-sm">
                    View Parent Task
                  </button>
                </div>

                <!-- Recurrence Settings (for non-instances) -->
                <div v-if="!isRecurringInstance" class="space-y-4">
                  <RecurrenceSelector 
                    v-model:recurrence-type="form.recurrenceType"
                    v-model:recurrence-day="form.recurrenceDay"
                  />
                  
                  <!-- Recurring Instances Info (if this is a recurring parent) -->
                  <div v-if="isRecurringTask && recurringInstancesCount > 0" class="bg-info/10 border border-info/20 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span class="font-medium text-info">Recurring Instances</span>
                      <span class="badge badge-info badge-sm">{{ recurringInstancesCount }}</span>
                    </div>
                    <p class="text-sm text-base-content/70 mb-3">
                      This task has {{ recurringInstancesCount }} instance{{ recurringInstancesCount !== 1 ? 's' : '' }}.
                      Changes to recurrence settings will affect future instances only.
                    </p>
                    <button @click="showInstancesModal = true" class="btn btn-info btn-sm">
                      Manage Instances
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section Divider -->
          <div v-if="recurrenceExpanded || activityExpanded" class="border-t border-dotted border-base-300 my-4"></div>
          
          <!-- Activity Log -->
          <div class="bg-base-50 rounded-lg">
            <div class="p-4">
              <!-- Collapsible Header -->
              <div 
                class="flex items-center justify-between cursor-pointer hover:bg-base-200/50 -m-2 p-2 rounded-lg transition-colors"
                @click="activityExpanded = !activityExpanded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-semibold text-base">Activity Log</span>
                  <span class="badge badge-sm">{{ taskActivityCount }}</span>
                  <div v-if="isLoadingActivities" class="loading loading-spinner loading-sm"></div>
                  <!-- Comments Filter Toggle -->
                  <div class="form-control">
                    <label class="label cursor-pointer gap-2 py-0">
                      <span class="label-text text-xs text-base-content/70">Comments only</span>
                      <input 
                        v-model="showOnlyComments" 
                        type="checkbox" 
                        class="toggle toggle-xs toggle-accent" 
                      />
                    </label>
                  </div>
                </div>
                <svg 
                  class="w-5 h-5 text-base-content/60 transition-transform duration-200"
                  :class="{ 'rotate-180': activityExpanded }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <!-- Collapsible Content -->
              <div 
                v-show="activityExpanded"
                class="space-y-4 mt-4 transition-all duration-200"
              >
                <!-- Activity Log -->
                <div class="max-h-64 overflow-y-auto space-y-1">
                  <div v-if="isLoadingActivities" class="flex justify-center py-4">
                    <div class="loading loading-spinner loading-sm text-primary"></div>
                  </div>
                  <div v-else-if="taskActivities.length === 0" class="text-center py-6 text-base-content/60">
                    <svg class="w-8 h-8 mx-auto mb-2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <p class="text-sm">No activity yet</p>
                  </div>
                  <div v-else v-for="activity in taskActivities" :key="activity.id" class="group">
                    <!-- Compact Activity Item -->
                    <div class="flex px-2 py-1.5 rounded hover:bg-base-100 transition-colors duration-150" :class="{
                      'flex-row-reverse gap-2': isCurrentUserComment(activity),
                      'gap-2': !isCurrentUserComment(activity),
                      'bg-accent/10 border-r-4 border-accent/30': isCurrentUserComment(activity),
                      'bg-accent/10 border-l-4 border-accent/30': activity.actionType === 'comment' && !isCurrentUserComment(activity),
                      'bg-base-100/50': activity.actionType !== 'comment'
                    }">
                      <!-- Compact Avatar -->
                      <div class="flex-shrink-0 mt-0.5">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="{
                          'bg-accent/20': activity.actionType === 'comment',
                          'bg-primary/15': activity.actionType !== 'comment'
                        }">
                          <span class="text-xs font-medium" :class="{
                            'text-accent': activity.actionType === 'comment',
                            'text-primary': activity.actionType !== 'comment'
                          }">{{ getUserInitials(activity.actor) }}</span>
                        </div>
                      </div>
                      
                      <!-- Compact Content -->
                      <div class="flex-1 min-w-0">
                        <!-- Inline header with user, action, and time -->
                        <div class="flex items-baseline gap-1 text-xs" :class="{
                          'flex-row-reverse': isCurrentUserComment(activity)
                        }">
                          <span class="font-medium" :class="{
                            'text-accent': activity.actionType === 'comment',
                            'text-base-content': activity.actionType !== 'comment'
                          }">{{ getUserName(activity.actor) }}</span>
                          <span v-if="getActivityTypeLabel(activity.actionType)" 
                                class="px-1.5 py-0.5 rounded text-xs font-medium" :class="{
                                  'bg-accent/15 text-accent': activity.actionType === 'comment',
                                  'bg-info/10 text-info': activity.actionType !== 'comment'
                                }">
                            {{ getActivityTypeLabel(activity.actionType) }}
                          </span>
                          <span class="text-base-content/60">{{ formatRelativeTime(activity.createdAt) }}</span>
                        </div>
                        
                        <!-- Activity description in same line or wrapped -->
                        <div class="mt-0.5 leading-relaxed" :class="{
                          'text-slate-700 font-serif font-normal bg-accent/5 px-2 py-1 rounded text-sm': activity.actionType === 'comment',
                          'text-base-content/80 text-xs': activity.actionType !== 'comment',
                          'text-right': isCurrentUserComment(activity)
                        }">
                          {{ activity.description || getDefaultActivityDescription(activity.actionType) }}
                        </div>
                        
                        <!-- Compact metadata display -->
                        <div v-if="activity.changesJson" class="mt-1">
                          <div class="flex flex-wrap gap-1 text-xs">
                            <span v-for="(change, key) in parseJsonMetadata(activity.changesJson)" :key="String(key)" 
                                  class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-base-200/50 rounded text-xs">
                              <span class="font-medium text-base-content/70">{{ formatFieldName(String(key)) }}:</span>
                              <span v-if="change && typeof change === 'object' && change.from !== undefined" 
                                    class="font-mono text-error/70 line-through">{{ formatFieldValue(change.from) }}</span>
                              <svg v-if="change && typeof change === 'object' && change.from !== undefined" 
                                   class="w-2.5 h-2.5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                              <span class="font-mono text-success/80">{{ 
                                change && typeof change === 'object' && change.to !== undefined 
                                  ? formatFieldValue(change.to) 
                                  : formatFieldValue(change) 
                              }}</span>
                            </span>
                          </div>
                        </div>
                        
                        <!-- Expandable metadata for complex data -->
                        <div v-if="activity.metadataJson && activity.metadataJson !== activity.changesJson" 
                             class="mt-1">
                          <details class="text-xs">
                            <summary class="cursor-pointer text-base-content/60 hover:text-base-content">
                              Additional details
                            </summary>
                            <div class="mt-1 font-mono text-xs text-base-content/70 bg-base-100 rounded border p-1.5 max-h-20 overflow-auto">
                              {{ formatJsonDisplay(activity.metadataJson) }}
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Add Comment Input - Compact -->
                <div class="mt-4 pt-3 border-t border-base-300/50">
                  <div class="flex gap-2">
                    <div class="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1">
                      <span class="text-xs font-medium text-primary">{{ getUserInitials(currentUser) }}</span>
                    </div>
                    <div class="flex-1">
                      <textarea 
                        v-model="newComment"
                        class="textarea textarea-ghost textarea-sm w-full bg-base-100 resize-none placeholder:text-base-content/60 focus:bg-base-50 hover:bg-base-200/30 hover:border-primary/40 focus:outline-none border-b-2 border-transparent focus:border-primary transition-all duration-200"
                        :class="{
                          'textarea-disabled': isSubmittingComment,
                          'border-primary/40': newComment.trim()
                        }"
                        placeholder="Add a comment... (Ctrl+Enter to send)"
                        @keydown.ctrl.enter="handleAddComment"
                        @keydown.meta.enter="handleAddComment"
                        :disabled="isSubmittingComment"
                        rows="2"
                      ></textarea>
                      <div class="flex items-center justify-between mt-2">
                        <span class="text-xs text-base-content/50">{{ newComment.length }}/500</span>
                        <button 
                          class="btn btn-primary btn-sm"
                          @click="handleAddComment"
                          :disabled="!newComment.trim() || isSubmittingComment"
                        >
                          <div v-if="isSubmittingComment" class="loading loading-spinner loading-xs"></div>
                          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                          </svg>
                          <span class="ml-1">{{ isSubmittingComment ? 'Sending...' : 'Send' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Panel Footer - Actions -->
        <div class="flex items-center justify-between p-6 bg-base-50">
          <div class="flex gap-3">
            <button 
              @click="handleDelete"
              class="btn btn-error btn-outline gap-2"
              :disabled="isSubmitting"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Task
            </button>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="$emit('close')"
              class="btn btn-ghost"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button 
              @click="handleSave"
              class="btn btn-primary gap-2"
              :disabled="!form.name.trim() || isSubmitting"
              :class="{ 'loading': isSubmitting }"
            >
              <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMyProjectsQuery, useAllUsersQuery, useUpdateTaskMutation, useDeleteTaskMutation, useAssignTaskMutation, useTaskWithActivitiesQuery, useAddCommentMutation, TaskPriority, TaskStatus, RecurrenceType, EntityType, type UpdateTaskInput, type AssignTaskInput, type MyProjectsQuery, type AllUsersQuery } from '../../generated/graphql'
import { useTasks, type TaskItem } from '../../composables/useTasks'
import { useApolloFeedback } from '../../composables/useApolloFeedback'
import { useAuth } from '../../composables/useAuth'
import RecurrenceSelector from './RecurrenceSelector.vue'

// Props & Emits
interface Props {
  isOpen?: boolean
  task?: TaskItem | null
  showProject?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  task: null,
  showProject: true
})

const emit = defineEmits<{
  close: []
  saved: [task: any]
  deleted: [taskId: string]
  viewParent: [taskId: string]
}>()

// Apollo mutations
const { mutate: updateTask, loading: updateLoading } = useUpdateTaskMutation()
const { mutate: assignTask, loading: assignLoading } = useAssignTaskMutation()
const { mutate: deleteTask, loading: deleteLoading, error: deleteError } = useDeleteTaskMutation()
const { mutate: addComment, loading: addCommentLoading } = useAddCommentMutation()
const feedback = useApolloFeedback()

// Auth
const { currentUser } = useAuth()

// Unified tasks functionality - includes recurrence helpers and completion mutation
const { 
  formatRecurrenceType, 
  isRecurringTask: checkIsRecurringTask, 
  isRecurringInstance: checkIsRecurringInstance,
  recurringInstancesCount,
  completeTask
} = useTasks(undefined, props.task?.id)

// Data fetching
const { result: projectsResult, loading: projectsLoading } = useMyProjectsQuery({
  limit: 50,
  offset: 0
})

const { result: usersResult, loading: usersLoading } = useAllUsersQuery()

// Task activities data
const { result: taskActivitiesResult, loading: activitiesLoading, refetch: refetchActivities } = useTaskWithActivitiesQuery(
  computed(() => ({ 
    taskId: props.task?.id || '', 
    activityLimit: 20 
  })),
  {
    enabled: computed(() => !!props.task?.id && props.isOpen),
    fetchPolicy: 'cache-and-network'
  }
)

// Computed properties
const availableProjects = computed((): MyProjectsQuery['myProjects'] => {
  return projectsResult.value?.myProjects || []
})

const availableUsers = computed((): AllUsersQuery['allUsers'] => {
  return usersResult.value?.allUsers || []
})

// Real activities from API
const taskActivities = computed(() => {
  const activities = taskActivitiesResult.value?.task?.activities || []
  
  if (showOnlyComments.value) {
    return activities.filter(activity => activity.actionType === 'comment')
  }
  return activities
})

// Helper to check if comment is from current user
const isCurrentUserComment = (activity: any): boolean => {
  return activity.actionType === 'comment' && activity.actor?.id === currentUser.value?.id
}

const taskActivityCount = computed(() => {
  return taskActivitiesResult.value?.task?.activityCount || 0
})

const isLoadingActivities = computed(() => activitiesLoading.value)

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isSubmitting = computed(() => updateLoading.value || assignLoading.value || deleteLoading.value)

// Form state
const form = ref<{
  name: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  projectId: string
  dueDate: string
  recurrenceType: RecurrenceType
  recurrenceDay: number | null
}>({
  name: '',
  description: '',
  status: TaskStatus.Todo,
  priority: TaskPriority.Medium,
  assigneeId: '',
  projectId: '',
  dueDate: '',
  recurrenceType: RecurrenceType.None,
  recurrenceDay: null
})

// Track original form values for partial updates
const originalForm = ref<typeof form.value | null>(null)

// Expandable sections state
const taskInfoExpanded = ref(false)
const assignmentExpanded = ref(false)
const recurrenceExpanded = ref(false)
const activityExpanded = ref(true)

// Activity log filters
const showOnlyComments = ref(false)

// Modal state for instances management
const showInstancesModal = ref(false)

// Recurrence computed properties
const isRecurringTask = computed(() => checkIsRecurringTask(props.task))
const isRecurringInstance = computed(() => checkIsRecurringInstance(props.task))

// Options
const statusOptions = computed(() => [
  { value: TaskStatus.Todo, label: 'To Do' },
  { value: TaskStatus.InProgress, label: 'In Progress' },
  { value: TaskStatus.Completed, label: 'Completed' }
])

const priorityOptions = computed(() => [
  { value: TaskPriority.Low, label: 'Low' },
  { value: TaskPriority.Medium, label: 'Medium' },
  { value: TaskPriority.High, label: 'High' },
  { value: TaskPriority.Urgent, label: 'Urgent' }
])

// Helper functions
const getUserDisplayName = (user: AllUsersQuery['allUsers'][0]): string => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email
}


// Helper to get user initials
const getUserInitials = (user: any): string => {
  if (!user) return 'U'
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) return firstName[0].toUpperCase()
  if (lastName) return lastName[0].toUpperCase()
  return user.email?.[0]?.toUpperCase() || 'U'
}

// Helper to get user display name
const getUserName = (user: any): string => {
  if (!user) return 'Unknown User'
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
  return fullName || user.email || 'Unknown User'
}

// Enhanced metadata parsing and formatting functions
const parseJsonMetadata = (jsonString: string): any => {
  try {
    if (!jsonString || jsonString.trim() === '') return {}
    const parsed = JSON.parse(jsonString)
    // Ensure we return an object with proper structure
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed
  } catch (error) {
    console.warn('Failed to parse JSON metadata:', error)
    return {}
  }
}

const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim()
}

const formatFieldValue = (value: any): string => {
  if (value === null || value === undefined) return 'None'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string') {
    // Handle enum values - make them more readable
    if (value.includes('_')) {
      return value.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
    }
    return value
  }
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

const formatJsonDisplay = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    return jsonString
  }
}

const getActivityTypeLabel = (actionType: string): string => {
  const typeLabels: Record<string, string> = {
    'create': 'Created',
    'update': 'Updated',
    'delete': 'Deleted',
    'assign': 'Assigned',
    'comment': 'Comment',
    'status_change': 'Status Changed',
    'priority_change': 'Priority Changed',
    'complete': 'Completed',
    'reopen': 'Reopened'
  }
  
  return typeLabels[actionType] || actionType
}

const getDefaultActivityDescription = (actionType: string): string => {
  const descriptions: Record<string, string> = {
    'create': 'Created this task',
    'update': 'Updated task details',
    'delete': 'Deleted this task',
    'assign': 'Assigned the task',
    'comment': 'Added a comment',
    'status_change': 'Changed task status',
    'priority_change': 'Changed task priority',
    'complete': 'Marked task as complete',
    'reopen': 'Reopened the task'
  }
  
  return descriptions[actionType] || 'Performed an action on this task'
}

const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

// Comment input state
const newComment = ref('')
const isSubmittingComment = computed(() => addCommentLoading.value)

// Handle adding a comment
const handleAddComment = async () => {
  if (!newComment.value.trim() || isSubmittingComment.value || !props.task?.id) return
  
  try {
    const result = await addComment({
      input: {
        content: newComment.value.trim(),
        entityId: props.task.id,
        entityType: EntityType.Task,
        mentions: [] // Add mentions functionality later if needed
      }
    })
    
    if (result?.data?.addComment) {
      // Clear the input after successful submission
      newComment.value = ''
      
      // Refetch activities to show the new comment
      await refetchActivities()
      
      feedback.success('Comment added successfully', 'Your comment has been posted')
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    feedback.error('Failed to add comment', 'Please try again')
  }
}

// Form management
const resetForm = () => {
  if (props.task) {
    const formData = {
      name: props.task.name || '',
      description: props.task.description || '',
      status: (props.task.status as TaskStatus) || TaskStatus.Todo,
      priority: (props.task.priority as TaskPriority) || TaskPriority.Medium,
      assigneeId: props.task.assigneeId || '',
      projectId: props.task.projectId || '',
      dueDate: props.task.dueDate ? new Date(props.task.dueDate).toISOString().split('T')[0] : '',
      recurrenceType: (props.task?.recurrenceType as RecurrenceType) || RecurrenceType.None,
      recurrenceDay: props.task?.recurrenceDay || null
    }
    form.value = { ...formData }
    // Store original values for comparison
    originalForm.value = { ...formData }
  }
}

// Helper to detect which fields have changed
const getChangedFields = (): UpdateTaskInput => {
  if (!originalForm.value || !props.task) {
    return { taskId: props.task?.id || '' }
  }
  
  const changes: UpdateTaskInput = {
    taskId: props.task.id
  }
  
  // Only include fields that have actually changed
  if (form.value.name !== originalForm.value.name) {
    changes.name = form.value.name.trim()
  }
  if (form.value.description !== originalForm.value.description) {
    changes.description = form.value.description || undefined
  }
  if (form.value.status !== originalForm.value.status) {
    changes.status = form.value.status
  }
  if (form.value.priority !== originalForm.value.priority) {
    changes.priority = form.value.priority
  }
  if (form.value.dueDate !== originalForm.value.dueDate) {
    changes.dueDate = form.value.dueDate ? new Date(form.value.dueDate).toISOString() : undefined
  }
  if (form.value.recurrenceType !== originalForm.value.recurrenceType) {
    changes.recurrenceType = form.value.recurrenceType
  }
  if (form.value.recurrenceDay !== originalForm.value.recurrenceDay) {
    changes.recurrenceDay = form.value.recurrenceDay
  }
  
  return changes
}

// Handle task name blur (auto-save on name change)
const handleTaskNameBlur = async () => {
  if (!originalForm.value || !props.task) return
  
  // Only save if name changed and is not empty
  if (form.value.name !== originalForm.value.name && form.value.name.trim()) {
    const changes: UpdateTaskInput = { taskId: props.task.id, name: form.value.name.trim() }
    
    try {
      await updateTask({ input: changes })
      // Update original form to reflect the saved change
      originalForm.value.name = form.value.name
      feedback.success('Task Updated', 'Task name updated successfully')
    } catch (error) {
      // Revert to original name on error
      form.value.name = originalForm.value.name
      feedback.error('Update Failed', 'Could not update task name')
    }
  }
}

// Actions
const handleSave = async () => {
  if (!props.task || !form.value.name.trim()) return

  const changes = getChangedFields()
  const assigneeChanged = originalForm.value && form.value.assigneeId !== originalForm.value.assigneeId
  const projectChanged = originalForm.value && form.value.projectId !== originalForm.value.projectId
  
  // Check if any actual fields changed (exclude taskId from count)
  const changedFields = Object.keys(changes).filter(key => key !== 'taskId')
  if (changedFields.length === 0 && !assigneeChanged && !projectChanged) {
    emit('close')
    return
  }

    try {
    const promises: Promise<any>[] = []

    // If status changed to Completed, call the recurrence-aware mutation instead
    if (changes.status === TaskStatus.Completed && originalForm.value && originalForm.value.status !== TaskStatus.Completed) {
      // Use unified completeTask so recurrence is handled server-side
      promises.push(completeTask(props.task!.id))
      // Remove status from changes so updateTask doesn't try to set it again
      delete changes.status
    }

    // Handle remaining regular task updates (exclude status if already handled)
    if (Object.keys(changes).length > 0) {
      promises.push(updateTask({ input: changes }))
    }

    // Handle assignee changes separately
    if (assigneeChanged) {
      const assignInput: AssignTaskInput = {
        taskId: props.task.id,
        assigneeId: form.value.assigneeId || undefined
      }
      promises.push(assignTask({ input: assignInput }))
    }

    // Execute all mutations
    await Promise.all(promises)
    
    // Update original form to reflect saved changes
    if (originalForm.value) {
      Object.assign(originalForm.value, form.value)
    }
    
    feedback.success('Task Updated', `"${form.value.name}" has been updated successfully`)
    emit('saved', { ...changes, assigneeId: form.value.assigneeId, projectId: form.value.projectId })
    emit('close')
    
  } catch (error) {
    console.error('Task update failed:', error)
    feedback.error('Update Failed', 'Could not save task changes')
  }
}

const handleDelete = async () => {
  if (!props.task) return

  if (!confirm(`Are you sure you want to delete "${props.task.name}"? This action cannot be undone.`)) {
    return
  }

  feedback.handleMutation(deleteLoading, deleteError, async () => {
    emit('deleted', props.task!.id)
    emit('close')
  }, {
    successTitle: 'Task Deleted',
    successMessage: `"${props.task.name}" has been deleted`,
    errorTitle: 'Delete Failed'
  })

  try {
    await deleteTask({ taskId: props.task.id })
  } catch (error) {
    console.error('Task delete failed:', error)
  }
}

// Watch for task changes
watch(() => props.task, () => {
  resetForm()
}, { immediate: true })

// Watch for panel open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>