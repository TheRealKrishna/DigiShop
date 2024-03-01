import Styles from "../../css/auth/Signup.module.css"
import logoRectangle from "../../assets/logo/logo-rectangle.png"
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/loginSlice";
import { LOGIN_GOOGLE, SIGN_UP } from "../../graphql/mutations/userMutations";
import { useGoogleLogin } from "@react-oauth/google";

export default function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [apiCalling, setApiCalling] = useState(false)
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })
    const isLoggedIn = useSelector((state: any) => state.login.isLoggedIn);
    const [SignUpMutation] = useMutation(SIGN_UP)
    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false)
    const [loginGoogleMutation] = useMutation(LOGIN_GOOGLE)

    const onInputsChange = (e: any) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const onGoogleSignup = useGoogleLogin({
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
                    }
                })
                if (!response.errors) {
                    localStorage.setItem("auth_token", response.data.loginGoogle.auth_token)
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
                    pending: 'Creating Account...',
                    success: 'Logged in successfully!',
                    error: {
                        render: (error: any) => error.data
                    }
                })
        },
    });


    const onSignUp = (e: any) => {
        e.preventDefault()
        setApiCalling(true)
        toast.promise(new Promise(async (resolve: Function, reject: Function) => {
            const response: any = await SignUpMutation({ variables: credentials })
            if (!response.errors) {
                localStorage.setItem("auth_token", response.data.createAccount.auth_token)
                dispatch(login(response.data.createAccount))
                setApiCalling(false)
                return resolve()
            }
            else {
                setApiCalling(false)
                return reject(response.errors[0].message)
            }
        }),
            {
                pending: 'Creating your account...',
                success: 'Account successfully created!',
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

    useEffect(()=>{
        document.title = "DigiShop - Singup"
    }, [])

    return (
        <div className={Styles.signUpPage}>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.signUpContainer}>
                <div className={Styles.leftContainer}>
                    <div className={Styles.vectorText}>
                        <h2>Hello Stranger!</h2>
                        <p>Join us today and unlock a world of shopping convenience and exclusive deals.</p>
                    </div>
                    {/* <div className={Styles.vectorImageContainer}>
                        <img src={vectorImage} alt="" />
                    </div>   */}
                    <div className={Styles.loginButtonContainer}>
                        <Link to={"/auth/login"}><button>LOG IN</button></Link>
                    </div>
                </div>
                <div className={Styles.rightContainer}>
                    <div className={Styles.logoContainer}>
                        <Link to={"/"}>
                            <img src={logoRectangle} alt="" />
                        </Link>
                    </div>
                    <div className={Styles.signUpContent}>
                        <h2>Create Account</h2>
                        <div className={Styles.otherLoginIcons}>
                            <FaGoogle onClick={() => onGoogleSignup()} />
                            <FaFacebookF onClick={() => toast.error("Facebook login unavailable!")} />
                            <FaXTwitter onClick={() => toast.error("Twitter login unavailable!")} />
                            <FaLinkedinIn onClick={() => toast.error("Linkedin login unavailable!")} />
                        </div>
                        <div className={Styles.orText}>OR</div>
                        <form className={Styles.signUpForm} onSubmit={onSignUp}>
                            <div className={Styles.nameInputContainer}>
                                <FiUser />
                                <input type="text" required minLength={3} name="name" value={credentials.name} onChange={onInputsChange} placeholder="Name" />
                            </div>
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
                            <p className={Styles.privacyText}>By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.</p>
                            <div className={Styles.signUpButtonContainer}>
                                <button disabled={apiCalling} type="submit">SIGN UP</button>
                            </div>
                        </form>
                        <div className={Styles.mobileLoginButtonContainer}>
                            <div className={Styles.orText}>OR</div>
                            <Link to={"/auth/login"}><button>LOGIN</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

