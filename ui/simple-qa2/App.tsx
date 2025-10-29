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

