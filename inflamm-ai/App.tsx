import { Fab, Webchat } from '@botpress/webchat'
import { useState } from 'react'

function WebchatApp() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)
  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState)
  }
  return (
    <>
      <Webchat
        clientId="e4ef10bc-d051-4579-a2bf-352bebb88b7d" // Your actual client ID
        style={{
          width: '400px',
          height: '600px',
          display: isWebchatOpen ? 'flex' : 'none',
          position: 'fixed',
          bottom: '90px',
          right: '20px',
        }}
      />
      <Fab
        onClick={() => toggleWebchat()}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '64px',
          height: '64px'
        }}
      />
    </>
  )
}

// In your main page or layout
import WebchatApp from './App'

export default function HomePage() {
  return (
    <div>
      {/* Your existing content */}
      <WebchatApp />
    </div>
  )
}
