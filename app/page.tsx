'use client'

import { useThemeStore } from '@/providers/theme-store'
import Button from '@/ui/button'
import { Check, Moon, Sun } from 'lucide-react'

export default function Home() {
  const { theme, toggleTheme } = useThemeStore(state => state)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h3 className="font-bold">Welcome to bngrid!</h3>
      <Button icon={theme === 'dark' ? <Sun /> : <Moon />} onTap={toggleTheme}>
        {theme}
      </Button>
    </div>
  )
}
