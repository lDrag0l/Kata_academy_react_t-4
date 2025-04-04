import { createRoot } from 'react-dom/client'

import './main.scss'

import App from './Components/App'

import { Provider } from 'react-redux'
import { store } from './Redux/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
