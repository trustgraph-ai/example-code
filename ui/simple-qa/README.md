# TrustGraph Simple Q&A App

A minimal example demonstrating how to build a TrustGraph-powered application. This app uses the `useInference` hook to send questions to an LLM and display responses.

## What This App Does

This is a simple question-and-answer interface that:
- Takes a user question as input
- Sends it to TrustGraph's LLM inference API using `textCompletion`
- Displays the AI-generated response

## Prerequisites

- Node.js 18+ installed
- A running TrustGraph API gateway on `localhost:8088`
- Basic familiarity with React

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open http://localhost:5173 in your browser and start asking questions!

## How This App is Built

### Project Structure

```
simple-qa/
├── src/
│   ├── main.jsx       # Entry point with provider setup
│   ├── App.jsx        # Main Q&A component
│   ├── App.css        # Styling
│   └── index.css      # Global styles
├── vite.config.js     # Vite config with WebSocket proxy
└── package.json       # Dependencies
```

### Key Components

#### 1. Provider Setup (`src/main.jsx`)

The app wraps the component tree with three essential providers:

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider, NotificationProvider } from '@trustgraph/react-state'

const queryClient = new QueryClient()

const notificationHandler = {
  success: (message) => console.log('Success:', message),
  error: (message) => console.error('Error:', message),
  warning: (message) => console.warn('Warning:', message),
  info: (message) => console.info('Info:', message)
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider handler={notificationHandler}>
      <SocketProvider user="trustgraph">
        <App />
      </SocketProvider>
    </NotificationProvider>
  </QueryClientProvider>
)
```

**Provider Roles:**
- **QueryClientProvider**: Manages data fetching and caching (from TanStack Query)
- **NotificationProvider**: Handles success/error notifications (using console logging in this example)
- **SocketProvider**: Establishes WebSocket connection to TrustGraph API gateway
  - `user="trustgraph"`: Sets the user identifier
  - `apiKey` is optional for local development

#### 2. Main Component (`src/App.jsx`)

The core Q&A interface uses the `useInference` hook:

```javascript
import { useInference } from '@trustgraph/react-state'

function App() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')

  const { textCompletion, isLoading } = useInference()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setResponse('')
    try {
      const result = await textCompletion({
        systemPrompt: 'You are a helpful assistant.',
        input: question
      })
      setResponse(result)
      setQuestion('')
    } catch (error) {
      setResponse('Error: ' + error.message)
    }
  }

  // ... render form and response display
}
```

**Key Features:**
- `useInference()` provides access to LLM inference methods
- `textCompletion()` sends a question to the LLM with a system prompt
- `isLoading` can be used to show loading states (available but not used in this minimal example)

#### 3. WebSocket Proxy (`vite.config.js`)

TrustGraph requires a WebSocket connection to `/api/socket`, which is proxied to the API gateway:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/socket': {
        target: 'ws://localhost:8088',
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/socket/, '/api/v1/socket'),
      },
    },
  },
})
```

**Why This Matters:**
- The TrustGraph client connects to `ws://localhost:5173/api/socket` (your dev server)
- Vite proxies this to `ws://localhost:8088/api/v1/socket` (TrustGraph API gateway)
- This avoids CORS issues and simplifies development

## Building Your Own TrustGraph App

### Step-by-Step Guide

#### 1. Create a New Vite Project

```bash
npm create vite@latest my-trustgraph-app -- --template react
cd my-trustgraph-app
```

#### 2. Install TrustGraph Dependencies

```bash
# TrustGraph uses React 18
npm install react@^18.0.0 react-dom@^18.0.0

# Install TrustGraph packages
npm install @trustgraph/react-state @trustgraph/react-provider @trustgraph/client

# Install peer dependencies
npm install @tanstack/react-query zustand
```

#### 3. Configure WebSocket Proxy

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/socket': {
        target: 'ws://localhost:8088',
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/socket/, '/api/v1/socket'),
      },
    },
  },
})
```

**Production Note:** In production, configure your web server (nginx, Apache, etc.) to proxy `/api/socket` to your TrustGraph API gateway.

#### 4. Set Up Providers

Create `src/main.jsx`:

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider, NotificationProvider } from '@trustgraph/react-state'
import App from './App.jsx'

const queryClient = new QueryClient()

const notificationHandler = {
  success: (msg) => console.log('✓', msg),
  error: (msg) => console.error('✗', msg),
  warning: (msg) => console.warn('⚠', msg),
  info: (msg) => console.info('ℹ', msg),
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationProvider handler={notificationHandler}>
      <SocketProvider user="your-username">
        <App />
      </SocketProvider>
    </NotificationProvider>
  </QueryClientProvider>
)
```

#### 5. Build Your First Component

Create `src/App.jsx`:

```javascript
import { useState } from 'react'
import { useInference } from '@trustgraph/react-state'

function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const { textCompletion } = useInference()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await textCompletion({
      systemPrompt: 'You are a helpful assistant.',
      input
    })
    setOutput(result)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Ask</button>
      </form>
      <div>{output}</div>
    </div>
  )
}

export default App
```

#### 6. Run Your App

```bash
npm run dev
```

Visit http://localhost:5173 and start building!

## Understanding TrustGraph Hooks

This example uses `useInference`, but TrustGraph provides many more hooks:

### Inference & Chat
- **`useInference()`** - Low-level LLM operations (textCompletion, graphRag, agent)
- **`useChatSession()`** - High-level chat session management
- **`useConversation()`** - Chat state (messages, input, mode)

