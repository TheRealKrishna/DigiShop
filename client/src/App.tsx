import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import SignUp from './components/auth/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gql, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/slices/loginSlice';

function App() {
  const dispatch = useDispatch()
  const authToken = localStorage.getItem('auth_token');
  const { loading, error, data } = useQuery(gql`
    query Query {
      user {
        id
        name
        email
        auth_token
      }
    }
    `, {
    context: {
      headers: {
        "auth_token": authToken ? authToken : "",
        "Content-Type": "application/json"
      }
    },
  }
  )
  if (loading) {
    return (
      <div className="loader-Container">
        <span className="loader"></span>
      </div>
    )
  }
  else if (error) {
    localStorage.removeItem("auth_token")
  }
  else if (!error) {
    dispatch(login(data.user))
  }

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
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
        <Route path="/auth/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
