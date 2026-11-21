import './App.css';
import { AuthProvider } from './componets/AuthContext';
import { Navbar } from './componets/navbar/navbar';

function App () {
  const handleTggleSidebar = () => {
    console.log('Toggle sidebar');
  };
  return (
    <AuthProvider>
    <Navbar onToggleSidebar={handleTggleSidebar}/>
    <main>
      <h1>Music Streaming App</h1>
    </main>
    </AuthProvider>
  );
}
  <main>
      <h1>Music Streaming App</h1>
  </main>
export default App;