import { ref, computed } from 'vue'
import { apolloClient } from '../lib/apollo'
import { gql } from 'graphql-tag'

export interface EndpointTest {
  id: string
  name: string
  type: 'query' | 'mutation'
  operation: string
  variables?: Record<string, any>
  expectedFields: string[]
  description: string
  requiresAuth: boolean
  adminOnly?: boolean
}

export interface TestResult {
  endpointId: string
  success: boolean
  duration: number
  data?: any
  error?: string
  timestamp: Date
}

export interface TestSuite {
  name: string
  tests: EndpointTest[]
}

// Define all available API endpoints for testing
const API_ENDPOINTS: TestSuite[] = [
  {
    name: 'Authentication',
    tests: [
      {
        id: 'login',
        name: 'User Login',
        type: 'mutation',
        operation: `
          mutation Login($email: String!, $password: String!) {
            login(input: {email: $email, password: $password}) {
              token
              user {
                id
                email
                firstName
                lastName
                isEmailVerified
              }
            }
          }
        `,
        variables: {
          email: 'test@example.com',
          password: 'testpassword'
        },
        expectedFields: ['login.token', 'login.user.id', 'login.user.email'],
        description: 'Test user authentication with valid credentials',
        requiresAuth: false
      },
      {
        id: 'register',
        name: 'User Registration',
        type: 'mutation',
        operation: `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              id
              email
              firstName
              lastName
              isEmailVerified
              createdAt
            }
          }
        `,
        variables: {
          input: {
            email: 'newuser@example.com',
            password: 'newpassword123',
            firstName: 'Test',
            lastName: 'User'
          }
        },
        expectedFields: ['register.id', 'register.email', 'register.createdAt'],
        description: 'Test user registration with valid data',
        requiresAuth: false
      },
      {
        id: 'verify-email',
        name: 'Email Verification',
        type: 'mutation',
        operation: `
          mutation VerifyEmail($token: String!) {
            verifyEmail(token: $token) {
              message
            }
          }
        `,
        variables: {
          token: 'test-verification-token'
        },
        expectedFields: ['verifyEmail.message'],
        description: 'Test email verification with token',
        requiresAuth: false
      }
    ]
  },
  {
    name: 'User Management',
    tests: [
      {
        id: 'me',
        name: 'Get Current User',
        type: 'query',
        operation: `
          query Me {
            me {
              id
              email
              firstName
              lastName
              isEmailVerified
              createdAt
              updatedAt
            }
          }
        `,
        expectedFields: ['me.id', 'me.email', 'me.createdAt'],
        description: 'Test retrieving current user profile',
        requiresAuth: true
      }
    ]
  },
  {
    name: 'System',
    tests: [
      {
        id: 'health',
        name: 'Health Check',
        type: 'query',
        operation: `
          query Health {
            health
          }
        `,
        expectedFields: ['health'],
        description: 'Test API health check endpoint',
        requiresAuth: false
      }
    ]
  }
]

