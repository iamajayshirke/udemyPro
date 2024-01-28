/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import flipperClient from 'js-flipper';

// Start the client and pass your app name
// flipperClient.start('udemyPro');

AppRegistry.registerComponent(appName, () => App);