import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { Provider } from 'react-redux';
import store from './store/strore';
import AutoLogin from './components/auth/AutoLogin';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AutoLogin>
        <RouterProvider router = {router } />
    </AutoLogin>
  </Provider>
);

reportWebVitals();