import React, { useState, useEffect } from 'react';
import { Connect } from './components';
import { todo_ic } from "../../declarations/todo_ic";

const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [actor, setActor] = useState(false);

  const doGreet = async () => {
    const greeting = await todo_ic.greet(name);
    setMessage(greeting);
  }

  const handleConnect = async () => {
    setConnected(true);

    if (!window.ic.plug.agent) {
      const whitelist = [process.env.PLUG_COIN_FLIP_CANISTER_ID];
      await window.ic?.plug?.createAgent(whitelist);
    }

    // Create an actor to interact with the NNS Canister
    // we pass the NNS Canister id and the interface factory
    const NNSUiActor = await window.ic.plug.createActor({
      canisterId: process.env.PLUG_COIN_FLIP_CANISTER_ID,
      interfaceFactory: idlFactory,
    });

    setActor(NNSUiActor);
  }

  return (
    <>
    <div className='app'>
    {/* <div style={{ "fontSize": "30px" }}> */}
      {/* <div style={{ "backgroundColor": "yellow" }}> */}
        <p>Greetings, from DFINITY!</p>
        <p>
          {" "}
          Type your message in the Name input field, then click{" "}
          <b> Get Greeting</b> to display the result.
        </p>
      </div>
      <Connect handleConnect={handleConnect} />
      <div style={{ margin: "30px" }}>
        <input
          id="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        ></input>
        <button onClick={doGreet}>Get Greeting!</button>
      </div>
      <div>
        Greeting is: "
        <span style={{ color: "blue" }}>{message}</span>"
      {/* </div> */}
    {/* </div> */}
    </div>
    </ >
  );
};

export default App;
