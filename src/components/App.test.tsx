import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('renders something', () => {
  const { getByText } = render(<App />)
  const fretSelector = getByText(/frets/i)
  expect(fretSelector).toBeInTheDocument()
})
