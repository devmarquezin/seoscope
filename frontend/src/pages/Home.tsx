import { useState } from 'react'
import { AnalysisResults } from '../components/AnalysisResults'
import { AnalysisSummary } from '../components/AnalysisSummary'
import { EmptyAnalysis } from '../components/EmptyAnalysis'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { LoadingAnalysis } from '../components/LoadingAnalysis'
import { UrlForm } from '../components/UrlForm'
import { Footer } from '../components/layout/Footer'
import { Card, CardContent } from '../components/ui/card'
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
    <div id="inicio" className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <Card id="analisar" className="scroll-mt-28 overflow-hidden border-border/90 bg-surface/90">
          <CardContent className="relative p-6 sm:p-9 lg:p-10">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(67,215,230,0.08),transparent_70%)] lg:block" aria-hidden="true" />
            <div className="relative max-w-3xl">
              <Hero />
              <UrlForm
                isLoading={isLoading}
                serverError={serverError}
                onAnalyze={handleAnalyze}
                onInputChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading && <LoadingAnalysis />}

        {requestState.status === 'idle' && <div className="mt-8"><EmptyAnalysis /></div>}

        {requestState.status === 'success' && (
          <>
            <AnalysisSummary analysis={requestState.analysis} />
            <AnalysisResults results={requestState.analysis.results} />
          </>
        )}

        <div id="recursos" className="mt-16 flex scroll-mt-28 flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
          <span>8 verificações técnicas</span>
          <span className="hidden text-border sm:inline" aria-hidden="true">•</span>
          <span>Uma página por análise</span>
          <span className="hidden text-border sm:inline" aria-hidden="true">•</span>
          <span>Resultados não armazenados</span>
        </div>
      </main>
      <Footer />
    </div>
  )
}
