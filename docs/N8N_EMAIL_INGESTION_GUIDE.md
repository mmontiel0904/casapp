# n8n Email Ingestion Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the n8n workflow that processes email screenshots uploaded through the CasApp email ingestion feature. The workflow will receive webhook data, process images with AI, extract structured information, and send status updates back to the application.

## Architecture Overview

```
CasApp Frontend → Backend API → n8n Webhook → AI Processing → Callback Updates → CasApp Backend → Frontend Updates
```

## 1. Webhook Payload Structure

### Incoming Payload (from CasApp to n8n)

The frontend sends this payload to your n8n webhook endpoint:

```json
{
  "projectId": "project-uuid-123",
  "screenshots": [
    {
      "originalName": "email-screenshot-1.png",
      "tempUrl": "https://your-app.com/temp/uploads/abc123.png",
      "size": 2048576,
      "mimeType": "image/png",
      "uploadId": "upload-1-1692454800000"
    }
  ],
  "options": {
    "extractAttachments": true,
    "createCategories": true,
    "enhancedOcr": true,
    "accountingProcess": "accounts-payable",
    "processingSpeed": "balanced"
  },
  "callbackUrl": "https://your-app.com/api/webhooks/email-ingestion/callback",
  "timestamp": "2025-08-19T10:30:00.000Z",
  "source": "email-ingestion",
  "requestId": "email-ingestion-1692454800000-abc123def"
}
```

### Callback Payload Structure (n8n to CasApp)

Send these payloads to the `callbackUrl` to update processing status:

```json
{
  "requestId": "email-ingestion-1692454800000-abc123def",
  "status": "processing",
  "step": "ocr-extraction",
  "message": "Extracting text from images using OCR...",
  "progress": 25,
  "timestamp": "2025-08-19T10:31:00.000Z"
}
```

## 2. n8n Workflow Structure

### Node Configuration

#### 1. Webhook Trigger Node
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Path**: `/email-ingestion`
- **Response Mode**: Return response immediately
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Processing started",
    "requestId": "{{$json.requestId}}"
  }
  ```

#### 2. Validation Node
- **Node Type**: Code (JavaScript)
- **Purpose**: Validate incoming payload structure
- **Code**:
```javascript
// Validate required fields
const requiredFields = ['projectId', 'screenshots', 'callbackUrl', 'requestId'];
const payload = items[0].json;

for (const field of requiredFields) {
  if (!payload[field]) {
    throw new Error(`Missing required field: ${field}`);
  }
}

// Validate screenshots array
if (!Array.isArray(payload.screenshots) || payload.screenshots.length === 0) {
  throw new Error('At least one screenshot is required');
}

return items;
```

#### 3. Send Initial Status Node
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `{{$json.callbackUrl}}`
- **Body**:
```json
{
  "requestId": "{{$json.requestId}}",
  "status": "processing",
  "step": "initialization",
  "message": "Processing started - preparing images...",
  "progress": 0,
  "timestamp": "{{$now}}"
}
```

#### 4. Download Images Node
- **Node Type**: Code (JavaScript)
- **Purpose**: Download images from temporary URLs
- **Code**:
```javascript
const screenshots = items[0].json.screenshots;
const downloadedImages = [];

for (const screenshot of screenshots) {
  try {
    const response = await fetch(screenshot.tempUrl);
    if (!response.ok) {
      throw new Error(`Failed to download ${screenshot.originalName}`);
    }
    
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    downloadedImages.push({
      ...screenshot,
      base64Data: base64,
      dataUrl: `data:${screenshot.mimeType};base64,${base64}`
    });
  } catch (error) {
    console.error(`Failed to download ${screenshot.originalName}:`, error);
    throw error;
  }
}

return [{
  json: {
    ...items[0].json,
    downloadedImages
  }
}];
```

#### 5. OCR Processing Node
- **Node Type**: HTTP Request (or specific OCR service node)
- **Purpose**: Extract text from images
- **Configuration for Google Vision API**:
  - **Method**: POST
  - **URL**: `https://vision.googleapis.com/v1/images:annotate`
  - **Headers**: 
    ```json
    {
      "Authorization": "Bearer {{$env.GOOGLE_CLOUD_API_KEY}}",
      "Content-Type": "application/json"
    }
    ```
  - **Body**:
    ```json
    {
      "requests": [
        {{#each downloadedImages}}
        {
          "image": {
            "content": "{{base64Data}}"
          },
          "features": [
            {
              "type": "TEXT_DETECTION",
              "maxResults": 1
            }
          ]
        }{{#unless @last}},{{/unless}}
        {{/each}}
      ]
    }
    ```

