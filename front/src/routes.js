import React from 'react'
import { HashRouter, Route, Routes as Container } from 'react-router-dom'
import BankerPage from './pages/Banker'
import CommonPlayerPage from './pages/CommonPlayer'
import HomePage from './pages/Home'

export default function Routes() {
  return (
    <HashRouter>
      <Container>
        <Route path="/" element={<HomePage />} />
        <Route path="banker" element={<BankerPage />} />
        <Route path="common-player" element={<CommonPlayerPage />} />
      </Container>
    </HashRouter>
  )
}
