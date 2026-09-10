export type SEOCheckStatus = 'success' | 'warning' | 'error'

export interface SEOCheckResult {
  id: string
  name: string
  status: SEOCheckStatus
  score: number
  maxScore: number
  message: string
  recommendation?: string
  details?: unknown
}

export interface AnalysisSummary {
  passed: number
  warnings: number
  errors: number
}

export type AnalysisStatus =
  | 'excellent'
  | 'good'
  | 'needs-improvement'
  | 'critical'

export interface SEOAnalysis {
  url: string
  finalUrl: string
  score: number
  status: AnalysisStatus
  summary: AnalysisSummary
  statusCode: number
  contentType: string
  sizeInBytes: number
  results: SEOCheckResult[]
}

export interface ApiErrorResponse {
  error: string
  message: string
  issues?: Array<{
    path: string
    message: string
  }>
}
