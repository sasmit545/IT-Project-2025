import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Editor from './pages/editor'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Editor />   
    </>
  )
}

export default App
