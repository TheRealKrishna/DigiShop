import Styles from "../../css/auth/Login.module.css"
import logoRectangle from "../../assets/logo/Digishop-Logo-Rectangle.png"
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/loginSlice";
import { LOGIN } from "../../graphql/mutations/userMutations";

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [apiCalling, setApiCalling] = useState(false)
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const isLoggedIn = useSelector((state: any) => state.login.isLoggedIn);
    const [loginMutation] = useMutation(LOGIN)

    const onInputsChange = (e: any) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false)

    const onLogin = (e: any) => {
        e.preventDefault()
        setApiCalling(true)
        toast.promise(new Promise(async (resolve: Function, reject: Function) => {
            const response: any = await loginMutation({ variables: credentials })
            if (!response.errors) {
                localStorage.setItem("auth_token", response.data.login.auth_token)
                dispatch(login(response.data.login))
                setApiCalling(false)
                return resolve()
            }
            else {
                setApiCalling(false)
                return reject(response.errors[0].message)
            }
        }),
            {
                pending: 'Logging In...',
                success: 'Logged in successfully!',
                error: {
                    render: (error: any) => error.data
                }
            })
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);


    return (
        <div className={Styles.loginPage}>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.loginContainer}>
                <div className={Styles.leftContainer}>
                    <div className={Styles.logoContainer}>
                        <Link to={"/"}>
                        <img src={logoRectangle} alt="" />
                        </Link>
                    </div>
                    <div className={Styles.loginContent}>
                        <h2>Login</h2>
                        <div className={Styles.otherLoginIcons}>
                            <FaGoogle />
                            <FaFacebookF />
                            <FaXTwitter />
                            <FaLinkedinIn />
                        </div>
                        <div className={Styles.orText}>OR</div>
                        <form className={Styles.loginForm} onSubmit={onLogin}>
                            <div className={Styles.emailInputContainer}>
                                <HiOutlineMail />
                                <input type="email" required name="email" value={credentials.email} onChange={onInputsChange} placeholder="Email" />
                            </div>
                            <div className={Styles.passwordInputContainer}>
                                <RiLockPasswordLine />
                                <input type={passwordVisibility ? "text" : "password"} required minLength={8} name="password" value={credentials.password} onChange={onInputsChange} placeholder="Password" />
                                {
                                    passwordVisibility ? <FaRegEyeSlash onClick={() => setPasswordVisibility(!passwordVisibility)} style={{ cursor: "pointer" }} /> : <FaRegEye onClick={() => setPasswordVisibility(!passwordVisibility)} style={{ cursor: "pointer" }} />
                                }
                            </div>
                            <Link to={"/auth/forgot-password"} className={Styles.forgotPassword}>→ Forgot Your Password? ←</Link>
                            <div className={Styles.loginButtonContainer}>
                                <button disabled={apiCalling} type="submit">LOGIN</button>
                            </div>
                        </form>
                        <div className={Styles.mobileSignUpButtonContainer}>
                            <div className={Styles.orText}>OR</div>
                            <Link to={"/auth/signup"}><button>SIGN UP</button></Link>
                        </div>
                    </div>
                </div>
                <div className={Styles.rightContainer}>
                    <div className={Styles.vectorText}>
                        <h2>Welcome Back!</h2>
                        <p>Sign in to access your shopping cart and manage your orders.</p>
                    </div>
                    {/* <div className={Styles.vectorImageContainer}>
                        <img src={vectorImage} alt="" />
                    </div>   */}
                    <div className={Styles.signupButtonContainer}>
                        <Link to={"/auth/signup"}><button>SIGN UP</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

