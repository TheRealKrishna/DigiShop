import Styles from "../../css/auth/Login.module.css"
import logoRectangle from "../../assets/logo/logo-rectangle.png"
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/userSlice";
import { LOGIN, LOGIN_GOOGLE } from "../../graphql/mutations/userMutations";
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [apiCalling, setApiCalling] = useState(false);
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
    const [loginMutation] = useMutation(LOGIN);
    const [loginGoogleMutation] = useMutation(LOGIN_GOOGLE);
    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false);

    const onInputsChange = (e: any) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const onGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setApiCalling(true)
            toast.promise(new Promise(async (resolve: Function, reject: Function) => {
                if (isLoggedIn) {
                    return reject("Invalid Request!")
                }
                const response: any = await loginGoogleMutation({
                    context: {
                        headers: {
                            "access_token": tokenResponse.access_token
                        }
                    },
                    variables: {cart: localStorage.getItem("cart")}
                })
                if (!response.errors) {
                    localStorage.setItem("auth_token", response.data.loginGoogle.auth_token)
                    localStorage.removeItem("cart")
                    dispatch(login(response.data.loginGoogle))
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
                },
                {
                    toastId:"loginToast"
                })
        },
    });

    const onLogin = (e: any) => {
        e.preventDefault()
        setApiCalling(true)
        toast.promise(new Promise(async (resolve: Function, reject: Function) => {
            if (isLoggedIn) {
                return reject("Invalid Request!")
            }
            const response: any = await loginMutation({ variables: credentials })
            if (!response.errors) {
                localStorage.setItem("auth_token", response.data.login.auth_token)
                localStorage.removeItem("cart")
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
            },
            {
                toastId:"loginToast"
            })
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(()=>{
        document.title = "DigiShop - Login"
    }, [])

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
                            <FaGoogle onClick={() => onGoogleLogin()} />
                            <FaFacebookF onClick={()=>toast.error("Facebook login unavailable!")} />
                            <FaXTwitter onClick={()=>toast.error("Twitter login unavailable!")} />
                            <FaLinkedinIn onClick={()=>toast.error("Linkedin login unavailable!")} />
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

