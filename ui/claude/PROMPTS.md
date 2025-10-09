
# Building a TrustGraph App with Claude Code

This is a transcript of working prompts that successfully built a React chat
application using TrustGraph.

![Screenshot](screenshot.png)

## Prompts

```
Create a React application in this directory. Use:
- Typescript
- Vite

This might work:

npx --yes create-vite . --template react-ts
```

---

```
Downgrade to React 18
```

---

```
Install @trustgraph/react-state and read the README.
```

---

```
Update vite.config.ts to proxy to the TrustGraph websocket in line with the
README you just read.
```

---

```
Now replace the React app placeholder page with a real application:

Chat Interface: Build a classic conversational UI with:
- A scrollable message list displaying the conversation history
- User messages displayed on the right side in blue
- Agent responses displayed on the left side in dark gray
- Auto-scrolling to the latest message
- An input field for message entry at the bottom
- A "Send" button that also responds to the Enter/Return key
- Loading state showing "Sending..." on the button while processing
- Disabled input during message submission

Use the TrustGraph GraphRAG service to provide messages. Use collection 'default' flow 'default'. Operate as user 'trustgraph'.
```

---

```
Run npm build and fix any problems
```

---

```
It overflows the screen top and bottom, can you fix?
```

## Trying to do it in a single prompt

```
Create a TODO list and execute the following steps:
- Create a React application in this directory. Use:
  - Typescript
  - Vite
  This might work: npx --yes create-vite . --template react-ts
- Check the React version and downgrade to React 18
- Install @trustgraph/react-state and read the README.  Make sure you know
  how to build TrustGraph apps.
- Update vite.config.ts to proxy to the TrustGraph websocket in line with
  the README you just read.
- Now replace the React app placeholder page with a real application.
  The requirements are below:
- Once you have the app ready, run npm build and fix any problems until
  it's a clean build
- Review the finished app styling and make sure it is centered and neatly
  contained within the screen without overflow.

** REQUIREMENTS **

Chat Interface: Build a classic conversational UI with:
- A scrollable message list displaying the conversation history
- User messages displayed on the right side in blue
- Agent responses displayed on the left side in dark gray
- Auto-scrolling to the latest message
- An input field for message entry at the bottom
- A "Send" button that also responds to the Enter/Return key
- Loading state showing "Sending..." on the button while processing
- Disabled input during message submission

Use the TrustGraph GraphRAG service to provide messages.
Use collection 'default' flow 'default'.
Operate as user 'trustgraph'.
```

## Tips

### Managing Non-Determinism
- Coding models are non-deterministic. Accept that errors happen, and
  work out how to find them. (Hint: get code assistants to write tests).
- It may not look the same twice running.
- Writing multiple components might produce different approaches in the
  same app, so get the code assistant to write a tech spec for common
  styles and approaches.

### Effective Prompting
- **Be specific**: Instead of "fix the styling", say "center the chat
  container and prevent vertical overflow"
- **Break down complex tasks**: Use TODO lists for multi-step work - this
  helps the assistant track progress and ensures nothing is missed
- **Provide context**: Share relevant file paths, error messages, or
  screenshots
- **Iterate incrementally**: Build features step-by-step rather than
  requesting everything at once

### Working with Code
- **Read before write**: Always ask the assistant to read existing code/docs
  first to understand patterns and conventions
- **Review generated code**: Check that the assistant's changes align with
  your project's architecture
- **Run and validate**: Execute builds, tests, and linting after changes -
  catch issues early
- **Version control**: Commit working states frequently so you can roll back
  if needed

### Troubleshooting
- When stuck, ask the assistant to search the codebase for similar
  implementations
- Request the assistant to read error logs and trace the issue systematically
- If an approach isn't working, explicitly ask to try a different strategy
- Use the assistant to write debugging code or add detailed logging

### Productivity Tips
- Batch related questions together to reduce context switching
- Keep the assistant focused on one problem domain at a time
- Use the assistant to generate boilerplate, tests, and documentation
- Ask for explanations of unfamiliar code or patterns to learn as you go

