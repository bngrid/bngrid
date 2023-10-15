import type { Config } from 'tailwindcss'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        press: {
          '0%': { transform: 'scale(1)' },
          '20%, 60%': { transform: 'scale(.95)' },
          '100%': { transform: 'scale(1.05)' }
        },
        lift: {
          '0%': { transform: 'scale(1.05)' },
          '60%': { transform: 'scale(.95)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        press: 'press 600ms ease-in-out 1 forwards',
        lift: 'lift 300ms ease-in-out 1'
      }
    }
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['charm'])
    })
  ]
}
