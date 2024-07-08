
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import LandingPage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import LandingHomePage from './pages/LandingHomePage'






function App() {


  return (
    <>
    
   
   <Router>
    <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/signup' element={<SignupPage/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/home' element={<LandingHomePage/>}></Route>
     
      
    </Routes>
   </Router>

    
   
     
    </>
  )
}

export default App
