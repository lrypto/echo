import React, { Component } from "react";
import EchoContract from "./../../contracts/Echo.json";
import getWeb3 from "./../../utils/getWeb3";


class Web3Test extends Component {
  state = { 
    storageValue: "", 
    web3: null, 
    accounts: null, 
    contract: null, 
    textVal: "" 
  };


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EchoContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EchoContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  storeValue = async () => {
    const { accounts, contract, web3 } = this.state;
    console.log("using web3 version:" + web3.version);

    // Stores a given value, 5 by default.
    await contract.methods.setIndexName(this.state.textVal).send({ from: accounts[0] });
    this.setState({ textVal: "" });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getIndexName().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };


  addToken = async() => {
    const { accounts, contract, web3 } = this.state;
    console.log("using web3 version:" + web3.version);

    await contract.methods.addToken("ZRK", 10).send({ from: accounts[0] });
    
  }


  textChangeHandler = e => {
    this.setState({ textVal : e.target.value});
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h3>--*-*--**-**</h3>
        <div>The stored value is: {this.state.storageValue}</div>
        <input type="text" onChange={this.textChangeHandler} value={this.state.textVal} />
        <button class="btn btn-secondary" onClick={this.storeValue}>
           Run</button>
    
        <button class="btn btn-secondary" onClick={this.addToken}>  Add Token</button>
      </div>
    );
  }
}

export default Web3Test;
