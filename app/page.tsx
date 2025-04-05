'use client'

import { useThemeStore } from '@/providers/theme-store'
import Button from '@/ui/button'
import { Check } from 'lucide-react'

export default function Home() {
  const { theme, toggleTheme } = useThemeStore(state => state)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h3 className="font-bold">Welcome to bngrid!</h3>
      <button
        onClick={toggleTheme}
        className="bg-foreground text-background pointer-events-auto rounded-md px-2 py-1"
      >
        {theme}
      </button>
      <Button className="bg-theme text-white" icon={<Check />}>
        <span>对</span>
      </Button>
    </div>
  )
}
