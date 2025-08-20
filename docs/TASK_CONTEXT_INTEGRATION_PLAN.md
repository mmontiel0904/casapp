# Task-Context Integration Implementation Plan

## 📋 **Overview**

Based on the new GraphQL schema changes, we now have:
1. **`createTaskFromContext`** mutation for creating tasks directly from context items
2. **`context: ProjectContext`** and **`contextId: UUID`** fields on Task type
3. **New integration opportunities** between tasks and context management

## 🎯 **Implementation Plan**

### **Phase 1: Context → Task Creation**

#### **1.1 Update ContextEntriesTable.vue**
**Location:** `/src/components/context/ContextEntriesTable.vue`

**Changes:**
- Add "Create Task" action button in the Actions dropdown
- Create `CreateTaskFromContextModal.vue` component
- Add GraphQL mutation for `createTaskFromContext`

**UI Design:**
```
Actions Dropdown:
├── View (existing)
├── Archive/Restore (existing)
├── ➕ Create Task (NEW)
```

#### **1.2 Create TaskFromContextModal Component**
**Location:** `/src/components/modals/CreateTaskFromContextModal.vue`

**Features:**
- Pre-filled context reference
- Task name (required)
- Description (optional, can pre-populate from context)
- Assignee selection (project members)
- Due date picker
- Priority selection
- Auto-link to source context

**Form Fields:**
```typescript
interface CreateTaskFromContextForm {
  name: string           // Required
  description?: string   // Optional, pre-filled from context
  assigneeId?: string   // Project member selection
  dueDate?: Date        // Date picker
  priority: TaskPriority // Dropdown: URGENT, HIGH, MEDIUM, LOW
}
```

### **Phase 2: Task → Context Viewing**

#### **2.1 Update Task Detail Views**
**Locations:**
- `/src/components/tasks/TaskDetailPanel.vue` (if exists)
- Task modals or detail views

**Changes:**
- Add conditional "Context" tab when `task.contextId` exists
- Create `TaskContextView.vue` component
- Display linked context information

#### **2.2 Create TaskContextView Component**
**Location:** `/src/components/tasks/TaskContextView.vue`

**Features:**
- Display context title, description, tags
- Show context category and type
- Link to full context in project view
- Display context creation date and metadata

**UI Design:**
```
Context Information Card:
├── 📄 Context Title
├── 📝 Description (if exists)
├── 🏷️ Tags (if exists)
├── 📂 Category
├── 🔗 "View in Project Context" link
```

### **Phase 3: Enhanced Task Views**

#### **3.1 Update MyTasksPage.vue**
**Location:** `/src/views/MyTasksPage.vue`

**Changes:**
- Add context indicator in task cards
- Show context icon when task has associated context
- Add quick context preview on hover

#### **3.2 Update Project Task Views**
**Location:** `/src/components/project/ProjectContextView.vue` (Tasks tab)

**Changes:**
- Add context column or indicator
- Filter tasks by context association
- Quick context navigation

## 🔧 **Technical Implementation Details**

### **GraphQL Integration**

#### **1. New Mutation Usage:**
```typescript
// In CreateTaskFromContextModal.vue
const { mutate: createTaskFromContext } = useCreateTaskFromContextMutation()

const createTask = async () => {
  await createTaskFromContext({
    input: {
      contextId: props.contextId,
      name: form.name,
      description: form.description,
      assigneeId: form.assigneeId,
      dueDate: form.dueDate,
      priority: form.priority
    }
  })
}
```

#### **2. Enhanced Task Queries:**
```typescript
// Update existing task queries to include context
const TASK_WITH_CONTEXT_FRAGMENT = gql`
  fragment TaskWithContext on Task {
    id
    name
    description
    status
    priority
    dueDate
    context {
      id
      title
      description
      tags
      category {
        name
        color
      }
      contextType {
        name
      }
    }
  }
`
```

### **Component Architecture**

#### **New Components:**
1. **CreateTaskFromContextModal.vue**
   - Modal for task creation from context
   - Form validation and submission
   - Project member selection

