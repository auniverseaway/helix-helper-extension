import React from 'react';
import { render } from 'react-dom';
import HelixHelper from './js/HelixHelper';
import browser from 'webextension-polyfill';
import './less/options.less';

render(<HelixHelper browser={browser} />, document.querySelector('main'));
