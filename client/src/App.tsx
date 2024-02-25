import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Signup from './components/auth/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { login } from './redux/slices/loginSlice';
import { GET_USER } from './graphql/queries/userQueries';
import Loader from './components/loaders/Loader';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

function App() {
  const dispatch = useDispatch()
  const { loading, error, data } = useQuery(GET_USER);

  if (loading) {
    return (<Loader />)
  }
  else {
    if (error) {
      localStorage.removeItem("auth_token")
    }
    if (!error) {
      dispatch(login(data.user))
    }
  }

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