#### 6. Send OCR Status Update
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `{{$json.callbackUrl}}`
- **Body**:
```json
{
  "requestId": "{{$json.requestId}}",
  "status": "processing",
  "step": "ocr-complete",
  "message": "Text extraction completed",
  "progress": 30,
  "timestamp": "{{$now}}"
}
```

#### 7. AI Analysis Node
- **Node Type**: OpenAI or similar AI service
- **Purpose**: Analyze extracted text and structure email data
- **Configuration for OpenAI**:
  - **Model**: gpt-4
  - **System Prompt**:
    ```
    You are an AI assistant specialized in analyzing email content for accounting purposes. 
    Extract structured information from the provided email text and classify it according to accounting processes.
    
    Return a JSON response with the following structure:
    {
      "emailData": {
        "sender": "email address or name",
        "subject": "email subject",
        "date": "ISO date string",
        "body": "email body content",
        "attachments": ["list of attachment names if mentioned"]
      },
      "accountingClassification": {
        "process": "accounts-payable|accounts-receivable|expense-report|invoice|receipt|other",
        "category": "office-supplies|travel|utilities|etc",
        "amount": "numerical amount if found",
        "currency": "currency code",
        "vendor": "vendor name if applicable",
        "dueDate": "due date if found"
      },
      "extractedEntities": {
        "companies": ["list of company names"],
        "amounts": ["list of monetary amounts"],
        "dates": ["list of dates found"],
        "references": ["invoice numbers, PO numbers, etc"]
      },
      "confidence": 0.95,
      "summary": "Brief summary of the email content"
    }
    ```
  - **User Message**: `Analyze this email text: {{$json.extractedText}}`

#### 8. Send Analysis Status Update
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `{{$json.callbackUrl}}`
- **Body**:
```json
{
  "requestId": "{{$json.requestId}}",
  "status": "processing", 
  "step": "ai-analysis-complete",
  "message": "AI analysis completed",
  "progress": 70,
  "timestamp": "{{$now}}"
}
```

#### 9. Category Creation (Conditional)
- **Node Type**: Code (JavaScript)
- **Condition**: `{{$json.options.createCategories}} === true`
- **Purpose**: Create categories based on AI analysis
- **Code**:
```javascript
const analysisResult = items[0].json.aiAnalysis;
const categories = [];

// Create categories based on accounting classification
if (analysisResult.accountingClassification.category) {
  categories.push({
    name: analysisResult.accountingClassification.category,
    type: 'accounting-category',
    confidence: analysisResult.confidence
  });
}

// Create vendor category if identified
if (analysisResult.accountingClassification.vendor) {
  categories.push({
    name: analysisResult.accountingClassification.vendor,
    type: 'vendor',
    confidence: analysisResult.confidence
  });
}

return [{
  json: {
    ...items[0].json,
    createdCategories: categories
  }
}];
```

#### 10. Save to Database Node
- **Node Type**: HTTP Request
- **Purpose**: Save processed data to your application's database
- **Method**: POST
- **URL**: `{{$env.CASAPP_API_URL}}/api/email-ingestion/save`
- **Headers**:
```json
{
  "Authorization": "Bearer {{$env.CASAPP_API_TOKEN}}",
  "Content-Type": "application/json"
}
```
- **Body**:
```json
{
  "projectId": "{{$json.projectId}}",
  "requestId": "{{$json.requestId}}",
  "emailData": "{{$json.aiAnalysis.emailData}}",
  "accountingClassification": "{{$json.aiAnalysis.accountingClassification}}",
  "extractedEntities": "{{$json.aiAnalysis.extractedEntities}}",
  "categories": "{{$json.createdCategories}}",
  "originalScreenshots": "{{$json.screenshots}}",
  "processingOptions": "{{$json.options}}",
  "confidence": "{{$json.aiAnalysis.confidence}}",
  "summary": "{{$json.aiAnalysis.summary}}"
}
```

#### 11. Send Completion Status
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `{{$json.callbackUrl}}`
- **Body**:
```json
{
  "requestId": "{{$json.requestId}}",
  "status": "completed",
  "step": "processing-complete",
  "message": "Email processing completed successfully",
  "progress": 100,
  "timestamp": "{{$now}}",
  "data": {
    "emailData": "{{$json.aiAnalysis.emailData}}",
    "summary": "{{$json.aiAnalysis.summary}}",
    "confidence": "{{$json.aiAnalysis.confidence}}",
    "categoriesCreated": "{{$json.createdCategories.length}}"
  }
}
```