export function useApiTesting() {
  const testResults = ref<Map<string, TestResult>>(new Map())
  const isRunning = ref(false)
  const currentTest = ref<string | null>(null)
  
  // All available test suites
  const testSuites = ref<TestSuite[]>(API_ENDPOINTS)
  
  // Computed properties
  const allTests = computed(() => {
    return testSuites.value.flatMap(suite => suite.tests)
  })
  
  const completedTests = computed(() => {
    return allTests.value.filter(test => testResults.value.has(test.id))
  })
  
  const successfulTests = computed(() => {
    return Array.from(testResults.value.values()).filter(result => result.success)
  })
  
  const failedTests = computed(() => {
    return Array.from(testResults.value.values()).filter(result => !result.success)
  })
  
  const testProgress = computed(() => {
    const total = allTests.value.length
    const completed = completedTests.value.length
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 }
  })
  
  const testSummary = computed(() => {
    const total = testResults.value.size
    const successful = successfulTests.value.length
    const failed = failedTests.value.length
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    }
  })
  
  // Execute a single test
  const runSingleTest = async (test: EndpointTest): Promise<TestResult> => {
    const startTime = Date.now()
    currentTest.value = test.id
    
    try {
      let result: any
      
      if (test.type === 'query') {
        const { data } = await apolloClient.query({
          query: gql(test.operation),
          variables: test.variables,
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        })
        result = data
      } else {
        const { data } = await apolloClient.mutate({
          mutation: gql(test.operation),
          variables: test.variables,
          errorPolicy: 'all'
        })
        result = data
      }
      
      const duration = Date.now() - startTime
      
      // Validate expected fields
      const missingFields = validateExpectedFields(result, test.expectedFields)
      
      const testResult: TestResult = {
        endpointId: test.id,
        success: missingFields.length === 0,
        duration,
        data: result,
        error: missingFields.length > 0 ? `Missing fields: ${missingFields.join(', ')}` : undefined,
        timestamp: new Date()
      }
      
      testResults.value.set(test.id, testResult)
      return testResult
      
    } catch (error: any) {
      const duration = Date.now() - startTime
      
      const testResult: TestResult = {
        endpointId: test.id,
        success: false,
        duration,
        error: error.message || 'Unknown error occurred',
        timestamp: new Date()
      }
      
      testResults.value.set(test.id, testResult)
      return testResult
    } finally {
      currentTest.value = null
    }
  }
  
  // Run all tests
  const runAllTests = async (): Promise<void> => {
    isRunning.value = true
    testResults.value.clear()
    
    try {
      for (const suite of testSuites.value) {
        for (const test of suite.tests) {
          // Skip auth-required tests if we don't have a token
          if (test.requiresAuth && !localStorage.getItem('auth_token')) {
            const testResult: TestResult = {
              endpointId: test.id,
              success: false,
              duration: 0,
              error: 'Authentication required - please login first',
              timestamp: new Date()
            }
            testResults.value.set(test.id, testResult)
            continue
          }
          
          await runSingleTest(test)
          
          // Small delay between tests to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    } finally {
      isRunning.value = false
      currentTest.value = null
    }
  }
  
  // Run tests for a specific suite
  const runSuiteTests = async (suiteName: string): Promise<void> => {
    isRunning.value = true
    
    try {
      const suite = testSuites.value.find(s => s.name === suiteName)
      if (!suite) return
      
      for (const test of suite.tests) {
        await runSingleTest(test)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } finally {
      isRunning.value = false
    }
  }
  
  // Clear all test results
  const clearResults = (): void => {
    testResults.value.clear()
  }
  
  // Get result for specific test
  const getTestResult = (testId: string): TestResult | undefined => {
    return testResults.value.get(testId)
  }
  
  // Helper function to validate expected fields in response
  const validateExpectedFields = (data: any, expectedFields: string[]): string[] => {
    const missingFields: string[] = []
    
    for (const field of expectedFields) {
      if (!hasNestedProperty(data, field)) {
        missingFields.push(field)
      }
    }
    
    return missingFields
  }
  
  // Helper function to check nested properties
  const hasNestedProperty = (obj: any, path: string): boolean => {
    if (!obj) return false
    
    const keys = path.split('.')
    let current = obj
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return false
      }
      current = current[key]
    }
    
    return current !== null && current !== undefined
  }
  
  // Export a test suite as JSON for external tools
  const exportTestSuite = (): string => {
    const exportData = {
      suites: testSuites.value,
      results: Array.from(testResults.value.entries()).map(([id, result]) => ({
        testId: id,
        ...result
      })),
      summary: testSummary.value,
      exportedAt: new Date().toISOString()
    }
    
    return JSON.stringify(exportData, null, 2)
  }
  
  return {
    // State
    testSuites,
    testResults: computed(() => testResults.value),
    isRunning,
    currentTest,
    
    // Computed
    allTests,
    completedTests,
    successfulTests,
    failedTests,
    testProgress,
    testSummary,
    
    // Methods
    runSingleTest,
    runAllTests,
    runSuiteTests,
    clearResults,
    getTestResult,
    exportTestSuite
  }
}