import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { message, Popconfirm } from 'antd';

import like from './../../assets/like.svg'
import unlike from './../../assets/unlike.svg'

import { fetchCurrentArticle, deleteArticle } from '../../Redux/features/Articles/Async/asyncFetch'
import { favoriteUnfavoriteCurrentArticle } from '../../Redux/features/Articles/Async/asyncFetch';

import s from './DetailedArticle.module.scss'

import Tag from '../Article/Tag'

import Markdown from 'markdown-to-jsx'

function DetailedArticle() {
    const { slug } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentArticle, loading, error, isArticleDeleted } = useSelector((state) => state.articles)

    const { token } = useSelector(state => state.authentication.accountData)
    const { username } = useSelector(state => state.authentication.accountData)

    const [messageApi, contextHolder] = message.useMessage();

    const [localFavorited, setLocalFavorited] = useState(false)
    const [localFavoritesCount, setLocalFavoritesCount] = useState(0)
    let renderContent
    let date
    let formattedDate
    let articleMarkdownText
    let userArticle = false

    if (currentArticle) {
        userArticle = currentArticle.author.username == username
    }
    const text = 'Are you sure to delete this article?';

    useEffect(() => {
        dispatch(fetchCurrentArticle([slug, token]))
    }, [dispatch, slug, token])

    useEffect(() => {
        if (currentArticle) {
            setLocalFavorited(currentArticle.favorited)
            setLocalFavoritesCount(currentArticle.favoritesCount)
        }
    }, [currentArticle])

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
    }, [loading, messageApi, currentArticle]);

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

    const handleLike = () => {
        if (token) {
            dispatch(favoriteUnfavoriteCurrentArticle([currentArticle.slug, localFavorited, token]))
        }
    }

    const likeHoverHandler = (e) => {
        if (!localFavorited && token) {
            e.target.src = unlike;
        }
    }
    const unLikeHoverHandler = (e) => {
        if (token) {
            e.target.src = localFavorited ? unlike : like;
        }
    }

    currentArticle ? renderContent =
        <div className={s.article}>
            <div className={s.articleHeader}>
                <div>
                    <div className={s.articleTitleContainer}>
                        <div className={s.headerArticleNameLink}>
                            {currentArticle.title}
                        </div>
                        <span className={s.articleLikeCounts}>
                            <img onClick={handleLike} onMouseEnter={likeHoverHandler} onMouseLeave={unLikeHoverHandler} className={s.like} src={localFavorited ? unlike : like} alt={localFavorited ? "Unlike" : "Like"} />
                            {localFavoritesCount}
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
                {userArticle && <div className={s.articleEditDeleteButtonsContainer}>
                    <Popconfirm
                        placement="rightTop"
                        title={text}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={handleDeleteButton}
                    >
                        <button type='button' className={s.buttonDelete}>Delete</button>
                    </Popconfirm>
                    <Link to={`/articles/${slug}/edit`} type='button' className={s.buttonEdit}>Edit</Link>
                </div>}
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
