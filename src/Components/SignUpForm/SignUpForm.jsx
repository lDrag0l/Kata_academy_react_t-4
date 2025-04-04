import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { createAccount } from '../../Redux/features/Authentication/Async/asyncFetch';

import s from './SignUpForm.module.scss'

import { message } from 'antd';

function SignUpForm() {
    const { register, handleSubmit, watch, formState: { errors }, } = useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { accountData, loading, error } = useSelector(state => state.authentication)

    const onSubmit = (data) => {
        const formatDate = { ...data }
        formatDate.email = formatDate.email.toLowerCase()
        dispatch(createAccount(formatDate))
    };

    useEffect(() => {
        if (loading) {
            messageApi.open({
                key: 'loading',
                type: 'loading',
                content: 'Sign up in progress...',
                duration: 0,
            });
        } else {
            messageApi.destroy('loading');
        }
    }, [loading, messageApi, messageApi.destroy]);

    useEffect(() => {
        if (error?.username || error?.email) {
            messageApi.destroy('loading');
            messageApi.error({
                content: 'Sign up failed',
                duration: 3,
            });
        }
    }, [error, messageApi, messageApi.destroy, messageApi.error]);

    useEffect(() => {
        if (accountData.token) {
            messageApi.destroy('loading');
            localStorage.setItem('user', JSON.stringify(accountData))
            navigate('/articles', { replace: true })
        }
    }, [accountData, navigate, messageApi, messageApi.destroy])

    useEffect(() => {
        if (accountData.token) {
            messageApi.destroy;
            localStorage.setItem('user', JSON.stringify(accountData))
            navigate('/articles', { replace: true })
        }
    }, [accountData, messageApi.destroy, navigate])

    let password = watch('password')

    return (
        <>
            {contextHolder}
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={s.formLabel}>Create new account</h2>

                <label className={`${s.inputLabel} ${errors.username ? s.errorLabel : ''}`}>
                    Username
                    <input
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Your username needs to be at least 3 characters"
                            },
                            maxLength: {
                                value: 20,
                                message: "Your username must not contain more than 20 characters"
                            }
                        })}
                        placeholder='Username'

                    />
                    {errors.username && <span className={s.spanValidateError}>{errors.username.message}</span>}
                    {error.username && <span className={s.spanValidateError}>{error.username}</span>}
                </label>

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
                    {error.email && <span className={s.spanValidateError}>{error.email}</span>}
                </label>

                <label className={`${s.inputLabel} ${errors.password ? s.errorLabel : ''}`}>
                    Password
                    <input
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Your password needs to be at least 6 characters"
                            },
                            maxLength: {
                                value: 40,
                                message: "Your password must not contain more than 40 characters"
                            }
                        })}
                        type="password"
                        placeholder='Password'
                    />
                    {errors.password && <span className={s.spanValidateError}>{errors.password.message}</span>}
                </label>

                <label className={`${s.inputLabel} ${errors.repeatPassword ? s.errorLabel : ''}`}>
                    Repeat Password
                    <input
                        {...register("repeatPassword", {
                            required: 'Passwords must match',
                            validate: (value) =>
                                value === password || "Passwords must match",
                        })}
                        type="password"
                        placeholder='Password'
                    />
                    {errors.repeatPassword && <span className={s.spanValidateError}>{errors.repeatPassword.message}</span>}
                </label>

                <label className={s.checkBoxLabel}>
                    <input
                        className={`${s.checkBox} ${errors.agreed ? s.errorLabel : ''}`}
                        {...register("agreed", {
                            required: true
                        })}
                        type="checkbox"
                    />
                    <div>I agree to the processing of my personal information</div>
                </label>
                <button
                    className={s.formSubmitButton}
                    type="submit"
                >
                    Create
                </button>
                <p className={s.signInLinkWrapper}>
                    Already have an account? <Link className={s.signInLink} to="/sign-in">Sign In</Link>.
                </p>
            </form>

            {loading && <span>Loading...</span>}
        </>
    );
}
export default SignUpForm
