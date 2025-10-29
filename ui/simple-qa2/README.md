
# Creating a TrustGraph app with React 19

## Setup Vite

Create an empty directory.  In that directory initialise Vite:

```
npx --yes create-vite . --template react-ts
```

- Prompted to install rolldown-vite? Say yes.
- Install and run now? No.

## Install base packages

```
npm install
```

## Install TrustGraph

This pulls in 3 TrustGraph packages plus TanStack and other supporting stuff:

```
npm install @trustgraph/react-state
```

## Setup Providers

This is base configuration in the application.  Find src/main.tsx and look at the top of that file.  After all the imports, add:

```
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider, NotificationProvider } from '@trustgraph/react-state'

const queryClient = new QueryClient()

const notificationHandler = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
  warning: (message: string) => console.warn('Warning:', message),
  info: (message: string) => console.info('Info:', message)
}
```

At the bottom of the file is a createRoot expression.  Change it to
look like this:

```
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider handler={notificationHandler}>
        <SocketProvider user="trustgraph">
          <App />
        </SocketProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
)
```

This initialises the TrustGraph websocket, TanStack query, and a notification
provider.  The notification provider provides a way to catch messages and get
them to the user, but we're just dumping everything to the console log.  If
you're having problems later, you'll open the console.

## Proxy websocket

The client app is going to talk to TrustGraph, which you should have running
locally.  TrustGraph API socket will be on port8088.  And we're going to set
it up so that the local URL /api/socket is proxied to the TrustGraph socket.
Find vite.config.js and the plugins part, and add the server block below

```
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

## Modify the app code

Replace src/App.tsx with this:

```
import { useState } from 'react'
import { useInference } from '@trustgraph/react-state'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')

  const { textCompletion } = useInference()

  const handleSubmit = async (e: React.FormEvent) => {
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
      setResponse('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="app">
      <h1>TrustGraph Q&A</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="question-input"
        />
        <button type="submit">Submit</button>
      </form>

      <textarea
        value={response}
        readOnly
        placeholder="Response will appear here..."
        className="response-output"
        rows={10}
      />
    </div>
  )
}

export default App
```

## Run it

At this point you're ready to run

```
npm run dev
```

The output shows you a URL to visit, and you should see a screen like this:

![screenshot.png](screenshot)

Type something like "What is cheese" in the question box, and click Submit.
After an LLM round-trip you should see the answer in the response box.

## Production

So far, this app is running in 'dev' mode. The roadmap to production depends hugely on what you're building, but some common problems will be:

* You need to be able to serve the 'compiled' React app.
* You need to be able to make sure that websocket connections make it through
  to TrustGraph.
* The websocket is in a different domain than the React app. 
* Authentication.

A simple approach is to use a web-server with websocket proxy built-in.
By having the websocket proxy in the same URL domain as the React app, there
are no cross-domain problems to deal with.

We can use nginx to proxy /api/socket websockets off to the TrustGraph system
which has advantages in a) scaling up nginx services allows scaling up
websocket load management and b) the TrustGraph gateway doesn't have to be
exposed to the internet.

In this directory you will see an `nginx.conf` file which includes
configuration for websocket proxying.  There is also a Containerfile
to build a container which is a good way of deploying a React app with
nginx.

