
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'


function App() {


  return (
    <>
   <Router>
    <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/signup' element={<SignupPage/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
    </Routes>
   </Router>

    
   
     
    </>
  )
}

export default App
