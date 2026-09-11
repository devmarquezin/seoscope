import { useState } from 'react'
import { AnalysisResults } from '../components/AnalysisResults'
import { AnalysisSummary } from '../components/AnalysisSummary'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { LoadingAnalysis } from '../components/LoadingAnalysis'
import { UrlForm } from '../components/UrlForm'
import { analyzeUrl, SeoApiError } from '../services/seoApi'
import type { SEOAnalysis } from '../types/analysis'

type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; analysis: SEOAnalysis }

export function Home() {
  const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' })

  async function handleAnalyze(url: string) {
    setRequestState({ status: 'loading' })

    try {
      const analysis = await analyzeUrl(url)
      setRequestState({ status: 'success', analysis })
    } catch (error) {
      const message =
        error instanceof SeoApiError
          ? error.message
          : 'Ocorreu um erro inesperado. Tente novamente.'

      setRequestState({ status: 'error', message })
    }
  }

  function handleInputChange() {
    if (requestState.status === 'error' || requestState.status === 'success') {
      setRequestState({ status: 'idle' })
    }
  }

  const isLoading = requestState.status === 'loading'
  const serverError =
    requestState.status === 'error' ? requestState.message : undefined

  return (
    <div className="min-h-screen bg-seo-bg text-seo-text">
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
        <Hero />
        <UrlForm
          isLoading={isLoading}
          serverError={serverError}
          onAnalyze={handleAnalyze}
          onInputChange={handleInputChange}
        />

        {isLoading && <LoadingAnalysis />}

        {requestState.status === 'success' && (
          <>
            <AnalysisSummary analysis={requestState.analysis} />
            <AnalysisResults results={requestState.analysis.results} />
          </>
        )}

        <div className="mt-16 flex max-w-4xl flex-col gap-3 border-t border-seo-border pt-6 text-sm text-seo-text/60 sm:flex-row sm:items-center sm:gap-6">
          <span>8 verificações técnicas</span>
          <span className="hidden text-seo-border sm:inline" aria-hidden="true">•</span>
          <span>Uma página por análise</span>
          <span className="hidden text-seo-border sm:inline" aria-hidden="true">•</span>
          <span>Resultados não armazenados</span>
        </div>
      </main>
    </div>
  )
}
