import { gql } from 'graphql-tag'

// ========================================
// ACTIVITY LOG QUERIES
// ========================================

export const TASK_ACTIVITIES_QUERY = gql`
  query TaskActivities($taskId: UUID!, $limit: Int, $offset: Int) {
    task(taskId: $taskId) {
      id
      name
      activityCount
      activities(limit: $limit, offset: $offset) {
        id
        actionType
        description
        entityId
        entityType
        actorId
        changesJson
        metadataJson
        createdAt
        actor {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`

export const TASK_ACTIVITY_COUNT_QUERY = gql`
  query TaskActivityCount($taskId: UUID!) {
    task(taskId: $taskId) {
      id
      activityCount
    }
  }
`

// Enhanced task query with activities
export const TASK_WITH_ACTIVITIES_QUERY = gql`
  query TaskWithActivities($taskId: UUID!, $activityLimit: Int = 10) {
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
      createdAt
      updatedAt
      activityCount
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
        description
      }
      parentTask {
        id
        name
        status
      }
      activities(limit: $activityLimit) {
        id
        actionType
        description
        entityId
        entityType
        actorId
        changesJson
        metadataJson
        createdAt
        actor {
          id
          email
          firstName
          lastName
        }
      }
      recurringInstances(limit: 5) {
        id
        name
        status
        dueDate
        nextDueDate
      }
    }
  }
`