import { useDispatch, useSelector } from 'react-redux'

import { currentArticleReload, setCurrentPage, isArticleDeletedReload, articleIsFavoritedUnfavoritedReload } from '../../Redux/features/Articles/ArticlesSlice';
import { fetchArticles } from "../../Redux/features/Articles/Async/asyncFetch"

import { message } from 'antd';

import Article from '../Article'

import { ConfigProvider, Pagination } from "antd";
import { useEffect } from 'react';

const ArticleContainer = () => {
    const dispatch = useDispatch()

    const offset = useSelector(state => state.articles.offset)
    const { token } = useSelector(state => state.authentication.accountData)
    const flagDelete = useSelector(state => state.articles.isArticleDeleted)
    const currentArticle = useSelector(state => state.articles.currentArticle)

    const [messageApi, contextHolder] = message.useMessage();

    const { articles, loading, error, currentPage, totalPages, isArticleFavoritedUnfavorited } = useSelector((state) => state.articles)

    useEffect(() => {
        dispatch(fetchArticles([offset, token]))
        if (flagDelete) dispatch(isArticleDeletedReload())
        if (currentArticle) dispatch(currentArticleReload())
        if (isArticleFavoritedUnfavorited) dispatch(articleIsFavoritedUnfavoritedReload())
    }, [dispatch, offset, flagDelete, currentArticle, token, isArticleFavoritedUnfavorited])



    useEffect(() => {
        if (loading) {
            messageApi.open({
                key: 'loading',
                type: 'loading',
                content: 'Loading articles in progress...',
                duration: 0,
            });
        } else {
            messageApi.destroy('loading');
        }
    }, [loading, messageApi]);


    if (error) return <>{error.message}</>

    const handleChange = (page) => {
        dispatch(setCurrentPage(page))
    }

    return (
        <>
            {contextHolder}
            {articles.map((item) => {
                return <Article key={item.slug} article={item} />
            })}
            <ConfigProvider
                theme={{
                    components: {
                        Pagination: {
                            itemBg: '#EBEEF3',
                            itemActiveBg: '#1890FF',
                            colorPrimary: '#FFFFFF',
                            colorPrimaryHover: '#FFFFFF'
                        },
                    },
                }}
            >
                <Pagination current={currentPage} onChange={handleChange} align="center" defaultCurrent={1} defaultPageSize={5} showSizeChanger={false} total={totalPages} />
            </ConfigProvider>
        </>
    )
}

export default ArticleContainer
