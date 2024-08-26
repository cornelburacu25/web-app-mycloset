import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import GlobalStyles from './styles/Global.styled'
import Footer from './components/Footer'
import NavbarWrapper from './components/NavbarWrapper'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className='App'>
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
      <Outlet />
      <GlobalStyles />
      <Footer />
    </div>
    )
}

export default App
