import Styles from "../../css/auth/ResetPassword.module.css"
import logoRectangle from "../../assets/logo/Digishop-Logo-Rectangle.png"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { PiLockKeyOpen } from "react-icons/pi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FORGOT_PASSWORD } from "../../graphql/mutations/userMutations";
import { useSelector } from "react-redux";

export default function ResetPassword() {
    const navigate = useNavigate()
    const [apiCalling, setApiCalling] = useState(false)
    const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "" })
    const isLoggedIn = useSelector((state: any) => state.login.isLoggedIn);
    const [resetPasswordMutation] = useMutation(FORGOT_PASSWORD)

    const onInputsChange = (e: any) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false)

    const onSubmit = (e: any) => {
        e.preventDefault()
        setApiCalling(true)
        toast.promise(new Promise(async (resolve: Function, reject: Function) => {
            const response: any = await resetPasswordMutation({ variables: credentials })
            if (!response.errors) {
                setApiCalling(false)
                return resolve(response.data.resetPassword.message)
            }
            else {
                setApiCalling(false)
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


    return (
        <div className={Styles.resetPasswordPage}>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.circle}></div>
            <div className={Styles.resetPasswordContainer}>
                <div className={Styles.leftContainer}>
                    <div className={Styles.vectorText}>
                        <h2>Welcome back!</h2>
                        <p>You're almost there. Enter your new password to regain access and explore exclusive offers.</p>
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
                    <div className={Styles.resetPasswordContent}>
                        <h2>Change Password</h2>
                        <form className={Styles.resetPasswordForm} onSubmit={onSubmit}>
                            <div className={Styles.passwordInputContainer}>
                                <RiLockPasswordLine />
                                <input type={passwordVisibility ? "text" : "password"} required minLength={8} name="password" value={credentials.password} onChange={onInputsChange} placeholder="Password" />
                            </div>
                            <div className={Styles.passwordInputContainer}>
                                <PiLockKeyOpen />
                                <input type={passwordVisibility ? "text" : "password"} required minLength={8} name="confirmPassword" value={credentials.confirmPassword} onChange={onInputsChange} placeholder="Confirm Password" />
                                {
                                    passwordVisibility ? <FaRegEyeSlash onClick={() => setPasswordVisibility(!passwordVisibility)} style={{ cursor: "pointer" }} /> : <FaRegEye onClick={() => setPasswordVisibility(!passwordVisibility)} style={{ cursor: "pointer" }} />
                                }
                            </div>
                            <p className={Styles.privacyText}>Set your new password to proceed.</p>
                            <div className={Styles.resetPasswordButtonContainer}>
                                <button disabled={apiCalling} type="submit">SUBMIT</button>
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

