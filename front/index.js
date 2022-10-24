import React from 'react'
import { createRoot } from 'react-dom/client'
import Routes from './src/routes'

const element = document.getElementById('renderer')
const root = createRoot(element)

root.render(<Routes />)
