import type { Config } from 'tailwindcss'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        press: {
          '0%': { transform: 'scale(1)' },
          '20%, 60%': { transform: 'scale(.98)' },
          '100%': { transform: 'scale(1.02)' }
        },
        lift: {
          '0%': { transform: 'scale(1.02)' },
          '60%': { transform: 'scale(.98)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        press: 'press 600ms ease-in-out 1 forwards',
        lift: 'lift 300ms ease-in-out 1'
      },
      boxShadow: {
        light: '4px 4px 4px #d4d4d8, -4px -4px 4px #ffffff',
        dark: '4px 4px 4px #18181b, -4px -4px 4px #52525b',
        'inner-light': '4px 4px 4px #ffffff, -4px -4px 4px #d4d4d8',
        'inner-dark': '4px 4px 4px #52525b, -4px -4px 4px #18181b'
      }
    }
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['charm'])
    })
  ]
}
