import logo from './logo.svg';
import './App.css';
import{ BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPAge';
import { Toaster } from 'react-hot-toast';
function App() {

  return (
    <>
    <div>
      <Toaster position='top-right' toastOptions={{ success: {theme: {primary: '#4caf50'}}}} />
    </div>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App;
