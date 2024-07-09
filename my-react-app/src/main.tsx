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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId="508751020640-37gfseobr7qv95n8b5ri5amd4sfd0q8l.apps.googleusercontent.com">
      <FacebookProvider appId="890234692922522">
        <ToastContainer />
        <App />
        </FacebookProvider>
      </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
