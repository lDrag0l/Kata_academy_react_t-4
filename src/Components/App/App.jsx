import { BrowserRouter, Route, Routes } from "react-router-dom"
import { fetchArticles } from "../../Redux/features/Articles/Async/asyncFetch"
import { useEffect, } from "react"
import { useDispatch, useSelector } from "react-redux"

import EditProfileForm from "../EditProfileForm"
import Header from "../Header"
import SignInForm from "../SignInForm"
import SignUpForm from "../SignUpForm"
import ArticleContainer from "../ArticleContainer"
import DetailedArticle from '../DetailedArticle'

import { logInFromLocalStorage } from "../../Redux/features/Authentication/AuthenticationSlice"

import s from './App.module.scss'

function App() {
  const dispatch = useDispatch()

  const offset = useSelector((state) => state.articles.offset)

  useEffect(() => {
    dispatch(fetchArticles(offset))
  }, [dispatch, offset])

  useEffect(() => {
    if (localStorage.getItem('user')) {
      dispatch(logInFromLocalStorage(JSON.parse(localStorage.getItem('user'))))
    }
  }, [])

  return (
    <BrowserRouter>
      <>
        <Header />
        <div className={s.contentWrapper}>
          <Routes>
            <Route path="/" element={<ArticleContainer />} />
            <Route path="/articles" element={<ArticleContainer />} />
            <Route path="/articles/:slug" element={<DetailedArticle />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/profile" element={<EditProfileForm />} />
          </Routes>
        </div>

      </>
    </BrowserRouter>
  )
}
export default App
