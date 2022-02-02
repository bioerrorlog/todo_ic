import { 
  Box,
  Button,
} from "@chakra-ui/react"
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import PlugConnect from '@psychedelic/plug-connect';
import { taskDataset, columnDataset } from './dataset' // For debug
import Column from './components/Column'
import {
  todo_ic,
  canisterId,
  idlFactory,
} from "../../declarations/todo_ic";
import { convertArrayToObject } from './utils';

const App = () => {
  const [myTasks, setMyTasks] = useState()
  const [allTasks, setAllTasks] = useState()

  const [taskData, setData] = useState(taskDataset)
  const [columnData, setColumnData] = useState(columnDataset)

  const [name, setName] = useState('');  // For debug
  const [message, setMessage] = useState('');  // For debug

  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [actor, setActor] = useState(false);

  const whitelist = [canisterId];
  const network = `http://${canisterId}.localhost:8000`;
  
  const doGreet = async () => {
    // For debug
    const greeting = await actor.greet(name);
    // const greeting = await todo_ic.greet(name);
    setMessage(`${greeting} and ${principalId}`);
  }

  const fetchAllTasks = async () => {
    console.log('start fetchAllTasks')
    if (!connected) {
      console.log("Not connected")
      return
    }
    const allTasks = await actor.fetchAllTasks()

    console.log(allTasks)
    console.log(convertArrayToObject(allTasks, "id"))
    console.log(taskData)
    setAllTasks(convertArrayToObject(allTasks, "id"))
  }

  const handleConnect = async () => {

    if (!window.ic.plug.agent) {
      await window.ic?.plug?.createAgent({whitelist, network});
    }

    // Create an actor to interact with the basckend Canister
    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    setActor(actor);
    setConnected(true);
  }


  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {return}
    
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return }
    
    if (type === 'column') { return }

    const start = columnData.columns[source.droppableId];
    const finish = columnData.columns[destination.droppableId];

    // If dropped inside the same column
    if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
        const newColumn = {
            ...start,
            taskIds: newTaskIds
        }
        const newState = {
            ...columnData,
            columns: {
                ...columnData.columns,
                [newColumn.id]: newColumn
            }
        }
        setColumnData(newState)
        return;
    }

    // If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
        ...start,
        taskIds: startTaskIds
    }
    
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
        ...finish,
        taskIds: finishTaskIds
    }

    const newState = {
        ...columnData,
        columns: {
            ...columnData.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        }
    }

    setColumnData(newState)
  }

  useEffect(async () => {
    if (!window.ic?.plug?.agent) {
      setActor(false);
      setConnected(false);
    }
  }, []);

  // useEffect(async () => {
  //   // Debug
  //   listMyTasks()
  // }, []);

  useEffect(async () => {
    if (connected) {
      const principal = await window.ic.plug.agent.getPrincipal();

      if (principal) {
        setPrincipalId(principal.toText());
      }
    } else {
      window.location.hash = '/connect';
    }
    console.log(`connected: ${connected}`)
  }, [connected]);

  // useEffect(async () => {
  //   await window?.ic?.plug?.agent?.fetchRootKey();
  //   console.log("fetchRootKey!!!!!!!!!!!!!!! in outsde");
  //     if (process.env.DFX_NETWORK == "local") {
  //       await window.ic.plug.agent.fetchRootKey();
  //       console.log("fetchRootKey!!!!!!!!!!!!!!!");
  //     };
  // }, []);

  return (
    <>
      <Box m={30}>
        {connected ? `Connected to plug: ${principalId} to canister ${canisterId}`: (
          <PlugConnect
            host={network}
            whitelist={whitelist}
            dark
            onConnectCallback={handleConnect}
          />
        )}
      </Box>
      <Button variant='outline' ml={30} onClick={fetchAllTasks}>fetchAllTasks</Button>

      {/* Greet func for Debug */}
      {/* <div style={{ margin: "30px" }}>
        <input
          id="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        ></input>
        <button onClick={doGreet}>Greet</button>
      </div>
      <div>
        Greet response: "
        <span>{message}</span>"
      </div>
      <div style={{ margin: "30px" }}>
      </div> */}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (
            <Box display="flex" {...provided.droppableProps} ref={provided.innerRef}>
              {columnData.columnOrder.map((id, index) => {
                const column = columnData.columns[id]
                const tasks = column.taskIds.map(taskId => taskData[taskId])

                return <Column key={column.id} column={column} tasks={tasks} index={index} />
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </ >
  );
};

export default App;
