<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.push('/')"
              class="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-slate-900">
              API Testing Dashboard
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <Button
              variant="secondary"
              @click="exportResults"
              :disabled="testSummary.total === 0"
            >
              Export Results
            </Button>
            
            <Button
              variant="outline"
              @click="clearResults"
              :disabled="isRunning || testSummary.total === 0"
            >
              Clear Results
            </Button>
            
            <Button
              variant="primary"
              @click="runAllTests"
              :disabled="isRunning"
            >
              <span v-if="isRunning">Running Tests...</span>
              <span v-else>Run All Tests</span>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Tests -->
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-slate-900">{{ allTests.length }}</div>
            <div class="text-sm text-slate-600">Total Endpoints</div>
          </div>
        </Card>

        <!-- Success Rate -->
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ testSummary.successRate.toFixed(1) }}%
            </div>
            <div class="text-sm text-slate-600">Success Rate</div>
          </div>
        </Card>

        <!-- Successful Tests -->
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ testSummary.successful }}</div>
            <div class="text-sm text-slate-600">Successful</div>
          </div>
        </Card>

        <!-- Failed Tests -->
        <Card>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ testSummary.failed }}</div>
            <div class="text-sm text-slate-600">Failed</div>
          </div>
        </Card>
      </div>

      <!-- Progress Bar -->
      <Card v-if="isRunning || testProgress.completed > 0" class="mb-8">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-slate-900">Test Progress</h3>
            <span class="text-sm text-slate-600">
              {{ testProgress.completed }} / {{ testProgress.total }}
            </span>
          </div>
          
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${testProgress.percentage}%` }"
            ></div>
          </div>
          
          <div v-if="currentTest" class="text-sm text-slate-600">
            Currently testing: <span class="font-medium">{{ getCurrentTestName() }}</span>
          </div>
        </div>
      </Card>

      <!-- Test Suites -->
      <div class="space-y-8">
        <div v-for="suite in testSuites" :key="suite.name">
          <Card>
            <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-slate-900">
                  {{ suite.name }}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  @click="runSuiteTests(suite.name)"
                  :disabled="isRunning"
                >
                  Run Suite
                </Button>
              </div>
            </template>

            <!-- Test Table -->
            <div class="overflow-x-auto">
              <Table
                :columns="testTableColumns"
                :data="getTableData(suite.tests)"
                :striped="true"
                density="comfortable"
              />
            </div>
          </Card>
        </div>
      </div>

      <!-- Test Details Modal/Panel -->
      <Card v-if="selectedTest" class="mt-8" title="Test Details">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ selectedTest.name }} - Details
            </h3>
            <button
              @click="selectedTest = null"
              class="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Test Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ selectedTest.type.toUpperCase() }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Authentication</label>
              <span :class="selectedTest.requiresAuth ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ selectedTest.requiresAuth ? 'Required' : 'Not Required' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <p class="text-sm text-slate-900">{{ selectedTest.description }}</p>
          </div>

          <!-- GraphQL Operation -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">GraphQL Operation</label>
            <pre class="bg-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ selectedTest.operation.trim() }}</code></pre>
          </div>

          <!-- Variables -->
          <div v-if="selectedTest.variables">
            <label class="block text-sm font-medium text-slate-700 mb-2">Variables</label>
            <pre class="bg-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ JSON.stringify(selectedTest.variables, null, 2) }}</code></pre>
          </div>

          <!-- Expected Fields -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Expected Response Fields</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="field in selectedTest.expectedFields"
                :key="field"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
              >
                {{ field }}
              </span>
            </div>
          </div>

          <!-- Test Result -->
          <div v-if="getTestResult(selectedTest.id)">
            <label class="block text-sm font-medium text-slate-700 mb-2">Last Test Result</label>
            <Alert
              :type="getTestResult(selectedTest.id)!.success ? 'success' : 'error'"
              :title="getTestResult(selectedTest.id)!.success ? 'Test Passed' : 'Test Failed'"
              :message="getTestResultMessage(selectedTest.id)"
            />
            
            <!-- Response Data -->
            <div v-if="getTestResult(selectedTest.id)!.data" class="mt-4">
              <label class="block text-sm font-medium text-slate-700 mb-2">Response Data</label>
              <pre class="bg-slate-100 rounded-lg p-4 text-sm overflow-x-auto max-h-64"><code>{{ JSON.stringify(getTestResult(selectedTest.id)!.data, null, 2) }}</code></pre>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <Button
              variant="primary"
              @click="runSingleTest(selectedTest)"
              :disabled="isRunning"
            >
              Run This Test
            </Button>
          </div>
        </div>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApiTesting, type EndpointTest } from '../composables/useApiTesting'

// Removed unused router

const {
  testSuites,
  allTests,
  testProgress,
  testSummary,
  isRunning,
  currentTest,
  runAllTests,
  runSuiteTests,
  runSingleTest,
  clearResults,
  getTestResult,
  exportTestSuite
} = useApiTesting()

// Local state
const selectedTest = ref<EndpointTest | null>(null)

// Table configuration
const testTableColumns = [
  {
    key: 'name',
    label: 'Test Name',
    sortable: true
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'duration',
    label: 'Duration'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]

// Methods
const getTableData = (tests: EndpointTest[]) => {
  return tests.map(test => {
    const result = getTestResult(test.id)
    
    return {
      id: test.id,
      name: test.name,
      type: test.type.toUpperCase(),
      status: result ? (result.success ? '✅ Passed' : '❌ Failed') : '⏳ Pending',
      duration: result ? `${result.duration}ms` : '-',
      actions: test,
      _rawTest: test // Store the full test object for actions
    }
  })
}

const getCurrentTestName = () => {
  if (!currentTest.value) return ''
  const test = allTests.value.find(t => t.id === currentTest.value)
  return test?.name || ''
}

const getTestResultMessage = (testId: string) => {
  const result = getTestResult(testId)
  if (!result) return ''
  
  if (result.success) {
    return `Test completed successfully in ${result.duration}ms`
  } else {
    return result.error || 'Test failed with unknown error'
  }
}

const exportResults = () => {
  const data = exportTestSuite()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `api-test-results-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// Handle table row actions (for future use)
// const handleTestAction = (test: EndpointTest, action: string) => {
//   switch (action) {
//     case 'view':
//       selectedTest.value = test
//       break
//     case 'run':
//       runSingleTest(test)
//       break
//   }
// }
</script>