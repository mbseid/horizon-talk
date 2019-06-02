import React, {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Component,
  TouchableHighlight
} from 'react-native';
import lodash from 'lodash';
const MK = require('react-native-material-kit');
const Horizon = require("@horizon/client");


const {
  MKButton,
  MKColor,
  MKTextField,
  MKRadioButton
} = MK;

const JoinGameButton = MKButton.coloredButton()
  .withText('Join Game')
  .build();

const ResetGameButton = MKButton.accentColoredFlatButton()
  .withText('Reset')
  .build();

const newGame = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
]

class BoardCell extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let localStyles = [styles.cell];
    if(this.props.row > 0){
      localStyles.push(styles.topCell);
    }
    if(this.props.column == 0){
      localStyles.push(styles.rightCell);
    }
    if(this.props.column == 2){
      localStyles.push(styles.leftCell);
    }
    return (
      <View style={localStyles}>
        <TouchableHighlight onPress={this.props.onPress} style={styles.cellClick}>
          <Text style={styles.cellText}>{this.props.status}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default class GameView extends Component {
  constructor(props){
    super(props);
    this.state = {
      isGame: false,
      gameName: '',
      board: newGame,
      team: 'X'
    }
    this.radioGroup = new MKRadioButton.Group();
  }

  _setTeam(team){
    console.log("set the team", team);
    this.setState({
      team
    })
  }
  // Connect to Horizon
  componentWillMount(){
    this.horizon = Horizon();
    this.games = this.horizon("games");
  }

  // Save the new item to the game. 
  _boardClickHandler(column, row){
    
  }

  // Subscription to watch the board and set states when something is changed.
  _joinGame(){
    const _this = this;
    this.games
      .find(this.state.gameName)
      .watch()
      .forEach((game) => {
        console.log("New version of game", game);
        _this.setState({
          board: game.board
        })
      });

  }
  // Enters a game and sets the board empty, ready for starting
  _joinGameHandler(){
   const _this = this;
   _this.games.store({
    id: this.state.gameName,
    board: newGame
   }).forEach(
    result => _this.joinGame(),
    error => console.log(error)
   )
  }

  // Handler For the Reset Game Button -- it should set the board back to empty
  _resetGame(){
    console.log("Reset Game", this.state.gameName)
  }

  render(){
    const _this = this;
    return (
      <View style={styles.container}>
        <Text>Game Name</Text>
        <MKTextField
          tintColor={MKColor.Lime}
          textInputStyle={{color: MKColor.Black}}
          placeholder="Game Name..."
          style={styles.textfield}
          onTextChange={(gameName) => this.setState({gameName})} />
        <JoinGameButton onPress={this._joinGameHandler.bind(this)} />

        <View style={styles.row}>
          <View style={styles.col}>
            <MKRadioButton
              checked={true}
              group={this.radioGroup}
              onCheckedChange={this._setTeam.bind(this, "O")} 
              />
            <Text style={styles.legendLabel}>X</Text>
          </View>
          <View style={styles.col}>
            <MKRadioButton
            group={this.radioGroup}
            onCheckedChange={this._setTeam.bind(this, "X")} />
            <Text style={styles.legendLabel}>O</Text>
          </View>
        </View>

        <View style={styles.row}>
          {this.state.board.map((item, cIndex) =>
            <View key={`column-${cIndex}`} style={styles.boardColumn}>
            {item.map((cell, rIndex) => 
              <BoardCell key={`cell-${rIndex}-${cIndex}`}
                      row={rIndex} column={cIndex}
                      status={cell}
                      onPress={_this._boardClickHandler.bind(_this, cIndex, rIndex)} />
            )}
            </View>
          )}
        </View>

        <View style={styles.clearRow}>
          <ResetGameButton 
            onPress={_this._resetGame.bind(_this)}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0
  },
  textfield: {
    height: 28,  // have to do it on iOS
    marginTop: 22,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 7, marginRight: 7,
  },
  legendLabel: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 10, marginBottom: 20,
    fontSize: 12,
    fontWeight: '300',
  },
  boardColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cell: {
    flex: .3,
    height: 125,
    borderColor: '#0000FF',
  },
  cellClick: {
    height: 125,
    flex: 1
  },
  leftCell: {
    borderLeftWidth: 2
  },
  topCell: {
    borderTopWidth: 2
  },
  bottomCell: {
    borderBottomWidth: 2
  },
  rightCell: {
    borderRightWidth: 2
  },
  cellText: {
    padding: 20,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  clearRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});