#### 12. Error Handling Node
- **Node Type**: HTTP Request
- **Trigger**: On workflow error
- **Method**: POST
- **URL**: `{{$json.callbackUrl}}`
- **Body**:
```json
{
  "requestId": "{{$json.requestId}}",
  "status": "error",
  "step": "error",
  "message": "Processing failed: {{$json.error.message}}",
  "timestamp": "{{$now}}",
  "error": "{{$json.error.message}}",
  "retryable": true
}
```

## 3. Environment Variables Required

Set these environment variables in your n8n instance:

```bash
# API Keys
GOOGLE_CLOUD_API_KEY=your-google-cloud-api-key
OPENAI_API_KEY=your-openai-api-key

# CasApp Integration
CASAPP_API_URL=https://your-app.com
CASAPP_API_TOKEN=your-api-token-for-authentication

# Optional: Alternative OCR Services
AZURE_COMPUTER_VISION_KEY=your-azure-key
AWS_TEXTRACT_ACCESS_KEY=your-aws-key
```

## 4. Backend Webhook Endpoint Implementation

You'll need to implement this endpoint in your CasApp backend:

### POST `/api/webhooks/email-ingestion/callback`

```typescript
// Example Express.js implementation
app.post('/api/webhooks/email-ingestion/callback', async (req, res) => {
  try {
    const { requestId, status, step, message, progress, data, error } = req.body;

    // Validate webhook signature (recommended)
    // const isValid = validateWebhookSignature(req);
    // if (!isValid) return res.status(401).json({ error: 'Invalid signature' });

    // Update processing status in database
    await updateEmailIngestionStatus(requestId, {
      status,
      step,
      message,
      progress,
      data,
      error,
      timestamp: new Date()
    });

    // Send real-time update to frontend (WebSocket/SSE)
    await broadcastStatusUpdate(requestId, {
      status,
      step,
      message,
      progress,
      data,
      error
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## 5. Frontend Integration Updates

### Update the useEmailIngestion composable

Replace the simulation with real-time updates:

```typescript
// Add WebSocket connection for real-time updates
const setupStatusUpdates = (requestId: string) => {
  const ws = new WebSocket(`${wsUrl}/email-ingestion/${requestId}`);
  
  ws.onmessage = (event) => {
    const statusUpdate = JSON.parse(event.data);
    updateProcessingStatus(statusUpdate.step, statusUpdate.message, statusUpdate.status, statusUpdate.progress);
  };
  
  return ws;
};
```

## 6. Testing the Integration

### Test Payload

Use this test payload to verify your n8n workflow:

```bash
curl -X POST "https://your-n8n-instance.com/webhook/email-ingestion" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "test-project-123",
    "screenshots": [
      {
        "originalName": "test-email.png",
        "tempUrl": "https://via.placeholder.com/800x600/cccccc/969696?text=Test+Email",
        "size": 12345,
        "mimeType": "image/png",
        "uploadId": "test-upload-1"
      }
    ],
    "options": {
      "extractAttachments": true,
      "createCategories": true,
      "enhancedOcr": true,
      "accountingProcess": "accounts-payable",
      "processingSpeed": "balanced"
    },
    "callbackUrl": "https://your-app.com/api/webhooks/email-ingestion/callback",
    "timestamp": "2025-08-19T10:30:00.000Z",
    "source": "email-ingestion",
    "requestId": "test-request-123"
  }'
```

## 7. Security Considerations

1. **Webhook Signature Validation**: Implement HMAC signature validation for webhook callbacks
2. **Rate Limiting**: Implement rate limiting on both webhook endpoints
3. **Input Validation**: Validate all incoming data thoroughly
4. **API Key Security**: Store API keys securely in n8n environment variables
5. **Temporary File Cleanup**: Ensure temporary uploaded files are cleaned up after processing
6. **Authentication**: Secure the n8n webhook endpoint with authentication if needed

## 8. Monitoring and Logging

1. **n8n Workflow Logging**: Enable detailed logging in n8n for debugging
2. **Status Tracking**: Log all status updates in your application database
3. **Error Alerting**: Set up alerts for workflow failures
4. **Performance Monitoring**: Track processing times and success rates

## 9. Scaling Considerations

1. **Queue Management**: For high volume, consider adding a queue between webhook and processing
2. **Parallel Processing**: Process multiple screenshots concurrently where possible
3. **Resource Limits**: Set appropriate timeouts and resource limits in n8n
4. **Caching**: Cache OCR results for duplicate images

This implementation will provide a robust, production-ready email ingestion system that integrates seamlessly with your CasApp frontend.
