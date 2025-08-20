# Email Ingestion Feature - Implementation Guide

This document provides a complete overview of the email ingestion feature implementation, including all components, usage, and integration details.

## 🎯 **Feature Overview**

The email ingestion feature allows users to upload email screenshots that are processed by AI to extract and categorize email information into the ProjectMind context system.

### **Key Features**
- ✅ Drag-and-drop email screenshot upload
- ✅ Project-specific email ingestion  
- ✅ AI-powered OCR and email parsing
- ✅ Automatic accounting process classification
- ✅ Real-time processing status tracking
- ✅ n8n workflow integration
- ✅ Comprehensive error handling

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue Frontend  │───▶│   n8n Webhook   │───▶│   FreshAPI      │
│                 │    │                 │    │   ProjectMind   │
│ • File Upload   │    │ • OCR Processing│    │ • Email Context │
│ • UI Components │    │ • AI Analysis   │    │ • Database      │
│ • Status Track  │    │ • Classification│    │ • GraphQL API   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Component Structure**

```
src/components/
├── email/
│   ├── EmailIngestionOptions.vue      # Processing configuration
│   └── ProcessingStatusTracker.vue    # Real-time status updates
├── modals/
│   └── EmailIngestionModal.vue        # Main ingestion interface
└── ui/
    ├── FileDropZone.vue              # Drag-and-drop file upload
    ├── FilePreviewGrid.vue           # File preview with thumbnails
    └── ProjectSelector.vue           # Project selection dropdown
```

## 🚀 **Usage Guide**

### **1. Access Email Ingestion**

**From Projects Page:**
- Click "Ingest Emails" button in header
- Or click "Add Emails" on any project card

**From Project Detail:**
- Navigate to project → Email Context section
- Click "Ingest Emails" button

### **2. Upload Process**

1. **Select Project**: Choose target project from dropdown
2. **Upload Screenshots**: Drag-and-drop or click to browse
3. **Configure Options**: Set processing preferences
4. **Start Processing**: Click "Start Processing" button

### **3. Processing Options**

```typescript
interface EmailIngestionOptions {
  extractAttachments: boolean      // Extract attachment info
  createCategories: boolean        // Auto-create categories  
  enhancedOcr: boolean            // Enhanced text recognition
  accountingProcess: string       // Preferred process type
  processingSpeed: 'fast' | 'balanced' | 'quality'
}
```

## 🔧 **Component API Reference**

### **EmailIngestionModal**

```vue
<EmailIngestionModal 
  :is-open="showModal"
  :project-id="selectedProjectId"  
  @close="handleClose"
  @success="handleSuccess"
  @error="handleError"
/>
```

**Props:**
- `isOpen: boolean` - Modal visibility state
- `projectId?: string` - Pre-selected project ID

**Events:**
- `close()` - Modal closed
- `success(result)` - Processing completed successfully  
- `error(error)` - Processing failed

### **FileDropZone**

```vue
<FileDropZone
  v-model="files"
  accept="image/*"
  :multiple="true"
  :max-files="10"
  :max-size="10485760"
  @files-selected="handleFiles"
  @error="handleError"
/>
```

**Props:**
- `modelValue: File[]` - Selected files array
- `accept: string` - File type filter
- `multiple: boolean` - Allow multiple files
- `maxFiles: number` - Maximum file count
- `maxSize: number` - Maximum file size in bytes

### **ProjectSelector**

```vue
<ProjectSelector
  v-model="selectedProject"
  label="Target Project"
  :required="true"
  @change="handleProjectChange"
/>
```

## 🔌 **n8n Integration**

### **Webhook Payload**

```json
{
  "projectId": "uuid",
  "screenshots": [
    {
      "originalName": "email-screenshot-1.png",
      "tempUrl": "https://app.domain.com/api/temp/files/abc123",
      "size": 1024768,
      "mimeType": "image/png",
      "uploadId": "upload-1-1234567890"
    }
  ],
  "options": {
    "extractAttachments": true,
    "createCategories": true,
    "enhancedOcr": false,
    "accountingProcess": "AP",
    "processingSpeed": "balanced"
  },
  "callbackUrl": "https://app.domain.com/api/webhooks/email-ingestion/callback",
  "timestamp": "2025-08-19T10:30:00Z",
  "source": "casapp-ui",
  "requestId": "email-ingestion-1234567890-abc123"
}
```

### **Expected Response**

```json
{
  "success": true,
  "message": "Processing started successfully",
  "requestId": "email-ingestion-1234567890-abc123",
  "estimatedTime": 120
}
```