### Document Management
- **`useLibrary()`** - Upload, delete, and manage documents
- **`useProcessing()`** - Track document processing status

### Knowledge Graph
- **`useEntityDetail()`** - Get entity details from the graph
- **`useGraphSubgraph()`** - Query graph subgraphs
- **`useVectorSearch()`** - Perform vector similarity searches
- **`useTriples()`** - Query RDF triples

### Configuration
- **`useSettings()`** - Application settings (user, collection, etc.)
- **`useFlows()`** - Manage processing flows
- **`useLLMModels()`** - Configure LLM models

For complete documentation, see: [`node_modules/@trustgraph/react-state/README.md`](node_modules/@trustgraph/react-state/README.md)

## Advanced Patterns

### Using GraphRAG Instead of Text Completion

Replace `textCompletion` with `graphRag` to query your knowledge graph:

```javascript
const { graphRag } = useInference()
const { settings } = useSettings()

const result = await graphRag({
  input: question,
  options: {
    entityLimit: 10,
    tripleLimit: 10
  },
  collection: settings.collection
})
```

### Building a Chat Interface

For a more sophisticated chat experience, use `useChatSession`:

```javascript
import { useConversation, useChatSession } from '@trustgraph/react-state'

function ChatApp() {
  const messages = useConversation((state) => state.messages)
  const input = useConversation((state) => state.input)
  const setInput = useConversation((state) => state.setInput)
  const { submitMessage, isSubmitting } = useChatSession()

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.role}: {msg.text}</div>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={() => submitMessage({ input })}
        disabled={isSubmitting}
      >
        Send
      </button>
    </div>
  )
}
```

### Adding Custom Notifications

Replace console logging with a toast library like react-hot-toast:

```javascript
import toast from 'react-hot-toast'

const notificationHandler = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  warning: (msg) => toast(msg, { icon: '⚠️' }),
  info: (msg) => toast(msg),
}
```

### Deploying to Production

#### Build for Production

```bash
# Create optimized production build
npm run build

# This creates a 'dist' folder with static files ready to deploy
```

The build output is a static site that can be hosted on any web server (nginx, Apache, Cloudflare Pages, etc.).

#### Production WebSocket Configuration

In production, you need to configure your web server to proxy `/api/socket` to your TrustGraph API gateway. Here's a complete nginx example:

```nginx
# /etc/nginx/sites-available/trustgraph-app
server {
    listen 80;
    server_name your-domain.com;

    # Serve the React app static files
    root /var/www/trustgraph-app/dist;
    index index.html;

    # Handle React Router (SPA fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy WebSocket connections to TrustGraph API gateway
    location /api/socket {
        proxy_pass http://trustgraph-api:8088/api/v1/socket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeout settings
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

}
```

**Key Configuration Points:**

1. **Static Files**: Your React app's built files are served from `/var/www/trustgraph-app/dist`
2. **WebSocket Proxy**: `/api/socket` is proxied to the TrustGraph API gateway with proper WebSocket headers
3. **Connection Headers**: `Upgrade` and `Connection` headers enable WebSocket protocol
4. **Timeouts**: Long timeout values keep WebSocket connections alive
5. **SPA Fallback**: All non-API routes fall back to `index.html` for client-side routing

#### Alternative: Docker Compose Setup

For containerized deployments:

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Your React app served by nginx
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - trustgraph-api

  # TrustGraph API gateway
  trustgraph-api:
    image: trustgraph/api-gateway:latest
    ports:
      - "8088:8088"
    environment:
      - LLM_BACKEND=openai
      - OPENAI_API_KEY=${OPENAI_API_KEY}
```

#### Apache Configuration

If using Apache instead of nginx:

```apache
# /etc/apache2/sites-available/trustgraph-app.conf
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/trustgraph-app/dist

    # Serve static files
    <Directory /var/www/trustgraph-app/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Enable WebSocket proxy modules
    # a2enmod proxy proxy_http proxy_wstunnel rewrite

    # WebSocket proxy
    ProxyPreserveHost On
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/api/socket$ ws://trustgraph-api:8088/api/v1/socket [P,L]

    # Regular API proxy
    ProxyPass /api/socket ws://trustgraph-api:8088/api/v1/socket
    ProxyPassReverse /api/socket ws://trustgraph-api:8088/api/v1/socket

    # SPA fallback for client-side routing
    FallbackResource /index.html
</VirtualHost>
```

## Common Issues

### WebSocket Connection Failed
- Ensure TrustGraph API gateway is running on `localhost:8088`
- Check that the proxy configuration in `vite.config.js` is correct
- Verify no firewall is blocking port 8088
- In production, verify nginx/Apache proxy configuration is correct

### Module Not Found Errors
- Run `npm install` to ensure all dependencies are installed
- Check that peer dependencies (@tanstack/react-query, zustand) are installed

### Empty Responses
- Check the browser console for errors
- Verify your LLM model is configured in TrustGraph settings
- Ensure the API gateway has access to an LLM backend

## Next Steps

1. **Add document upload**: Use `useLibrary()` to upload and process documents
2. **Implement knowledge graph queries**: Use `useEntityDetail()` and `useGraphSubgraph()`
3. **Build a full chat interface**: Use `useChatSession()` for conversation management
4. **Add authentication**: Configure `apiKey` in `SocketProvider`
5. **Deploy to production**: Configure nginx/Apache to proxy WebSocket connections

## Resources

- [TrustGraph React State Documentation](node_modules/@trustgraph/react-state/README.md)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Vite Documentation](https://vite.dev/)

## License

Apache 2.0
