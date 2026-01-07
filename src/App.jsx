import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';
import About from './pages/About';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Login from './pages/Admin/Login';
import Editor from './pages/Admin/Editor';
import CustomCursor from './components/UiEffects/CustomCursor';
import { isAdminAuthenticated } from './firebase';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <CustomCursor />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Post />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Login />} />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
