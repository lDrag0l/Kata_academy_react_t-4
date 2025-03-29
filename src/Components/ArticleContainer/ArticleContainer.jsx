import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage } from '../../Redux/features/Articles/ArticlesSlice';

import s from './ArticleContainer.module.scss'

import Article from '../Article'

import { ConfigProvider, Pagination } from "antd";

const ArticleContainer = () => {
    const dispatch = useDispatch()
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
