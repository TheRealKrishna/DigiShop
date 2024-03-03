import Styles from "../../css/auth/ForgotPassword.module.css"
import logoRectangle from "../../assets/logo/logo-rectangle.png"
import { HiOutlineMail } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FORGOT_PASSWORD } from "../../graphql/mutations/userMutations";
import { useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import mailSent from "../../assets/auth/mailSent.png"

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [apiCalling, setApiCalling] = useState(false)
    const [credentials, setCredentials] = useState({ email: "" })
    const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
    const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD)
    const recaptchaRef: any = useRef()
    const [reCaptchaKey, setReCaptchaKey] = useState('');
    const [isMailSent, setIsMailSent] = useState(false)


    const onInputsChange = (e: any) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e: any) => {
        e.preventDefault()
        setApiCalling(true)

        const reCaptchaToken = await recaptchaRef.current.executeAsync();
        toast.promise(new Promise(async (resolve: Function, reject: Function) => {
            const response: any = await forgotPasswordMutation({ variables: { ...credentials, reCaptchaToken } })
            if (!response.errors) {
                setApiCalling(false)
                setIsMailSent(true)
                return resolve(response.data.forgotPassword.message)
            }
            else {
                setApiCalling(false)
                setReCaptchaKey(new Date().getTime().toString())
                return reject(response.errors[0].message)
            }
        }),
            {
                pending: 'Creating your account...',
                success: {
                    render: (response: any) => response.data
                },
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
        document.title = "DigiShop - Forgot Password"
    }, [])

    return (
        <div className={Styles.forgotPasswordPage}>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.forgotPasswordContainer}>
                <div className={Styles.leftContainer}>
                    <div className={Styles.vectorText}>
                        <h2>Forgot Your Password?</h2>
                        <p>No worries, let's get you back on track. Enter your email to reset your password.</p>
                    </div>
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
                    <div className={Styles.forgotPasswordContent}>
                        <h2>Reset Password</h2>
                        {
                            isMailSent ?

                                <div className={Styles.passwordSentContainer}>
                                    <div className={Styles.passwordSentIcon}>
                                        <img src={mailSent} alt="mailSent" />
                                    </div>
                                    <p>A password reset link is sent to your registered email address, Click on that link to proceed with your password changing request.</p>
                                </div>

                                :
                                <>
                                    <form className={Styles.forgotPasswordForm} onSubmit={onSubmit}>
                                        <div className={Styles.emailInputContainer}>
                                            <HiOutlineMail />
                                            <input type="email" required name="email" value={credentials.email} onChange={onInputsChange} placeholder="Email" />
                                        </div>
                                        <p className={Styles.privacyText}>An email will be sent to your address for verification.</p>
                                        <div className={Styles.forgotPasswordButtonContainer}>
                                            <button disabled={apiCalling} type="submit">SUBMIT</button>
                                        </div>
                                    </form>
                                    <div className={Styles.mobileLoginButtonContainer}>
                                        <div className={Styles.orText}>OR</div>
                                        <Link to={"/auth/login"}><button>LOGIN</button></Link>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
            <ReCAPTCHA
                key={reCaptchaKey}
                ref={recaptchaRef}
                size="invisible"
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY ? process.env.REACT_APP_RECAPTCHA_SITE_KEY : ""}
            />
        </div>
    )
}

