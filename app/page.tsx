'use client'

import Button from '@/components/ui/button'
import { useThemeStore } from '@/providers/theme-store'
import { Moon, Sun } from 'lucide-react'

const HomePage = () => {
  const { theme, toggleTheme } = useThemeStore(state => state)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h3 className="font-bold">Welcome to bngrid!</h3>
      <Button icon={theme === 'dark' ? <Sun /> : <Moon />} onTap={toggleTheme}>
        {theme === 'dark' ? 'light' : 'dark'}
      </Button>
    </div>
  )
}

export default HomePage
