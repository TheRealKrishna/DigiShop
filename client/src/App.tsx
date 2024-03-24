import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Signup from './components/auth/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { login } from './redux/slices/userSlice';
import { GET_USER } from './graphql/queries/userQueries';
import Loader from './components/loaders/Loader';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Products from './components/home/layout/Products/Products';
import { GET_PRODUCTS } from './graphql/queries/productQueries';
import { setProducts } from './redux/slices/productsSlice';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Product from './components/product/Product';
import DevelopmentBuild from "./components/modals/DevelopmentBuild"
import Cart from './components/cart/Cart';

function App() {
  const dispatch = useDispatch()
  const { loading: userLoading, error: userError, data: userData, refetch: refetchUser } = useQuery(GET_USER);
  const { loading: productsLoading, error: productsError, data: productsData, refetch: refetchProducts } = useQuery(GET_PRODUCTS);
  useEffect(() => {
    refetchUser()
    refetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname])

  if (userLoading || productsLoading) {
    return (<Loader />)
  }
  else {
    if (userError) {
      localStorage.removeItem("auth_token")
    }
    if (!userError) {
      dispatch(login(userData.user))
    }
    if (!productsError) {
      dispatch(setProducts(productsData.products))
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
      <DevelopmentBuild/>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><Products /></>} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/product/:id" element={<><Navbar /><Product /></>} />
        <Route path="/user/cart" element={<><Navbar /><Cart /></>} />
      </Routes>
    </Router>
  );
}

export default App;
