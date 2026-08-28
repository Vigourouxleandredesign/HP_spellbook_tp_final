import { SpellbookScene } from '@/scenes/SpellbookScene'
import { SearchBar } from '@/components/SearchBar'
import { SpellControls } from '@/components/SpellControls'
import { About } from '@/components/About'

export function BookView() {
  return (
    <>
      <SearchBar />
      <SpellbookScene />
      <SpellControls />
      <About />
    </>
  )
}
