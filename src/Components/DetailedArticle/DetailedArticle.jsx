import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'

import { fetchCurrentArticle, deleteArticle } from '../../Redux/features/Articles/Async/asyncFetch'

import s from './DetailedArticle.module.scss'

import Tag from '../Article/Tag'

import Markdown from 'markdown-to-jsx'

function DetailedArticle() {
    let renderContent
    let date
    let formattedDate
    let articleMarkdownText

    const { slug } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentArticle, loading, error } = useSelector((state) => state.articles)
    const { token } = useSelector(state => state.authentication.accountData)

    useEffect(() => {
        dispatch(fetchCurrentArticle(slug))
    }, [dispatch, slug])

    if (loading) return <>Loading...</>

    if (error) return <>{error.message}</>

    if (currentArticle) {
        date = parseISO(currentArticle.updatedAt);

        formattedDate = format(date, 'MMMM d, yyyy');

        articleMarkdownText = <Markdown className={s.resetStyles}>{currentArticle.body}</Markdown>
    }

    const handleDeleteButton = () => {
        dispatch(deleteArticle([slug, token]))
        navigate('/articles', { replace: true });
    }

    const handleEditButton = () => {
        console.log('Edit button')
    }

    currentArticle ? renderContent =

        <div className={s.article}>
            <div className={s.articleHeader}>
                <div>
                    <div>
                        <div className={s.headerArticleNameLink}>
                            {currentArticle.title}
                        </div>
                        <span>
                            {currentArticle.favoritesCount}
                        </span>
                    </div>
                    <div className={s.headerTagsContainer}>
                        {currentArticle.tagList.map((tag, index) => {
                            return <Tag key={index} text={tag} />
                        })}
                    </div>

                </div>
                <div className={s.headerUserInfo}>
                    <div>
                        <div className={s.headerUserName}>
                            {currentArticle.author.username}
                        </div>
                        <div className={s.headerCreateDate}>
                            {formattedDate}
                        </div>
                    </div>
                    <img src={currentArticle.author.image} alt="logo" className={s.headerUserLogo} />
                </div>
            </div>
            <div className={s.articleText}>
                <p>
                    {currentArticle.description}
                </p>
                <div className={s.articleEditDeleteButtonsContainer}>
                    <button onClick={handleDeleteButton} type='button' className={s.buttonDelete}>Delete</button>
                    <button onClick={handleEditButton} type='button' className={s.buttonEdit}>Edit</button>
                </div>
            </div>
            <div>
                {articleMarkdownText}
            </div>

        </div>
        :
        <>Loading</>

    return (
        <>
            {currentArticle && renderContent}
        </>

    )
}
export default DetailedArticle
