import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  ResponseModality,
  type GenerativeModel,
} from 'firebase/ai'

// Cấu hình Firebase của ứng dụng PhuDong AI
export const firebaseConfig = {
  apiKey: 'AIzaSyCU5BTRRiEJRrTg_GYyw3WAqM-CQYkyxwc',
  authDomain: 'webphudongairender.firebaseapp.com',
  projectId: 'webphudongairender',
  storageBucket: 'webphudongairender.firebasestorage.app',
  messagingSenderId: '984867872091',
  appId: '1:984867872091:web:5a6071d0958bca55e1ce7e',
  measurementId: 'G-M78LX9KCRZ',
}

// Khởi tạo Firebase App (singleton an toàn)
export const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)

// Khởi tạo Analytics an toàn cho trình duyệt
export let analytics: Analytics | null = null
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app)
      }
    })
    .catch(() => {
      // Analytics không bắt buộc đối với chức năng tạo ảnh
    })
}

// Instance Firebase AI
let cachedAIModel: GenerativeModel | null = null
let cachedModelName = ''

export function getFirebaseAIModel(modelName = 'gemini-2.5-flash-image'): GenerativeModel {
  if (cachedAIModel && cachedModelName === modelName) {
    return cachedAIModel
  }
  const ai = getAI(app, { backend: new GoogleAIBackend() })
  cachedAIModel = getGenerativeModel(ai, {
    model: modelName,
    generationConfig: {
      responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE],
    },
  })
  cachedModelName = modelName
  return cachedAIModel
}

export type RenderInput = {
  imageData: string
  prompt: string
  aspect?: string
  quality?: string
  modelName?: string
  customApiKey?: string
}

export type RenderResult = {
  imageData: string
  providerUsed: 'firebase' | 'gemini' | 'openai'
  modelUsed: string
  attempts: Array<{ provider: string; status: 'success' | 'failed' }>
}

function splitImage(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/)
  if (!match) throw new Error('Định dạng ảnh không hợp lệ (hỗ trợ JPG, PNG, WebP).')
  return { mime: match[1], base64: match[2] }
}

const mapAspect = (aspect?: string) => {
  if (aspect === '1024x1024') return '1:1'
  if (aspect === '1024x1536') return '2:3'
  return '3:2'
}

/**
 * Render ảnh phối cảnh sử dụng Firebase AI Logic hoặc Gemini API
 */
export async function generateRenderWithFirebaseAI(input: RenderInput): Promise<RenderResult> {
  const { imageData, prompt, aspect = '1536x1024', quality = 'medium', modelName = 'gemini-2.5-flash-image', customApiKey } = input
  const { mime, base64 } = splitImage(imageData)
  const attempts: Array<{ provider: string; status: 'success' | 'failed' }> = []

  // 1. Thử gọi trực tiếp qua Firebase AI Logic SDK (Client-side)
  try {
    const model = getFirebaseAIModel(modelName)
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: mime,
        },
      },
    ])

    const parts = result.response.inlineDataParts()
    const genPart = parts?.[0]?.inlineData
    if (genPart?.data) {
      attempts.push({ provider: 'firebase-ai', status: 'success' })
      return {
        imageData: `data:${genPart.mimeType || 'image/webp'};base64,${genPart.data}`,
        providerUsed: 'firebase',
        modelUsed: modelName,
        attempts,
      }
    }
  } catch (error) {
    attempts.push({ provider: 'firebase-ai', status: 'failed' })
    const errMessage = error instanceof Error ? error.message : String(error)

    const isAppCheckError = errMessage.includes('App Check') || errMessage.includes('401') || errMessage.includes('UNAUTHENTICATED')
    const isServiceBlocked = errMessage.includes('API_KEY_SERVICE_BLOCKED') || errMessage.includes('PERMISSION_DENIED')

    // 2. Thử gọi qua API trực tiếp nếu có key người dùng cung cấp hoặc lưu trong bộ nhớ
    const storedFallback = typeof window !== 'undefined'
      ? (sessionStorage.getItem('phudong-gemini-fallback') || localStorage.getItem('phudong-gemini-fallback') || '')
      : ''
    const activeKey = customApiKey?.trim() || storedFallback || (isServiceBlocked ? '' : firebaseConfig.apiKey)

    if (activeKey) {
      try {
        const directRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(activeKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { inline_data: { mime_type: mime, data: base64 } },
                    { text: prompt },
                  ],
                },
              ],
              generationConfig: {
                responseModalities: ['TEXT', 'IMAGE'],
                imageConfig: {
                  aspectRatio: mapAspect(aspect),
                  imageSize: quality === 'high' ? '2K' : '1K',
                },
              },
            }),
          },
        )

        if (directRes.ok) {
          const payload = await directRes.json() as {
            modelVersion?: string
            candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string }; inline_data?: { mime_type?: string; data?: string } }> } }>
          }
          const parts = payload.candidates?.[0]?.content?.parts ?? []
          const found = parts
            .map((p) => p.inlineData ?? (p.inline_data ? { mimeType: p.inline_data.mime_type, data: p.inline_data.data } : undefined))
            .find(Boolean)

          if (found?.data) {
            attempts.push({ provider: 'gemini-direct', status: 'success' })
            return {
              imageData: `data:${found.mimeType || 'image/png'};base64,${found.data}`,
              providerUsed: 'gemini',
              modelUsed: payload.modelVersion || modelName,
              attempts,
            }
          }
        }
      } catch {
        attempts.push({ provider: 'gemini-direct', status: 'failed' })
      }
    }

    if (isAppCheckError) {
      throw new Error(
        'Firebase AI cần kích hoạt App Check hoặc Gemini Developer API cho dự án "webphudongairender" trong Firebase Console (https://console.firebase.google.com/). Bạn cũng có thể dán trực tiếp Gemini API Key vào ô cấu hình để render ngay.',
      )
    }

    if (isServiceBlocked) {
      throw new Error(
        'Dự án Firebase "webphudongairender" chưa bật Generative Language API trong Google Cloud Console. Hãy bật API hoặc nhập Gemini API Key từ Google AI Studio.',
      )
    }

    throw new Error(`Lỗi Firebase AI: ${errMessage}`)
  }

  throw new Error('Mô hình AI không trả về dữ liệu hình ảnh. Hãy thử lại hoặc điều chỉnh prompt.')
}
