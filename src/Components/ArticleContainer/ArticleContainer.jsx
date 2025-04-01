import { useDispatch, useSelector } from 'react-redux'

import { setCurrentPage } from '../../Redux/features/Articles/ArticlesSlice';
import { fetchArticles } from "../../Redux/features/Articles/Async/asyncFetch"
import { isArticleDeletedReload } from '../../Redux/features/Articles/ArticlesSlice'

import Article from '../Article'

import { ConfigProvider, Pagination } from "antd";
import { useEffect } from 'react';

const ArticleContainer = () => {
    const dispatch = useDispatch()

    const offset = useSelector(state => state.articles.offset)
    const flagDelete = useSelector(state => state.articles.isArticleDeleted)

    useEffect(() => {
        dispatch(fetchArticles(offset))
        if (flagDelete) dispatch(isArticleDeletedReload())
    }, [dispatch, offset, flagDelete])

    const { articles, loading, error, currentPage, totalPages } = useSelector((state) => state.articles)

    if (loading) return <>Loading...</>

    if (error) return <>{error.message}</>

    const handleChange = (page) => {
        dispatch(setCurrentPage(page))
    }

    return (
        <>
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
