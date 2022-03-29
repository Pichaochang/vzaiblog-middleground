import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import Router from "./router";
import { BrowserRouter } from "react-router-dom"
import store from "./store";
/** 公共样式 **/
import "@/assets/styles/default.sass";
import "@/assets/styles/global.sass";
import reportWebVitals from './reportWebVitals';
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
     <BrowserRouter>
      <Router />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
