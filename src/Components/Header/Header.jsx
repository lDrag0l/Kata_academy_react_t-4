import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import s from './Header.module.scss'

import { logOut } from '../../Redux/features/Authentication/AuthenticationSlice'

function Header() {
    const user = useSelector(state => state.authentication.accountData)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOutButtonClick = () => {
        localStorage.removeItem('user')
        dispatch(logOut())
        navigate('/sign-in', { replace: true })
    }

    let renderContent = !user.token ? <>
        <Link to="/sign-in" className={s.headerSignInLink}>
            <div className={s.headerSignIn}>
                Sign In
            </div>
        </Link>
        <Link to="/sign-up">
            <div className={s.headerSignUp}>
                Sign Up
            </div>
        </Link>
    </>
        :
        <>
            <Link to="/new-article">
                <div className={s.headerCreateArticleButton}>
                    Create article
                </div>
            </Link>

            <Link to="/profile" className={s.headerUserNameAndLogoContainer}>
                <span className={s.headerUserName}>{user.username}</span>
                <img className={s.headerUserImage} src={user.image ? user.image : 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt="Logo" />
            </Link>

            <button onClick={handleLogOutButtonClick} className={s.LogOutButton}>
                Log Out
            </button>
        </>

    return (
        <header className={s.header}>
            <Link to="/articles" className={s.headerLeft}>
                Realworld Blog
            </Link>

            <div className={s.headerRight}>
                {renderContent}
            </div>
        </header>
    )
}
export default Header
