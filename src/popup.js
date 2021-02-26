import React from 'react';
import { render } from 'react-dom';
import browser from 'webextension-polyfill';
import Popup from './js/Popup';

render(<Popup browser={browser} />, document.querySelector('main'));
