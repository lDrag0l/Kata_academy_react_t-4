import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { message } from 'antd';

import { fetchCurrentArticle, deleteArticle } from '../../Redux/features/Articles/Async/asyncFetch'

import s from './DetailedArticle.module.scss'

import Tag from '../Article/Tag'

import Markdown from 'markdown-to-jsx'

function DetailedArticle() {
    const { slug } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentArticle, loading, error, isArticleDeleted } = useSelector((state) => state.articles)
    const { token } = useSelector(state => state.authentication.accountData)
    const [messageApi, contextHolder] = message.useMessage();

    let renderContent
    let date
    let formattedDate
    let articleMarkdownText

    useEffect(() => {
        dispatch(fetchCurrentArticle(slug))
    }, [dispatch, slug])

    useEffect(() => {
        if (loading && currentArticle) {
            messageApi.open({
                key: 'loading',
                type: 'loading',
                content: 'Delete article in progress...',
                duration: 0,
            });
        } else {
            messageApi.destroy('loading');
        }
    }, [loading, messageApi]);

    useEffect(() => {
        if (error === '403') {
            messageApi.destroy('loading');
            messageApi.error({
                content: 'Delete article error',
                duration: 3,
            });
        }
    }, [error, messageApi]);

    useEffect(() => {
        if (isArticleDeleted) {
            navigate('/articles', { replace: true });
        }
    }, [navigate, isArticleDeleted])

    if (currentArticle) {
        date = parseISO(currentArticle.updatedAt);

        formattedDate = format(date, 'MMMM d, yyyy');

        articleMarkdownText = <Markdown className={s.resetStyles}>{currentArticle.body}</Markdown>
    }

    const handleDeleteButton = () => {
        dispatch(deleteArticle([slug, token]))

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
                    <Link to={`/articles/${slug}/edit`} type='button' className={s.buttonEdit}>Edit</Link>
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
            {contextHolder}
            {currentArticle && renderContent}
        </>

    )
}
export default DetailedArticle
