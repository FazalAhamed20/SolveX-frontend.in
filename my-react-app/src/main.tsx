import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'

import { GoogleOAuthProvider } from "@react-oauth/google";
import Store, { persistor } from "./redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { FacebookProvider } from 'react-facebook'
import {
  BrowserRouter as Router,} from "react-router-dom"

  const clientId = String(
    import.meta.env.VITE_CLIENTID
  );
  const appId = String(
    import.meta.env.VITE_APPID
  );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId={clientId}>
      <FacebookProvider appId={appId}>
        <ToastContainer />
        <Router>

        <App />
        </Router>
        </FacebookProvider>
      </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
