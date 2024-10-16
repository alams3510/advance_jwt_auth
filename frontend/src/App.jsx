import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Content from "./pages/Content";
import {
  BrowserRouter,
  Route,
  Routes,
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getSessionStorage } from "./helper/sessionManage";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = JSON.parse(getSessionStorage());
    if (token) setUser(token);
    else setUser(null);

    if (token && location.pathname === "/login") {
      navigate("/");
    }
    if (!token && location.pathname === "/") {
      navigate("/login");
    }
    if (token && location.pathname === "/register") {
      navigate("/login");
    }
  }, [location]);

  return (
    <Routes>
      <Route exact path="/" element={user ? <Home /> : <Login />} />
      <Route path="/content" element={<Content />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<div>Page Not Found!</div>} />
    </Routes>
  );
}

export default App;
