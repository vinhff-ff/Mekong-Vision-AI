import { useEffect, useRef, useState } from 'react'

export interface TMPrediction {
  className:   string
  probability: number
}

declare const tmImage: {
  load: (modelURL: string, metadataURL: string) => Promise<{
    predict: (video: HTMLVideoElement) => Promise<TMPrediction[]>
  }>
}

export function useTMClassifier() {
  const modelRef = useRef<{ predict: (video: HTMLVideoElement) => Promise<TMPrediction[]> } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    tmImage
      .load('/model/model.json', '/model/metadata.json')
      .then(m => {
        if (mounted) {
          modelRef.current = m
          setReady(true)
        }
      })
      .catch(err => console.error('Model load error:', err))
    return () => { mounted = false }
  }, [])

  const predict = async (video: HTMLVideoElement): Promise<TMPrediction[]> => {
    if (!modelRef.current) return []
    return modelRef.current.predict(video)
  }

  return { ready, predict }
}