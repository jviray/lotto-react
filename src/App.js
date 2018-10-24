import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  // ES 2016 allows for a refactored constructor method
  // this.state does not need to be inside the constructor(props) statement
  state = {
    manager: '',
    players: [],
    balance: '',
    value: ''
  };

  async componentDidMount() {
    // No longer have to specify who is calling when using Metamask's provider
    // By default from: is the first account signed into on Metamask
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    // ES2015 { manager: manager } = { manager }
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
  };

  render() {
    // Checks version web3 injected:
    // console.log(web3.version);

    // Checks balance but uses then promise bc async/await
    // will not work in React render:
    // return obj will automatically get logged to console:
    // web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by { this.state.manager }. <br />
          There are currently { this.state.players.length } people entered,
          competing to win { web3.utils.fromWei(this.state.balance, 'ether') } ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
      </div>
    );
  }
}

export default App;
