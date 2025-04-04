import s from './EditProfileForm.module.scss'

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { editProfileData } from '../../Redux/features/Authentication/Async/asyncFetch';
import { isUpdatedReload } from '../../Redux/features/Authentication/AuthenticationSlice'

import { message } from 'antd';

function EditProfileForm() {
    const { accountData, loading, error, isUpdated } = useSelector(state => state.authentication)
    const [messageApi, contextHolder] = message.useMessage();

    const { register, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            username: accountData?.username || "",
            email: accountData?.email || "",
            image: accountData?.image || ""
        }
    });

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = (data) => {
        const formatDate = { ...data, }
        formatDate.email = formatDate.email.toLowerCase()

        dispatch(editProfileData([formatDate, accountData.token]))
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
        if (error?.username) {
            messageApi.destroy('loading');
            messageApi.error({
                content: 'Invalid username',
                duration: 3,
            });
        }
    }, [error, messageApi]);

    useEffect(() => {
        if (!loading && accountData?.token && isUpdated) {
            dispatch(isUpdatedReload())
            messageApi.destroy;
            navigate('/articles', { replace: true });
        }
    }, [accountData, isUpdated, navigate, dispatch, isUpdatedReload(), loading, messageApi.destroy]);

    return (
        <>
            {contextHolder}
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={s.formLabel}>Edit Profile</h2>

                <label className={s.inputLabel}>
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

                <label className={s.inputLabel}>
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
                </label>

                <label className={s.inputLabel}>
                    New password
                    <input
                        {...register("password", {
                            required: "New password is required",
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

                <label className={s.inputLabel}>
                    Avatar image (url)
                    <input
                        {...register("image", {
                            pattern: {
                                value: /^(https?|data):\/\/[^\s/$.?#].[^\s]*$/i,
                                message: "Incorrect image url"
                            }
                        })}
                        placeholder='Avatar image'
                    />
                    {errors.image && <span className={s.spanValidateError}>{errors.image.message}</span>}
                </label>

                <button
                    className={s.formSubmitButton}
                    type="submit"
                >
                    Save
                </button>
            </form>
        </>
    );
}
export default EditProfileForm
