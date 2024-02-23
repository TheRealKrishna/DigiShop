import Styles from "../../css/auth/SignUp.module.css"
import logoRectangle from "../../assets/logo/Digishop-Logo-Rectangle.png"
import vectorImage from "../../assets/auth/vector.png"
import { FaFacebookF, FaGoogle, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/loginSlice";

export default function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state: any) => state.login.isLoggedIn);

    const [signUpMutation] = useMutation(gql`
        mutation createAccount($name: String!, $email: String!, $password: String!) {
            createAccount(name: $name, email: $email, password: $password) {
                id
                name
                email
                auth_token
            }
        }
        `
    )

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })

    const onInputsChange = (e: any) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false)

    const onSignUp = (e: any) => {
        e.preventDefault()
        toast.promise(new Promise(async (resolve: any, reject: any) => {
            const response: any = await signUpMutation({ variables: credentials })
            if (!response.errors) {
                console.log(response)
                localStorage.setItem("auth_token", response.data.createAccount.auth_token)
                dispatch(login(response.data.createAccount))
                return resolve()
            }
            else {
                return reject(response.errors[0].message)
            }
        }),
            {
                pending: 'Creating your account...',
                success: 'Account successfully created!',
                error: {
                    render: (error: any) => `Error: ${error.data}`
                }
            })
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    if (isLoggedIn) {
        return null;
    }
    else {
        return (
            <div className={Styles.signUpPage}>
                <div className={Styles.circle}></div>
                <div className={Styles.circle}></div>
                <div className={Styles.circle}></div>
                <div className={Styles.circle}></div>
                <div className={Styles.signUpContainer}>
                    <div className={Styles.leftContainer}>
                        <div className={Styles.vectorText}>
                            <h2>Create Your Account!</h2>
                            <p>Join us today and unlock a world of shopping convenience and exclusive deals.</p>
                        </div>
                        {/* <div className={Styles.vectorImageContainer}>
                        <img src={vectorImage} alt="" />
                    </div>   */}
                        <div className={Styles.signInButtonContainer}>
                            <button>SIGN IN</button>
                        </div>
                    </div>
                    <div className={Styles.rightContainer}>
                        <div className={Styles.logoContainer}>
                            <img src={logoRectangle} alt="" />
                        </div>
                        <div className={Styles.signUpContent}>
                            <h2>Create Account</h2>
                            <div className={Styles.otherLoginIcons}>
                                <FaGoogle />
                                <FaFacebookF />
                                <FaXTwitter />
                                <FaLinkedinIn />
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
                                    <button type="submit">SIGN UP</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
