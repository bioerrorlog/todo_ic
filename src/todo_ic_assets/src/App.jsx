import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import PlugConnect from '@psychedelic/plug-connect';
import dataset from './dataset' // For debug
import Column from './components/Column'
import {
  todo_ic,
  canisterId,
  idlFactory,
} from "../../declarations/todo_ic";

const Container = styled.div`
    display : flex;
`

const App = () => {
  const [data, setData] = useState(dataset)

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
    
    if (type === 'column') {
        const newColumnOrder = Array.from(data.columnOrder);
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);
        const newState = {
            ...data,
            columnOrder: newColumnOrder
        }
        setData(newState)
        return;
    }

    //Anything below this happens if you're dragging tasks
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    //If dropped inside the same column
    if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
        const newColumn = {
            ...start,
            taskIds: newTaskIds
        }
        const newState = {
            ...data,
            columns: {
                ...data.columns,
                [newColumn.id]: newColumn
            }
        }
        setData(newState)
        return;
    }

    //If dropped in a different column
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
        ...data,
        columns: {
            ...data.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        }
    }

    setData(newState)
  }

  useEffect(async () => {
    if (!window.ic?.plug?.agent) {
      setActor(false);
      setConnected(false);
      window.location.hash = '/connect';
    }
  }, []);

  useEffect(async () => {
    if (connected) {
      const principal = await window.ic.plug.agent.getPrincipal();

      if (principal) {
        setPrincipalId(principal.toText());
      }
    } else {
      window.location.hash = '/connect';
    }
  }, [connected]);

  useEffect(async () => {
    await window?.ic?.plug?.agent?.fetchRootKey();
    console.log("fetchRootKey!!!!!!!!!!!!!!! in outsde");
      if (process.env.DFX_NETWORK == "local") {
        await window.ic.plug.agent.fetchRootKey();
        console.log("fetchRootKey!!!!!!!!!!!!!!!");
      };
  }, []);

  return (
    <>
      <div className='app'>
        <div className="content">
          <div style={{ margin: "30px" }}>
            {connected ? `Connected to plug: ${principalId} to canister ${canisterId}`: (
              <PlugConnect
                host={network}
                whitelist={whitelist}
                dark
                onConnectCallback={handleConnect}
              />
            )}
          </div>

          {/* Greet func for Debug */}
          <div style={{ margin: "30px" }}>
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
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='all-columns' direction='horizontal' type='column'>
              {(provided) => (
                <Container {...provided.droppableProps} ref={provided.innerRef}>
                  {data.columnOrder.map((id, index) => {
                    const column = data.columns[id]
                    const tasks = column.taskIds.map(taskId => data.tasks[taskId])

                    return <Column key={column.id} column={column} tasks={tasks} index={index} />
                  })}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </ >
  );
};

export default App;
