'use client'

import Button from '@/components/ui/button'
import Text from '@/components/ui/text'
import { useThemeStore } from '@/providers/theme-store'
import { Moon, Sun } from 'lucide-react'

const HomePage = () => {
  const { theme, toggleTheme } = useThemeStore(state => state)
  async function setTheme() {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toggleTheme()
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h3 className="text-xl font-bold">Welcome to bngrid!</h3>
      <Button icon={theme === 'dark' ? <Sun /> : <Moon />} onTap={setTheme}>
        <Text>{theme === 'dark' ? 'light' : 'dark'}</Text>
      </Button>
    </div>
  )
}

export default HomePage
