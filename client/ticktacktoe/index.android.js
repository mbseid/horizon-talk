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
import GameView from './views/GameView4';


class ticktacktoe extends Component {
  render() {
    return (
      <GameView host="10.0.2.2" />
    );
  }
}

AppRegistry.registerComponent('ticktacktoe', () => ticktacktoe);
