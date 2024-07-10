
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import LandingPage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import LandingHomePage from './pages/LandingHomePage'
import ProfilePage from './pages/ProfilePage'
import ForgotPasswordForm from './components/login/ForgotPassword'






function App() {


  return (
    <>
    
   
   <Router>
    <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/signup' element={<SignupPage/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/home' element={<LandingHomePage/>}></Route>
      <Route path='/profile' element={<ProfilePage/>}></Route>
      <Route path='/forgot' element={<ForgotPasswordForm/>}></Route>
     
      
    </Routes>
   </Router>

    
   
     
    </>
  )
}

export default App
