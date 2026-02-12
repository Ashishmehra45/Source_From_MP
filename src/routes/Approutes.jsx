import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import GIGalleryFull from '../pages/Gi'
import ODOP from '../pages/ODOP'
import ExporterRegistration from '../pages/Register'


function Approutes() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/gi' element={<GIGalleryFull />} />
      <Route path='/odop' element={<ODOP />} />
      <Route path='/register' element={<ExporterRegistration />} />
      
    </Routes>
  )
}

export default Approutes
