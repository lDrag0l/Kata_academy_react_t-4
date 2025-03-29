import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

import s from './Article.module.scss'

import Tag from './Tag'

function Article({ article }) {

    const { author } = article

    const date = parseISO(article.updatedAt);

    const formattedDate = format(date, 'MMMM d, yyyy');

    return (
        <div className={s.article}>
            <div className={s.articleHeader}>
                <div>
                    <div>
                        <Link to={`/articles/${article.slug}`} className={s.headerArticleNameLink}>
                            {article.title}
                        </Link>
                        <span>
                            {article.favoritesCount}
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
export default Article
