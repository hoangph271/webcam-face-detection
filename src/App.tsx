import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as faceapi from 'face-api.js'
import type { StyledFC } from './types'

const WebcamFacer: StyledFC = (props) => {
  const { className } = props
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hasFace, setHasFace] = useState(false)

  useEffect(() => {
    navigator.getUserMedia({ video: true }, async stream => {
      const videoEl = videoRef.current

      if (!videoEl) throw new Error('videoRef.current is null')

      videoEl.srcObject = stream

      videoEl.addEventListener('play', async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        console.info('loadFromUri()')

        const detectSingleFace = async () => {
          try {
            const detection = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())

            if (detection) {
              console.info(detection.box)
              setHasFace(true)
            } else {
              requestAnimationFrame(() => {
                detectSingleFace()
              })
            }
          } catch (error) {
            console.error(error)
            detectSingleFace()
          }
        }

        detectSingleFace()
      })
    }, e => {
      console.error(e)
    })
  }, [])

  return (
    <div className={className}>
      {hasFace && (
        <div>
          <button>
            Start...!
          </button>
        </div>
      )}
      <video width={600} height={450} ref={videoRef} autoPlay />
    </div>
  )
}
const StyledWebcamFacer = styled(WebcamFacer)`
  videp {
    background-color: black;
  }
`

const App: StyledFC = (props) => {
  const { className } = props

  return (
    <div className={className} data-testid="App">
      <StyledWebcamFacer />
    </div>
  )
}

const StyledApp = styled(App)`
  font-family: 'Courier New', Courier, monospace;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(background.jpg);
  background-size: cover;

  h4 {
    font-size: xx-large;
  }
  h4, p {
    font-weight: bold;
    text-align: center;
  }
`

export default StyledApp
