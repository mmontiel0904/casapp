import { gql } from 'graphql-tag'

// Project Queries
export const MY_PROJECTS_QUERY = gql`
  query MyProjects($limit: Int, $offset: Int) {
    myProjects(limit: $limit, offset: $offset) {
      id
      name
      description
      ownerId
      isActive
      createdAt
      updatedAt
      owner {
        id
        email
        firstName
        lastName
      }
      members {
        id
        role
        joinedAt
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`

export const PROJECT_QUERY = gql`
  query Project($projectId: UUID!) {
    project(projectId: $projectId) {
      id
      name
      description
      ownerId
      isActive
      createdAt
      updatedAt
      owner {
        id
        email
        firstName
        lastName
      }
      members {
        id
        role
        joinedAt
        user {
          id
          email
          firstName
          lastName
        }
      }
      tasks(limit: 10) {
        id
        name
        status
        priority
        dueDate
        assignee {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`

// Project Mutations
export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      ownerId
      createdAt
    }
  }
`

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
      name
      description
      updatedAt
    }
  }
`

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($projectId: UUID!) {
    deleteProject(projectId: $projectId) {
      message
    }
  }
`

// Task Queries  
export const PROJECT_TASKS_QUERY = gql`
  query ProjectTasks(
    $projectId: UUID!, 
    $status: String, 
    $assigneeId: UUID, 
    $limit: Int, 
    $offset: Int
  ) {
    projectTasks(
      projectId: $projectId, 
      status: $status, 
      assigneeId: $assigneeId, 
      limit: $limit, 
      offset: $offset
    ) {
      id
      name
      description
      projectId
      assigneeId
      creatorId
      status
      priority
      dueDate
      isRecurring
      recurrenceType
      recurrenceDay
      nextDueDate
      parentTaskId
      activityCount
      createdAt
      updatedAt
      assignee {
        id
        email
        firstName
        lastName
      }
      creator {
        id
        email
        firstName
        lastName
      }
      parentTask {
        id
        name
        status
      }
    }
  }
`

export const MY_ASSIGNED_TASKS_QUERY = gql`
  query MyAssignedTasks($status: String, $limit: Int, $offset: Int) {
    myAssignedTasks(status: $status, limit: $limit, offset: $offset) {
      id
      name
      description
      projectId
      status
      priority
      dueDate
      isRecurring
      recurrenceType
      recurrenceDay
      nextDueDate
      parentTaskId
      activityCount
      createdAt
      updatedAt
      project {
        id
        name
      }
      creator {
        id
        email
        firstName
        lastName
      }
      parentTask {
        id
        name
        status
      }
    }
  }
`

export const TASK_STATS_QUERY = gql`
  query ProjectTaskStats($projectId: UUID!) {
    projectTaskStats(projectId: $projectId) {
      total
      todo
      inProgress
      completed
      cancelled
      overdue
    }
  }
`

// Task Mutations
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      name
      description
      projectId
      assigneeId
      creatorId
      status
      priority
      dueDate
      isRecurring
      recurrenceType
      recurrenceDay
      nextDueDate
      parentTaskId
      createdAt
      assignee {
        id
        email
        firstName
        lastName
      }
      parentTask {
        id
        name
        status
      }
    }
  }
`

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      name
      description
      status
      priority
      dueDate
      isRecurring
      recurrenceType
      recurrenceDay
      nextDueDate
      updatedAt
    }
  }
`

export const ASSIGN_TASK_MUTATION = gql`
  mutation AssignTask($input: AssignTaskInput!) {
    assignTask(input: $input) {
      id
      assigneeId
      assignee {
        id
        email
        firstName
        lastName
      }
      updatedAt
    }
  }
`

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($taskId: UUID!) {
    deleteTask(taskId: $taskId) {
      message
    }
  }
`

// Project Member Mutations
export const ADD_PROJECT_MEMBER_MUTATION = gql`
  mutation AddProjectMember($input: AddProjectMemberInput!) {
    addProjectMember(input: $input) {
      message
    }
  }
`

export const UPDATE_MEMBER_ROLE_MUTATION = gql`
  mutation UpdateMemberRole($input: UpdateMemberRoleInput!) {
    updateMemberRole(input: $input) {
      message
    }
  }
`

export const REMOVE_PROJECT_MEMBER_MUTATION = gql`
  mutation RemoveProjectMember($input: RemoveProjectMemberInput!) {
    removeProjectMember(input: $input) {
      message
    }
  }
`

// ========================================
// RECURRING TASK QUERIES
// ========================================

export const TASK_RECURRING_INSTANCES_QUERY = gql`
  query TaskRecurringInstances($taskId: UUID!, $limit: Int = 10) {
    task(taskId: $taskId) {
      id
      name
      isRecurring
      recurrenceType
      recurrenceDay
      nextDueDate
      recurringInstances(limit: $limit) {
        id
        name
        status
        priority
        dueDate
        nextDueDate
        createdAt
        assignee {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`

export const TASK_WITH_PARENT_QUERY = gql`
  query TaskWithParent($taskId: UUID!) {
    task(taskId: $taskId) {
      id
      name
      description
      status
      priority
      dueDate
      isRecurring
      recurrenceType
      recurrenceDay
      nextDueDate
      parentTaskId
      createdAt
      updatedAt
      assignee {
        id
        email
        firstName
        lastName
      }
      creator {
        id
        email
        firstName
        lastName
      }
      project {
        id
        name
      }
      parentTask {
        id
        name
        status
        priority
        dueDate
        isRecurring
        recurrenceType
        recurrenceDay
      }
    }
  }
`