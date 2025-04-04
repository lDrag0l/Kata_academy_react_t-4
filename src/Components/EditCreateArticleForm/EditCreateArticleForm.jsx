import s from './EditCreateArticleForm.module.scss'

import { useForm } from 'react-hook-form';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { message } from 'antd';

import { createArticle, fetchCurrentArticle, updateArticle } from '../../Redux/features/Articles/Async/asyncFetch';
import { isCreatedUpdatedReload } from './../../Redux/features/Articles/ArticlesSlice'

const EditCreateArticleForm = () => {
    const { slug } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { token } = useSelector(state => state.authentication.accountData)

    const { loading, error, isCreated, createdEditArticleSlug } = useSelector(state => state.articles)
    const { currentArticle } = useSelector(state => state.articles)

    const [messageApi, contextHolder] = message.useMessage();

    const initialTags = useMemo(() =>
        currentArticle?.tagList?.map((_, i) => i) || [0],
        [currentArticle?.tagList]
    );

    const [tagsInput, setTagsInput] = useState(initialTags);

    const defaultValues = useMemo(() => ({
        title: currentArticle?.title || "",
        shortDescription: currentArticle?.description || "",
        text: currentArticle?.body || "",
        ...(currentArticle?.tagList?.reduce((acc, tag, i) => {
            acc[`tag${i}`] = tag;
            return acc;
        }, {}) || {})
    }), [currentArticle]);

    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({
        defaultValues
    });

    useEffect(() => {
        reset(defaultValues);
        setTagsInput(initialTags);
    }, [currentArticle, reset, defaultValues, initialTags]);

    useEffect(() => {
        if (slug) dispatch(fetchCurrentArticle([slug]))
    }, [dispatch, slug])

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
                content: slug ? 'Update article error' : 'Create article error',
                duration: 3,
            });
        }
    }, [error, messageApi, slug]);

    useEffect(() => {
        if (!loading && isCreated && !error) {
            dispatch(isCreatedUpdatedReload())
            messageApi.destroy;
            navigate(`/articles/${createdEditArticleSlug}`, { replace: true });
        }
    }, [isCreated, navigate, messageApi.destroy, error, loading, createdEditArticleSlug]);

    const onSubmit = (data) => {
        const tags = Object.keys(data)
            .filter(key => key.startsWith("tag"))
            .map(key => data[key])
            .filter(value => value && value.trim() !== "");

        const formattedData = {
            title: data.title,
            description: data.shortDescription,
            body: data.text,
            tags: tags
        }
        if (slug) dispatch(updateArticle([formattedData, token, slug]))
        else dispatch(createArticle([formattedData, token]))
    }

    const addNewTag = () => {
        setTagsInput(prev => [...prev, prev.length]);
    };

    const deleteTag = (indexToRemove) => {
        setTagsInput(prev => {
            const newTags = prev.filter((_, i) => i !== indexToRemove);
            reset({
                ...getValues(),
                [`tag${indexToRemove}`]: undefined
            });
            return newTags;
        });
    };

    return (
        <>
            {contextHolder}
            <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={s.formLabel}>{slug ? 'Edit' : 'Create'} article</h2>

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

                {tagsInput.map((item, id) => {
                    const isLast = id === (tagsInput.length - 1);
                    return (
                        <div className={s.tagInput} key={id}>
                            <label className={s.inputTag}>
                                <input
                                    {...register(`tag${item}`)}
                                    placeholder='Tag'
                                />
                            </label>
                            <button
                                type='button'
                                onClick={() => deleteTag(id)}
                                className={s.tagDeleteButton}
                            >
                                Delete
                            </button>
                            {isLast && (
                                <button
                                    type='button'
                                    onClick={addNewTag}
                                    className={s.tagAddButton}
                                >
                                    Add tag
                                </button>
                            )}
                        </div>
                    )
                })}

                {!tagsInput.length && (
                    <button
                        type='button'
                        onClick={addNewTag}
                        className={s.addFirstTag}
                    >
                        Add new tag
                    </button>
                )}

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