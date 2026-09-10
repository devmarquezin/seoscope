import { useState, type FormEvent } from 'react'

interface UrlFormProps {
  isLoading: boolean
  serverError?: string
  onAnalyze: (url: string) => Promise<void>
  onInputChange: () => void
}

function validateUrl(value: string): string | undefined {
  if (!value) {
    return 'Informe uma URL para continuar.'
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(value)
  } catch {
    return 'Informe uma URL válida, incluindo http:// ou https://.'
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return 'Use apenas URLs com protocolo HTTP ou HTTPS.'
  }

  return undefined
}

export function UrlForm({
  isLoading,
  serverError,
  onAnalyze,
  onInputChange,
}: UrlFormProps) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState<string>()
  const errorMessage = validationError ?? serverError

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading) {
      return
    }

    const normalizedUrl = url.trim()
    const error = validateUrl(normalizedUrl)

    if (error) {
      setValidationError(error)
      return
    }

    setValidationError(undefined)
    await onAnalyze(normalizedUrl)
  }

  return (
    <form className="mt-10 max-w-4xl" onSubmit={handleSubmit} noValidate>
      <label htmlFor="page-url" className="mb-3 block text-sm font-medium text-seo-text">
        URL da página
      </label>

      <div className="rounded-2xl border border-seo-border bg-seo-surface p-2 transition-colors focus-within:border-seo-muted sm:flex sm:items-center sm:gap-2">
        <input
          id="page-url"
          name="url"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://seusite.com.br"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            onInputChange()
            if (validationError) {
              setValidationError(undefined)
            }
          }}
          disabled={isLoading}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? 'url-error' : 'url-help'}
          className="h-13 w-full rounded-xl border border-transparent bg-seo-bg px-4 text-base text-seo-text outline-none transition-colors placeholder:text-seo-muted/70 focus:border-seo-muted disabled:cursor-wait disabled:opacity-70"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-13 w-full rounded-xl bg-seo-text px-6 font-semibold text-seo-bg outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-seo-text focus-visible:ring-offset-2 focus-visible:ring-offset-seo-surface disabled:cursor-wait disabled:bg-seo-muted sm:mt-0 sm:w-auto sm:min-w-39"
        >
          {isLoading ? 'Analisando...' : 'Analisar site'}
        </button>
      </div>

      {errorMessage ? (
        <p id="url-error" className="mt-3 flex items-start gap-2 text-sm text-red-400" role="alert">
          <span aria-hidden="true">×</span>
          <span>{errorMessage}</span>
        </p>
      ) : (
        <p id="url-help" className="mt-3 text-sm text-seo-text/60">
          Use uma URL completa com HTTP ou HTTPS.
        </p>
      )}
    </form>
  )
}
