import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SEOAnalysis, SEOCheckResult } from '../types/analysis'
import { Home } from './Home'
import { TooltipProvider } from '../components/ui/tooltip'

const results: SEOCheckResult[] = [
  {
    id: 'title',
    name: 'Title',
    status: 'success',
    score: 20,
    maxScore: 20,
    message: 'O título está adequado.',
  },
  {
    id: 'meta-description',
    name: 'Meta Description',
    status: 'warning',
    score: 8,
    maxScore: 15,
    message: 'A descrição pode ser melhorada.',
    recommendation: 'Aumente o conteúdo da descrição.',
  },
  {
    id: 'h1',
    name: 'H1',
    status: 'success',
    score: 15,
    maxScore: 15,
    message: 'A página possui um H1.',
  },
  {
    id: 'heading-hierarchy',
    name: 'Heading Hierarchy',
    status: 'success',
    score: 10,
    maxScore: 10,
    message: 'A hierarquia está adequada.',
  },
  {
    id: 'image-alt',
    name: 'Image Alt Text',
    status: 'warning',
    score: 10,
    maxScore: 15,
    message: 'Algumas imagens não possuem alt.',
  },
  {
    id: 'canonical',
    name: 'Canonical',
    status: 'error',
    score: 0,
    maxScore: 10,
    message: 'A página não possui canonical.',
  },
  {
    id: 'open-graph',
    name: 'Open Graph',
    status: 'error',
    score: 0,
    maxScore: 10,
    message: 'As propriedades Open Graph estão ausentes.',
  },
  {
    id: 'https',
    name: 'HTTPS',
    status: 'success',
    score: 5,
    maxScore: 5,
    message: 'A página utiliza HTTPS.',
  },
]

const analysis: SEOAnalysis = {
  url: 'https://example.com',
  finalUrl: 'https://example.com/',
  score: 68,
  status: 'needs-improvement',
  summary: {
    passed: 4,
    warnings: 2,
    errors: 2,
  },
  statusCode: 200,
  contentType: 'text/html',
  sizeInBytes: 1250,
  results,
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

function submitUrl(url: string) {
  fireEvent.change(screen.getByLabelText('URL da página'), {
    target: { value: url },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Analisar site' }))
}

function renderHome() {
  return render(<TooltipProvider><Home /></TooltipProvider>)
}

describe('Home', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('valida uma URL vazia antes de chamar a API', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderHome()
    fireEvent.click(screen.getByRole('button', { name: 'Analisar site' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Informe uma URL para continuar.',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('valida protocolos diferentes de HTTP e HTTPS', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderHome()
    submitUrl('ftp://example.com')

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Use apenas URLs com protocolo HTTP ou HTTPS.',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('exibe o carregamento e impede envios duplicados', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined))
    vi.stubGlobal('fetch', fetchMock)

    renderHome()
    submitUrl('https://example.com')

    const button = screen.getByRole('button', { name: 'Analisando...' })

    expect(button).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('Analisando página...')

    fireEvent.click(button)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('apresenta o resumo e todas as verificações da análise', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(analysis))
    vi.stubGlobal('fetch', fetchMock)

    renderHome()
    submitUrl(' https://example.com ')

    expect(await screen.findByText('Análise concluída')).toBeInTheDocument()
    expect(screen.getByText('68')).toBeInTheDocument()
    expect(screen.getByText('Precisa melhorar')).toBeInTheDocument()
    expect(screen.getByText('8 resultados')).toBeInTheDocument()
    const titleTrigger = screen.getByRole('button', { name: /^Title Aprovado/ })

    expect(titleTrigger.closest('h3')).toBeInTheDocument()
    expect(titleTrigger.querySelector('div, h1, h2, h3, h4, h5, h6, p')).toBeNull()
    expect(screen.getByRole('heading', { name: /^HTTPS Aprovado/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Meta Description/ }))
    expect(await screen.findByText('Aumente o conteúdo da descrição.')).toBeInTheDocument()
    expect(screen.getAllByRole('progressbar')).toHaveLength(3)
    expect(fetchMock).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ url: 'https://example.com' }),
    })
  })

  it('apresenta a mensagem devolvida pela API em caso de erro', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          error: 'fetch_failed',
          message: 'Não foi possível acessar a página informada.',
        },
        502,
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    renderHome()
    submitUrl('https://example.com')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível acessar a página informada.',
    )
  })

  it('limpa o resultado anterior e permite iniciar uma nova análise', async () => {
    const secondAnalysis: SEOAnalysis = {
      ...analysis,
      finalUrl: 'https://openai.com/',
      score: 95,
      status: 'excellent',
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(analysis))
      .mockResolvedValueOnce(jsonResponse(secondAnalysis))
    vi.stubGlobal('fetch', fetchMock)

    renderHome()
    submitUrl('https://example.com')

    expect(await screen.findByText('example.com')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('URL da página'), {
      target: { value: 'https://openai.com' },
    })

    await waitFor(() => {
      expect(screen.queryByText('example.com')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Analisar site' }))

    expect(await screen.findByText('openai.com')).toBeInTheDocument()
    expect(screen.getByText('95')).toBeInTheDocument()
    expect(screen.getByText('Excelente')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
