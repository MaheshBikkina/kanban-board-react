import { useNavigate } from 'react-router-dom'
import { Layers } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
        <Layers className="w-7 h-7 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="text-gray-500 dark:text-gray-400">Page not found</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">
        Back to Dashboard
      </button>
    </div>
  )
}
