import Styles from "../../css/auth/ResetPassword.module.css"
import logoRectangle from "../../assets/logo/logo-rectangle.png"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { PiLockKeyOpen } from "react-icons/pi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CHANGE_PASSWORD } from "../../graphql/mutations/userMutations";
import { useSelector } from "react-redux";
import Loader from "../loaders/Loader";
import { PASSWORD_RESET_TOKEN_VERIFY } from "../../graphql/queries/userQueries";

export default function ResetPassword() {
    const navigate = useNavigate()
    const [apiCalling, setApiCalling] = useState(false)
    const [credentials, setCredentials] = useState({ password: "", confirmPassword: "" })
    const isLoggedIn = useSelector((state: any) => state.login.isLoggedIn);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const [inputError, setInputError] = useState<any>(false)

    const onInputsChange = (e: any) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false)

    const { data, loading, error, refetch } = useQuery(PASSWORD_RESET_TOKEN_VERIFY, {
        context: {
            headers: {
                "passwordResetToken": token
            }
        }
    })

    const [changePassword] = useMutation(CHANGE_PASSWORD, {
        context: {
            headers: {
                "passwordResetToken": token
            }
        }
    })


    const onSubmit = (e: any) => {
        e.preventDefault()
        setApiCalling(true)
        toast.promise(new Promise(async (resolve: Function, reject: Function) => {
            if (inputError) {
                return reject("Password and confirm password do not match")
            }
            const response: any = await changePassword({ variables: credentials })
            if (!response.errors) {
                setApiCalling(false)
                navigate("/auth/login")
                return resolve(response.data.changePassword.message)
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

    useEffect(() => {
        if (credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
            setInputError("Passwords Do Not Match")
        }
        else {
            setInputError(false)
        }
    }, [credentials])

    useEffect(() => {
        refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname])

    useEffect(() => {
        document.title = "DigiShop - Reset Password"
    }, [])

    if (loading || !token) {
        return (<Loader />)
    } else {
        if (error) {
            toast.error(String(error).replace("ApolloError: ", ""), {
                toastId: "passwordResetTokenVerifyErrorToast"
            })
            navigate("/auth/login")
        }
        else if (!data.resetPasswordTokenVerify.success) {
            toast.error(data.resetPasswordTokenVerify.message, {
                toastId: "passwordResetTokenVerifyErrorToast"
            })
            navigate("/auth/login")
        }
    }

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
                            <div className={Styles.passwordInputContainer} style={{ boxShadow: inputError ? "0 0 0 1px red" : "0 0 0 1px #eee" }}>
                                <RiLockPasswordLine />
                                <input type={passwordVisibility ? "text" : "password"} required minLength={8} name="password" value={credentials.password} onChange={onInputsChange} placeholder="Password" />
                            </div>
                            <div className={Styles.passwordInputContainer} style={{ boxShadow: inputError ? "0 0 0 1px red" : "0 0 0 1px #eee" }}>
                                <PiLockKeyOpen />
                                <input type={passwordVisibility ? "text" : "password"} required minLength={8} name="confirmPassword" value={credentials.confirmPassword} onChange={onInputsChange} placeholder="Confirm Password" />
                                {
                                    passwordVisibility ? <FaRegEyeSlash onClick={() => setPasswordVisibility(!passwordVisibility)} style={{ cursor: "pointer" }} /> : <FaRegEye onClick={() => setPasswordVisibility(!passwordVisibility)} style={{ cursor: "pointer" }} />
                                }
                            </div>
                            <p className={Styles.inputErrorText} style={{ visibility: inputError ? "visible" : "hidden" }}>&nbsp;{inputError} </p>
                            <p className={Styles.privacyText}>Set your new password to proceed.</p>
                            <div className={Styles.resetPasswordButtonContainer}>
                                <button disabled={apiCalling || inputError} type="submit">SUBMIT</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

