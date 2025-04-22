import { FlatCompat } from '@eslint/eslintrc'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-plugin-prettier/recommended'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  perfectionist.configs['recommended-natural'],
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error'
    }
  }
]

export default config
