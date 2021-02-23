import React from 'react';
import { render } from 'react-dom';
import browser from 'webextension-polyfill';
import Actions from './js/Actions';

render(<Actions browser={browser} />, document.querySelector('main'));
