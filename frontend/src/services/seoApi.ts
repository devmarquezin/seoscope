import type { ApiErrorResponse, SEOAnalysis } from '../types/analysis'

export class SeoApiError extends Error {
  readonly status: number | undefined
  readonly code: string | undefined

  constructor(
    message: string,
    status?: number,
    code?: string,
  ) {
    super(message)
    this.name = 'SeoApiError'
    this.status = status
    this.code = code
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    typeof value.error === 'string' &&
    typeof value.message === 'string'
  )
}

function isSEOAnalysis(value: unknown): value is SEOAnalysis {
  return (
    isRecord(value) &&
    typeof value.url === 'string' &&
    typeof value.finalUrl === 'string' &&
    typeof value.score === 'number' &&
    typeof value.status === 'string' &&
    isRecord(value.summary) &&
    Array.isArray(value.results)
  )
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function analyzeUrl(url: string): Promise<SEOAnalysis> {
  let response: Response

  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
  } catch {
    throw new SeoApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend está em execução.',
    )
  }

  const body = await readJson(response)

  if (!response.ok) {
    if (isApiErrorResponse(body)) {
      throw new SeoApiError(body.message, response.status, body.error)
    }

    throw new SeoApiError(
      'Não foi possível concluir a análise. Tente novamente.',
      response.status,
    )
  }

  if (!isSEOAnalysis(body)) {
    throw new SeoApiError('O servidor retornou uma resposta inesperada.')
  }

  return body
}
