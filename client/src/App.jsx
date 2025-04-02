import { Topnavbar } from './components/Top-Navbar';
import './styles/topnavbar.css';
import './styles/global.css';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';



function App() {
  return (
    <SocketProvider >
      <AuthProvider>

        <Topnavbar />

      </AuthProvider>
    </SocketProvider>

  )
}

export default App