### **Callback to FreshAPI**

n8n should call the ProjectMind webhook with extracted data:

```json
{
  "project_id": "uuid",
  "from_email": "vendor@example.com",
  "from_name": "Vendor Name",
  "to_emails": ["accounting@company.com"],
  "subject": "Invoice #12345 - Office Supplies",
  "full_message": "Email body content...",
  "accounting_process": "AP",
  "ai_summary": "Invoice from office supply vendor for $1,250.75",
  "confidence_score": 0.92,
  "category_name": "Vendor Invoices",
  "extracted_metadata": {
    "invoice_number": "12345",
    "amount": "$1,250.75",
    "due_date": "2025-09-18"
  }
}
```

## ⚙️ **Configuration**

### **Environment Variables**

```bash
# n8n Integration
VITE_N8N_EMAIL_WEBHOOK_URL=https://n8n.yourcompany.com/webhook/email-processing

# File Upload Limits
VITE_MAX_FILE_SIZE=10485760         # 10MB
VITE_ALLOWED_IMAGE_TYPES=image/png,image/jpeg,image/jpg,image/webp

# API Configuration  
VITE_API_BASE_URL=https://api.yourcompany.com
```

### **File Upload Configuration**

- **Supported formats**: PNG, JPG, JPEG, WebP
- **Maximum file size**: 10MB per file
- **Maximum files**: 10 files per batch
- **Processing timeout**: 5 minutes

## 🎨 **Styling & Design**

### **DaisyUI Components Used**
- `modal` - Main modal container
- `card` - Content sections
- `btn` - Action buttons  
- `alert` - Status messages
- `progress` - Processing indicators
- `select` - Project dropdown
- `checkbox` - Option toggles

### **Custom Styling**
- Gradient backgrounds for visual appeal
- Smooth transitions and hover effects
- Responsive grid layouts
- Loading states and animations

## 🧪 **Testing**

### **Component Testing**

```bash
# Test file upload
npm test FileDropZone.spec.ts

# Test project selection  
npm test ProjectSelector.spec.ts

# Test modal interactions
npm test EmailIngestionModal.spec.ts
```

### **Integration Testing**

```bash
# Test full ingestion flow
npm test email-ingestion.e2e.ts

# Test n8n webhook integration
npm test n8n-integration.spec.ts
```

## 🐛 **Error Handling**

### **Common Error Scenarios**

1. **File Upload Errors**
   - File too large
   - Invalid file type
   - Network upload failure

2. **Processing Errors**
   - n8n webhook unavailable
   - OCR processing failure
   - API timeout

3. **Validation Errors**
   - No project selected
   - No files uploaded
   - Invalid processing options

### **Error Recovery**

- Automatic retry for transient failures
- Clear error messages with guidance
- Option to cancel long-running processes
- Graceful degradation for partial failures

## 📈 **Performance Considerations**

### **Optimization Strategies**

1. **File Handling**
   - Progressive image loading
   - Client-side image compression
   - Chunked upload for large files

2. **UI Performance**
   - Virtual scrolling for file lists
   - Debounced search inputs
   - Lazy component loading

3. **Memory Management**
   - Cleanup preview URLs on unmount
   - Limit concurrent uploads
   - Clear processing history

## 🔮 **Future Enhancements**

### **Planned Features**

1. **Batch Processing**
   - Process multiple projects simultaneously
   - Queue management for large batches
   - Priority-based processing

2. **Advanced AI Options**
   - Custom OCR models
   - Multi-language support
   - Confidence threshold settings

3. **Integration Improvements**
   - Real-time WebSocket updates
   - Progress streaming from n8n
   - Webhook retry mechanisms

4. **User Experience**
   - Email template recognition
   - Smart category suggestions
   - Processing history dashboard

## 📚 **Development Notes**

### **Adding New Processing Options**

1. Update `EmailIngestionOptions` interface
2. Add UI controls in `EmailIngestionOptions.vue`
3. Update n8n workflow to handle new options
4. Update documentation

### **Extending File Support**

1. Update `accept` prop in FileDropZone
2. Add validation in `processFiles` method
3. Update environment variables
4. Test with new file types

### **Custom Status Tracking**

1. Extend `ProcessingStatus` interface
2. Add new status types in tracker component
3. Implement real-time updates
4. Add appropriate UI feedback

---

This email ingestion feature provides a complete, production-ready solution for AI-powered email processing with excellent user experience and robust error handling.
