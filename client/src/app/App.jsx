import AppRoutes from '../routes/AppRoutes'
import ComplaintsProvider from '../context/ComplaintsContext'
  import { ToastContainer } from 'react-toastify';
import TokenProvider from '../context/TokenContext';


const App = () => {
  


  return (
    <>
    <TokenProvider>
      <ComplaintsProvider>
        <AppRoutes />
      </ComplaintsProvider>
    </TokenProvider>

      <ToastContainer />
    </>
  )
}

export default App