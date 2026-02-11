import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import GIGalleryFull from '../pages/Gi'
import ODOP from '../pages/ODOP'


function Approutes() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/gi' element={<GIGalleryFull />} />
      <Route path='/odop' element={<ODOP />} />
      
    </Routes>
  )
}

export default Approutes
