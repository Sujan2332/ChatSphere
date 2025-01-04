import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SocketProvider } from './SocketContext';
import "./index.css"
import {registerSW} from "virtual:pwa-register"

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content is available, please refresh.');
  },
  onOfflineReady() {
    console.log('The app is ready to work offline.');
  },
});

ReactDOM.render(
  <SocketProvider>
    <App />
  </SocketProvider>,
  document.getElementById('root')
);
