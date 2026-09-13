import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { SpellProvider, useSpellContext } from '@/context/SpellContext'
import { Layout } from '@/components/Layout'
import { BookView } from '@/BookView'
import { findSpellIndex } from '@/utils/findSpellIndex'

function SlugGuard() {
  const { slug } = useParams<{ slug?: string }>()
  const { spells, isLoading } = useSpellContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading || !slug || spells.length === 0) return
    const index = findSpellIndex(spells, slug)
    if (index < 0) {
      navigate('/', { replace: true })
      return
    }
    const canonical = spells[index]?.slug
    if (canonical && canonical !== slug) {
      navigate(`/spell/${canonical}`, { replace: true })
    }
  }, [isLoading, navigate, slug, spells])

  return null
}

function AppRoute() {
  const { slug } = useParams<{ slug?: string }>()

  return (
    <SpellProvider initialSlug={slug}>
      <SlugGuard />
      <Layout>
        <BookView />
      </Layout>
    </SpellProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppRoute />} />
        <Route path="/spell/:slug" element={<AppRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
