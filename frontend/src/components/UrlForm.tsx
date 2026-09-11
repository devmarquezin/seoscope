import { useState, type FormEvent } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { Alert } from './ui/alert'
import { Button } from './ui/button'
import { Input } from './ui/input'

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
    <form className="mt-8" onSubmit={handleSubmit} noValidate>
      <label htmlFor="page-url" className="mb-2.5 block text-sm font-medium text-foreground">
        URL da página
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
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
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full px-6 sm:w-auto"
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
          {isLoading ? 'Analisando...' : 'Analisar site'}
        </Button>
      </div>

      {errorMessage ? (
        <Alert id="url-error" variant="destructive" className="mt-3">{errorMessage}</Alert>
      ) : (
        <p id="url-help" className="mt-3 text-sm text-muted-foreground">
          Use uma URL completa com HTTP ou HTTPS.
        </p>
      )}
    </form>
  )
}
