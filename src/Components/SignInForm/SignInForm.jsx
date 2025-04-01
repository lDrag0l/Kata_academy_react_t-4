import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { logInAccount } from '../../Redux/features/Authentication/Async/asyncFetch';

import s from './SignInForm.module.scss'
import { message } from 'antd';

function SignInForm() {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { accountData, loading, error } = useSelector(state => state.authentication)

    const onSubmit = (data) => {
        const formatDate = { ...data }
        formatDate.email = formatDate.email.toLowerCase()
        dispatch(logInAccount(formatDate))

    };

    useEffect(() => {
        if (loading) {
            messageApi.open({
                key: 'loading',
                type: 'loading',
                content: 'Log in in progress...',
                duration: 0,
            });
        } else {
            messageApi.destroy('loading');
        }
    }, [loading, messageApi]);

    useEffect(() => {
        if (error?.['email or password']) {
            messageApi.destroy('loading');
            messageApi.error({
                content: 'Invalid email or password',
                duration: 3,
            });
        }
    }, [error, messageApi]);

    useEffect(() => {
        if (accountData.token) {
            messageApi.destroy('loading');
            localStorage.setItem('user', JSON.stringify(accountData))
            navigate('/articles', { replace: true })
        }
    }, [accountData, navigate, messageApi])

    return (
        <>
            {contextHolder}
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={s.formLabel}>Sign In</h2>

                <label className={`${s.inputLabel} ${errors.email ? s.errorLabel : ''}`}>
                    Email address
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Incorrect email address"
                            }
                        })}
                        placeholder='Email address'
                    />
                    {errors.email && <span className={s.spanValidateError}>{errors.email.message}</span>}
                    {error['email or password'] && <span className={s.spanValidateError}>Invalid email or password</span>}
                </label>

                <label className={`${s.inputLabel} ${errors.password ? s.errorLabel : ''}`}>
                    Password
                    <input
                        {...register("password", {
                            required: "Password is required",
                        })}
                        type="password"
                        placeholder='Password'
                    />
                    {errors.password && <span className={s.spanValidateError}>{errors.password.message}</span>}
                </label>

                <button
                    className={s.formSubmitButton}
                    type="submit"
                >
                    Login
                </button>
                <p className={s.signInLinkWrapper}>
                    Don’t have an account? <Link className={s.signInLink} to="/sign-up">Sign Up</Link>.
                </p>
            </form>
        </>
    );
}
export default SignInForm
