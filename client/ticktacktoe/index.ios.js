/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import GameView from './views/GameView';

class ticktacktoe extends Component {
  render() {
    return (
      <GameView />
    );
  }
}

AppRegistry.registerComponent('ticktacktoe', () => ticktacktoe);
