import PropTypes from 'prop-types'

import s from './Tag.module.scss'

function Tag({ text = '' }) {
    return (
        <div className={s.headerTag}>
            {text}
        </div>
    )
}
export default Tag

Tag.propTypes = {
    text: PropTypes.string
}
