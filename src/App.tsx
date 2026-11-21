import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './componets/AuthContext';
import { Navbar } from './componets/navbar/navbar';

function App () {
  const handleTggleSidebar = () => {
    console.log('Toggle sidebar');
  };
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar onToggleSidebar={handleTggleSidebar} />
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
