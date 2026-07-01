import { useState } from 'react'
import type { RefObject } from 'react'
import type { AIMode } from '../../types/ai'
import type { TMPrediction } from './useTMClassifier'
import { useTMClassifier } from './useTMClassifier'
import { useGreenLedger } from './useGreenLedger'
import type { LedgerEntry } from './useGreenLedger'

export interface CaptureResult {
  predictions: TMPrediction[]
  topClass: string
  entry: LedgerEntry
}

function snapFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d')!.drawImage(video, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.85)
}

export function useCaptureFlow(
  videoRef: RefObject<HTMLVideoElement | null>,
  aiMode: AIMode,
  geminiKey: string,
) {
  const { ready, predict } = useTMClassifier()
  const { addEntry } = useGreenLedger()

  const [result, setResult] = useState<CaptureResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const capture = async () => {
    if (!videoRef.current) {
      console.log('❌ videoRef null')
      return
    }
    setLoading(true)
    setError(null)
    console.log('▶ capture start, aiMode:', aiMode, 'ready:', ready)

    try {
      let predictions: TMPrediction[] = []

      if (aiMode === 'built-in') {
        if (!ready) throw new Error('Model chưa load xong')
        console.log('▶ predicting...')
        predictions = await predict(videoRef.current)
        console.log('✅ predictions:', predictions)
      } else {
        if (!geminiKey) throw new Error('Chưa nhập Gemini API key')
        const base64 = snapFrame(videoRef.current)
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    text: 'Phân loại quần áo trong ảnh. Chỉ trả về JSON {"className":"Class 1"|"Class 2"|"Class 3","probability":0.0-1.0}. Không markdown, không giải thích.',
                  },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: base64.split(',')[1],
                    },
                  },
                ],
              }],
            }),
          }
        )
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        const parsed = JSON.parse(text.trim())
        predictions = [parsed]
      }

      const sorted = [...predictions].sort((a, b) => b.probability - a.probability)
      const topClass = sorted[0].className
      const entry = addEntry(topClass)

      const captureResult: CaptureResult = { predictions: sorted, topClass, entry }
      setResult(captureResult)
      return captureResult

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setError(null) }

  return { capture, result, loading, error, ready, reset }
}