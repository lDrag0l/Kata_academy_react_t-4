import s from './EditCreateArticleForm.module.scss'

import { useForm } from 'react-hook-form';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createArticle } from '../../Redux/features/Articles/Async/asyncFetch';
import { useNavigate } from 'react-router-dom';

import { isCreatedUpdatedReload } from './../../Redux/features/Articles/ArticlesSlice'

const EditCreateArticleForm = () => {
    const [tagsInput, setTagsInput] = useState([0])

    const { register, handleSubmit, formState: { errors }, } = useForm();

    const { token } = useSelector(state => state.authentication.accountData)
    const { loading, error, isCreated, createdEditArticleSlug } = useSelector(state => state.articles)

    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    console.log(error)

    useEffect(() => {
        if (loading) {
            messageApi.open({
                key: 'loading',
                type: 'loading',
                content: 'Create article in progress...',
                duration: 0,
            });
        } else {
            messageApi.destroy('loading');
        }
    }, [loading, messageApi]);

    useEffect(() => {
        if (error) {
            messageApi.destroy('loading');
            messageApi.error({
                content: 'Create article error',
                duration: 3,
            });
        }
    }, [error, messageApi]);

    useEffect(() => {
        if (!loading && isCreated && !error) {
            dispatch(isCreatedUpdatedReload())
            messageApi.destroy;
            navigate(`/articles/${createdEditArticleSlug}`, { replace: true });
        }
    }, [isCreated, navigate, dispatch, isCreatedUpdatedReload]);

    const onSubmit = (data) => {

        const tags = Object.keys(data)
            .filter(key => key.startsWith("tag"))
            .map(key => data[key])
            .filter(value => value.trim() !== "");

        const formattedData = {
            title: data.title,
            description: data.shortDescription,
            body: data.text,
            tags: tags
        }
        dispatch(createArticle([formattedData, token]))
    }

    const addNewTag = () => {
        setTagsInput((prev) => {
            return [...prev, prev.length]
        })
    }

    const deleteTag = (indexToRemove) => {
        setTagsInput((prev) => prev.filter((_, index) => index !== indexToRemove));
    }

    return (
        <>
            {contextHolder}
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={s.formLabel}>Create new article</h2>

                <label className={`${s.inputLabel} ${errors.title ? s.errorLabel : ''}`}>
                    Title
                    <input
                        {...register("title", {
                            required: "Title is required",
                            maxLength: {
                                value: 80,
                                message: "Your title must not contain more than 80 characters"
                            }
                        })}
                        placeholder='Title'
                    />
                    {errors.title && <span className={s.spanValidateError}>{errors.title.message}</span>}
                </label>

                <label className={`${s.inputLabel} ${errors.shortDescription ? s.errorLabel : ''}`}>
                    Short description
                    <input
                        {...register("shortDescription", {
                            required: "Short description is required",
                        })}
                        placeholder='Short description'
                    />
                    {errors.shortDescription && <span className={s.spanValidateError}>{errors.shortDescription.message}</span>}
                </label>

                <label className={`${s.inputLabel} ${errors.text ? s.errorLabel : ''}`}>
                    Markdown text
                    <textarea
                        {...register("text", {
                            required: "Text is required",
                        })}
                        placeholder='Text'
                    />
                    {errors.text && <span className={s.spanValidateError}>{errors.text.message}</span>}
                </label>
                {!tagsInput.length && <button type='button' onClick={addNewTag} className={s.addFirstTag}>Add new tag</button>}
                {tagsInput.map((item, id) => {
                    if (id == (tagsInput.length - 1))
                        return (
                            <div className={s.tagInput} key={id}>
                                <label className={s.inputTag}>
                                    <input
                                        {...register(`tag${item}`, {
                                        })}
                                        placeholder='Tag'
                                    />
                                </label>
                                <button type='button' onClick={() => deleteTag(id)} className={s.tagDeleteButton}>Delete</button>
                                <button type='button' onClick={addNewTag} className={s.tagAddButton}>Add tag</button>
                            </div>
                        )
                    else return (
                        <div className={s.tagInput} key={id}>
                            <label className={s.inputTag}>
                                <input
                                    {...register(`tag${item}`, {
                                    })}
                                    placeholder='Tag'
                                />
                            </label>
                            <button type='button' onClick={() => deleteTag(id)} className={s.tagDeleteButton}>Delete</button>
                        </div>
                    )
                })}

                <button
                    className={s.formSubmitButton}
                    type="submit"
                >
                    Send
                </button>
            </form >
        </>
    )
}

export default EditCreateArticleForm