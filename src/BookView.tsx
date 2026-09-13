import { SpellbookScene } from '@/scenes/SpellbookScene'
import { SearchBar } from '@/components/SearchBar'
import { SpellControls } from '@/components/SpellControls'
import { About } from '@/components/About'
import { useSpellKeyboard } from '@/hooks/useSpellNavigation'

export function BookView() {
  useSpellKeyboard()

  return (
    <>
      <SearchBar />
      <SpellbookScene />
      <SpellControls />
      <About />
    </>
  )
}
