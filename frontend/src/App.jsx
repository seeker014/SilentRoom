import { Routes, Route , useLocation , useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import ProtectedLayout from './components/ProtectedLayout';
import Navbar from "./components/Navbar";
import Notifications from "./pages/Notifications";
import CreatePost from './pages/CreatePost'; 
import AdminDashboard from "./pages/AdminDashboard";
import MyPosts from "./pages/MyPosts";
import SinglePost from "./pages/SinglePost";
import { useAuth } from "./context/AuthContext";
import Messages from "./pages/Messages";
import LandingPage from "./pages/LandingPage";

function App() {
  const { user } = useAuth();
  const Navigate = useNavigate();
  const location = useLocation();
    const hideNavbarRoutes = ["/login", "/signup","/", "/admin/dashboard"];
    const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
    <div className="flex flex-col min-h-screen">
            {!shouldHideNavbar && <Navbar />}
    <Routes>
      <Route path="/signup" element={<Signup hideNavbar />} />
      <Route path="/login" element={<Login hideNavbar />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route
    path="/admin/dashboard"
    element={
        user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
    }
    />
      <Route element={<ProtectedLayout />}>
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/chat/:partnerId" element={<Chat />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/posts/:postId" element={<SinglePost />} />
      <Route path="/myposts" element={<MyPosts />} />
       </Route>
    </Routes>
    </div>
    </>
  );
}

export default App;
