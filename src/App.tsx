import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { SpellProvider } from '@/context/SpellContext'
import { Layout } from '@/components/Layout'
import { BookView } from '@/BookView'

function AppRoute() {
  const { slug } = useParams<{ slug?: string }>()

  return (
    <SpellProvider initialSlug={slug}>
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
