'use client'

import { useThemeStore } from '@/providers/theme-store'
import { Moon, Sun } from 'lucide-react'

import Button from './ui/button'

const ThemeButton = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useThemeStore(state => state)
  return <Button className={className} icon={theme === 'dark' ? <Sun /> : <Moon />} onTap={toggleTheme} />
}

export default ThemeButton
