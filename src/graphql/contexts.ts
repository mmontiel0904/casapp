import { gql } from 'graphql-tag'

// ========================================
// CONTEXT CATEGORIES QUERIES & MUTATIONS
// ========================================

export const PROJECT_CONTEXT_CATEGORIES_QUERY = gql`
  query ProjectContextCategories($projectId: UUID!, $contextTypeName: String) {
    projectContextCategories(projectId: $projectId, contextTypeName: $contextTypeName) {
      id
      name
      description
      color
      contextTypeId
      projectId
      isActive
      createdAt
      updatedAt
      createdBy
    }
  }
`

export const CREATE_CONTEXT_CATEGORY_MUTATION = gql`
  mutation CreateContextCategory($input: CreateContextCategoryInput!) {
    createContextCategory(input: $input) {
      id
      name
      description
      color
      contextTypeId
      projectId
      isActive
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_CONTEXT_CATEGORY_MUTATION = gql`
  mutation UpdateContextCategory($input: UpdateContextCategoryInput!) {
    updateContextCategory(input: $input) {
      id
      name
      description
      color
      isActive
      updatedAt
    }
  }
`

export const DELETE_CONTEXT_CATEGORY_MUTATION = gql`
  mutation DeleteContextCategory($categoryId: UUID!) {
    deleteContextCategory(categoryId: $categoryId) {
      message
    }
  }
`

// ========================================
// PROJECT CONTEXTS QUERIES & MUTATIONS
// ========================================

export const PROJECT_CONTEXTS_QUERY = gql`
  query ProjectContexts(
    $projectId: UUID!
    $filters: ContextFilters
    $limit: Int = 50
    $offset: Int = 0
  ) {
    projectContexts(
      projectId: $projectId
      filters: $filters
      limit: $limit
      offset: $offset
    ) {
      totalCount
      edges {
        id
        title
        description
        tags
        isArchived
        contextType {
          id
          name
          description
        }
        category {
          id
          name
          color
          description
        }
        emailContext {
          id
          subject
          fromEmail
          messagePreview
        }
        project {
          id
          name
        }
        createdAt
        updatedAt
        createdBy
      }
    }
  }
`

export const ARCHIVE_CONTEXT_MUTATION = gql`
  mutation ArchiveContext($contextId: UUID!) {
    archiveContext(contextId: $contextId) {
      id
      title
      isArchived
      updatedAt
    }
  }
`

export const RESTORE_CONTEXT_MUTATION = gql`
  mutation RestoreContext($contextId: UUID!) {
    restoreContext(contextId: $contextId) {
      id
      title
      isArchived
      updatedAt
    }
  }
`

// ========================================
// CONTEXT TYPES QUERY
// ========================================

export const CONTEXT_TYPES_QUERY = gql`
  query ContextTypes($activeOnly: Boolean) {
    contextTypes(activeOnly: $activeOnly) {
      id
      name
      description
      isActive
      schemaVersion
      createdAt
      updatedAt
    }
  }
`
