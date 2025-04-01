import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { fetchArticles } from "../../Redux/features/Articles/Async/asyncFetch"
import { useEffect, } from "react"
import { useDispatch, useSelector } from "react-redux"

import EditProfileForm from "../EditProfileForm"
import Header from "../Header"
import SignInForm from "../SignInForm"
import SignUpForm from "../SignUpForm"
import ArticleContainer from "../ArticleContainer"
import DetailedArticle from '../DetailedArticle'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

import { logInFromLocalStorage } from "../../Redux/features/Authentication/AuthenticationSlice"

import s from './App.module.scss'
import EditCreateArticleForm from "../EditCreateArticleForm/EditCreateArticleForm"

function App() {
  const dispatch = useDispatch()

  const offset = useSelector(state => state.articles.offset)
  const token = useSelector(state => state.authentication.accountData.token)

  useEffect(() => {
    dispatch(fetchArticles(offset))
  }, [dispatch, offset])

  useEffect(() => {
    if (localStorage.getItem('user')) {
      dispatch(logInFromLocalStorage(JSON.parse(localStorage.getItem('user'))))
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <>
        <Header />
        <div className={s.contentWrapper}>
          <Routes>
            <Route path="/" element={<Navigate to="/articles" replace />} />
            <Route path="/articles" element={<ArticleContainer />} />
            <Route path="/articles/:slug" element={<DetailedArticle />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route element={<ProtectedRoute token={token} />}>
              <Route path="/profile" element={<EditProfileForm />} />
              <Route path="/new-article" element={<EditCreateArticleForm />} />
            </Route>
          </Routes>
        </div>

      </>
    </BrowserRouter>
  )
}
export default App
