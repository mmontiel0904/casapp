import { gql } from 'graphql-tag'

// ========================================
// EMAIL CONTEXT QUERIES
// ========================================

export const PROJECT_EMAIL_CONTEXTS_QUERY = gql`
  query ProjectEmailContexts(
    $projectId: UUID!
    $limit: Int = 30
    $offset: Int = 0
    $filters: EmailContextFilters
  ) {
    emailContexts(
      projectId: $projectId
      limit: $limit
      offset: $offset
      filters: $filters
    ) {
      totalCount
      edges {
        id
        subject
        fromEmail
        fromName
        toEmails
        ccEmails
        bccEmails
        messageDate
        receivedDate
        processingStatus
        aiSummary
        messagePreview
        fullMessage
        hasAttachments
        attachmentCount
        threadId
        replyTo
        inReplyTo
        processingNotes
        attachments {
          id
          filename
          originalFilename
          contentType
          fileSize
        }
      }
    }
  }
`

export const EMAIL_CONTEXT_QUERY = gql`
  query EmailContext($emailId: UUID!) {
    emailContext(emailId: $emailId) {
      id
      subject
      fromEmail
      fromName
      toEmails
      ccEmails
      bccEmails
      messageDate
      receivedDate
      processingStatus
      aiSummary
      messagePreview
      fullMessage
      messageHtml
      hasAttachments
      attachmentCount
      threadId
      replyTo
      inReplyTo
      processingNotes
      attachments {
        id
        filename
        originalFilename
        contentType
        fileSize
        storagePath
      }
      projectContext {
        id
        description
        project {
          id
          name
          description
        }
      }
      accountingProcess
    }
  }
`

export const SEARCH_EMAIL_CONTEXTS_QUERY = gql`
  query SearchEmailContexts(
    $projectId: UUID!
    $query: String!
    $limit: Int = 20
  ) {
    searchEmailContexts(
      projectId: $projectId
      query: $query
      limit: $limit
    ) {
      id
      subject
      fromEmail
      fromName
      toEmails
      messageDate
      receivedDate
      processingStatus
      aiSummary
      messagePreview
      fullMessage
      hasAttachments
      attachmentCount
      threadId
    }
  }
`

export const EMAIL_THREAD_QUERY = gql`
  query EmailThread(
    $projectId: UUID!
    $threadId: String!
  ) {
    emailThread(
      projectId: $projectId
      threadId: $threadId
    ) {
      id
      subject
      fromEmail
      fromName
      toEmails
      ccEmails
      messageDate
      receivedDate
      processingStatus
      aiSummary
      messagePreview
      fullMessage
      hasAttachments
      attachmentCount
      replyTo
      inReplyTo
      attachments {
        id
        filename
        originalFilename
        contentType
        fileSize
      }
    }
  }
`

// ========================================
// EMAIL CONTEXT MUTATIONS
// ========================================

export const UPDATE_EMAIL_PROCESSING_STATUS_MUTATION = gql`
  mutation UpdateEmailProcessingStatus(
    $emailId: UUID!
    $status: ProcessingStatus!
    $notes: String
  ) {
    updateEmailProcessingStatus(
      emailId: $emailId
      status: $status
      notes: $notes
    ) {
      id
      processingStatus
      processingNotes
    }
  }
`