2. **TaskContextView.vue**
   - Context information display
   - Navigation to project context view
   - Context metadata presentation

3. **ContextTaskIndicator.vue** (optional)
   - Small component for showing context association
   - Reusable across different views

#### **Updated Components:**
1. **ContextEntriesTable.vue**
   - Add "Create Task" action
   - Integration with task creation modal

2. **Task Detail Components**
   - Add conditional context tab
   - Context information display

## 📱 **User Experience Flow**

### **Context → Task Creation:**
1. User browses context entries in project
2. Clicks "Create Task" in context row actions
3. Modal opens with:
   - Context auto-linked
   - Pre-filled description from context
   - Task details form
4. User fills task details and saves
5. Task created with context association
6. Success feedback with link to new task

### **Task → Context Viewing:**
1. User views task (in any task view)
2. If task has context, "Context" tab appears
3. User clicks context tab
4. Context information displayed
5. User can navigate to full context view

## 🎨 **Visual Design Guidelines**

### **Icons and Colors:**
- 📄 Context icon for task-context relationships
- 🔗 Link icon for navigation between task/context
- Use primary color for context-related actions
- Consistent badge styling for context indicators

### **Layout Considerations:**
- Context tab only appears when relevant
- Context actions in dropdown to avoid clutter
- Hover states for context indicators
- Mobile-responsive context information cards

## ✅ **Implementation Checklist**

### **Phase 1: Context → Task**
- [ ] Create `CreateTaskFromContextModal.vue`
- [ ] Add GraphQL mutation hooks
- [ ] Update `ContextEntriesTable.vue` actions
- [ ] Add task creation success flow
- [ ] Test context-task association

### **Phase 2: Task → Context**
- [ ] Create `TaskContextView.vue`
- [ ] Update task detail components
- [ ] Add conditional context tab logic
- [ ] Implement context navigation links
- [ ] Test context information display

### **Phase 3: Enhanced Views**
- [ ] Update `MyTasksPage.vue` with context indicators
- [ ] Enhance project task views
- [ ] Add context filtering options
- [ ] Implement quick context previews
- [ ] Mobile responsiveness testing

### **Quality Assurance:**
- [ ] TypeScript compilation
- [ ] Unit tests for new components
- [ ] Integration tests for workflows
- [ ] UI/UX review
- [ ] Performance testing

## 🚀 **Expected Outcomes**

1. **Seamless Workflow:** Users can create tasks directly from context items
2. **Enhanced Traceability:** Tasks show their source context information
3. **Improved Navigation:** Easy movement between tasks and related context
4. **Better Organization:** Clear visual indicators of task-context relationships
5. **Increased Productivity:** Reduced friction in task creation and context association

This implementation will create a powerful bidirectional relationship between tasks and context, enhancing the overall project management capabilities of the application.

---

## 🚀 **Implementation Status Update**

### ✅ **COMPLETED WORK**

#### **Phase 1: Context → Task Creation (COMPLETE)**
- ✅ **CreateTaskFromContextModal.vue**: Full modal component with form validation
- ✅ **ContextEntriesTable.vue**: Enhanced with "Create Task" action button
- ✅ **GraphQL Integration**: CREATE_TASK_FROM_CONTEXT_MUTATION added and generated
- ✅ **Type Safety**: Full TypeScript integration with generated hooks

#### **Phase 2: Task → Context View (COMPLETE)**
- ✅ **TaskContextView.vue**: Context display component with metadata and navigation
- ✅ **TaskEditPanel.vue**: Enhanced with conditional Context tab
- ✅ **TaskCard.vue**: Added context indicator badge
- ✅ **Progressive Enhancement**: Graceful handling for current task queries

### 🔄 **CURRENT STATE**
- **Build Status**: ✅ All components compile successfully
- **Type Safety**: ✅ No TypeScript errors
- **GraphQL**: ✅ Mutations and hooks generated properly
- **UI Integration**: ✅ Components properly integrated

### 📝 **NEXT STEPS** (Future Enhancement)
- Update backend GraphQL task queries to include context fields
- Add context query by contextId for loading context details
- Enhance context search and filtering in task creation
