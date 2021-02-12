import { render } from 'react-dom';
import HelixHelper from './js/HelixHelper';
import browser from 'webextension-polyfill';

render(<HelixHelper browser={browser} />, document.querySelector('main'));