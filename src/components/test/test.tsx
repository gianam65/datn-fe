import React, { useEffect, useRef } from 'react'

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const ws = useRef<WebSocket>()

  useEffect(() => {
    const connectWithDelay = () => {
      setTimeout(() => {
        ws.current = new WebSocket('ws://localhost:8765')

        ws.current.onopen = () => {
          console.log('Connected to the server')
          captureAndSendFrame() // Start capturing frames after the connection is established
        }

        ws.current.onerror = (event) => {
          console.error('WebSocket error:', event)
          // Handle or attempt to reconnect the WebSocket here
        }

        ws.current.onclose = (event) => {
          console.log('WebSocket closed:', event)
          // Handle or attempt to reconnect the WebSocket here
        }

        const captureAndSendFrame = () => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            navigator.mediaDevices
              .getUserMedia({ video: true })
              .then((stream) => {
                if (videoRef.current) {
                  videoRef.current.srcObject = stream
                }
                const video = videoRef.current
                if (video) {
                  video.onloadedmetadata = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    canvas
                      .getContext('2d')
                      ?.drawImage(video, 0, 0, canvas.width, canvas.height)
                    const imageSrc = canvas.toDataURL('image/jpeg')
                    ws.current?.send(imageSrc)
                    setTimeout(captureAndSendFrame, 100) // Capture frames continuously
                  }
                }
              })
              .catch((err) => {
                console.error('Error accessing the camera:', err)
              })
          }
        }
      }, 5000) // 5-second delay
    }

    connectWithDelay()

    return () => {
      if (ws.current) {
        ws.current.close() // Close the WebSocket connection on component unmount
      }
    }
  }, [])

  if (ws.current) {
    ws.current.onmessage = (event) => {
      const receivedData = event.data
      console.log('Received data from server:', receivedData)
      // Handle the received data here
    }
  }

  return (
    <div>
      <video autoPlay playsInline ref={videoRef} />
    </div>
  )
}

export default WebcamFeed
