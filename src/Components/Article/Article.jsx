import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

import like from './../../assets/like.svg'
import unlike from './../../assets/unlike.svg'

import s from './Article.module.scss'

import Tag from './Tag'

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { favoriteUnfavoriteCurrentArticle } from '../../Redux/features/Articles/Async/asyncFetch';

import PropTypes from 'prop-types';


function Article({ article }) {
    const dispatch = useDispatch()

    const token = useSelector(state => state.authentication.accountData.token)
    const { author } = article

    const date = parseISO(article.updatedAt);
    const formattedDate = format(date, 'MMMM d, yyyy');

    const [localFavorited, setLocalFavorited] = useState(article.favorited)
    const [localFavoritesCount, setLocalFavoritesCount] = useState(article.favoritesCount)

    useEffect(() => {
        setLocalFavorited(article.favorited)
        setLocalFavoritesCount(article.favoritesCount)
    }, [article.favorited, article.favoritesCount])

    const handleLike = () => {
        if (token) {
            dispatch(favoriteUnfavoriteCurrentArticle([article.slug, localFavorited, token]))
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

    return (
        <div className={s.article}>
            <div className={s.articleHeader}>
                <div>
                    <div className={s.articleTitleContainer}>
                        <Link to={`/articles/${article.slug}`} className={s.headerArticleNameLink}>
                            {article.title}
                        </Link>
                        <span className={s.articleLikeCounts}>
                            <img onClick={handleLike} onMouseEnter={likeHoverHandler} onMouseLeave={unLikeHoverHandler} className={s.like} src={localFavorited ? unlike : like} alt={localFavorited ? "Unlike" : "Like"} />
                            {localFavoritesCount}
                        </span>
                    </div>
                    <div className={s.headerTagsContainer}>
                        {article.tagList.map((tag, index) => {
                            return <Tag key={index} text={tag} />
                        })}
                    </div>
                </div>
                <div className={s.headerUserInfo}>
                    <div>
                        <div className={s.headerUserName}>
                            {author.username}
                        </div>
                        <div className={s.headerCreateDate}>
                            {formattedDate}
                        </div>
                    </div>
                    <img src={author.image} alt="logo" className={s.headerUserLogo} />
                </div>
            </div>
            <div className={s.articleText}>
                <p>
                    {article.description}
                </p>
            </div>

        </div>
    )
}

Article.propTypes = {
    article: PropTypes.shape({
        slug: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        body: PropTypes.string,
        favorited: PropTypes.bool,
        favoritesCount: PropTypes.number,
        updatedAt: PropTypes.string,
        tagList: PropTypes.arrayOf(PropTypes.string),
        author: PropTypes.shape({
            username: PropTypes.string,
            image: PropTypes.string,
            following: PropTypes.bool
        })
    })
};

export default Article
