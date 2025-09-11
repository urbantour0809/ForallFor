import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// ResizeObserver 에러 전역 처리 (Monaco Editor 관련)
const resizeObserverErrorHandler = (error) => {
  if (error.message === 'ResizeObserver loop completed with undelivered notifications.') {
    return;
  }
  console.error(error);
};

window.addEventListener('error', (e) => {
  resizeObserverErrorHandler(e.error);
});

// 언핸들드 프로미스 에러도 처리
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message?.includes('ResizeObserver loop completed')) {
    e.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
