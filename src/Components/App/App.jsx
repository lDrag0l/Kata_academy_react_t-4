import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useEffect, } from "react"
import { useDispatch, useSelector } from "react-redux"

import EditProfileForm from "../EditProfileForm"
import Header from "../Header"
import SignInForm from "../SignInForm"
import SignUpForm from "../SignUpForm"
import ArticleContainer from "../ArticleContainer"
import DetailedArticle from '../DetailedArticle'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import EditCreateArticleForm from "../EditCreateArticleForm/EditCreateArticleForm"

import { logInFromLocalStorage } from "../../Redux/features/Authentication/AuthenticationSlice"

import s from './App.module.scss'

function App() {
  const dispatch = useDispatch()

  const token = useSelector(state => state.authentication.accountData.token)


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
              <Route path="/articles/:slug/edit" element={<EditCreateArticleForm />} />
            </Route>
          </Routes>
        </div>

      </>
    </BrowserRouter>
  )
}
export default App
