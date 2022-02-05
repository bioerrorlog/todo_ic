import { 
  Box,
  Button,
} from "@chakra-ui/react"
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import PlugConnect from '@psychedelic/plug-connect';
import { taskDataset, columnDataset, columnOrder } from './dataset' // For debug
import Column from './components/Column'
import {
  todo_ic,
  canisterId,
  idlFactory,
} from "../../declarations/todo_ic";
import { convertArrayToObject } from './utils';

const App = () => {
  const [taskState, setTaskState] = useState({tasks: taskDataset, columns: columnDataset})

  const [plugConnected, setPlugConnected] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [actor, setActor] = useState(false);

  const whitelist = [canisterId];
  const network = `http://${canisterId}.localhost:8000`;

  const fetchAllTasks = async () => {
    const allTasks = await todo_ic.fetchAllTasks()

    // TODO: refactor
    const newColumnData = {
      'backlog': { ...taskState.columns['backlog'], taskIds: allTasks[1]['backlog']},
      'inProgress': { ...taskState.columns['inProgress'], taskIds: allTasks[1]['inProgress']},
      'review': { ...taskState.columns['review'], taskIds: allTasks[1]['review']},
      'done': { ...taskState.columns['done'], taskIds: allTasks[1]['done']},
    }
    const newTaskState = {
      ...taskState,
      tasks: convertArrayToObject(allTasks[0], 'id'),
      columns: newColumnData,
    }
    // console.log(taskState)
    // console.log(newTaskState)
    setTaskState(newTaskState)
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
    setPlugConnected(true);
  }


  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {return}
    
    if (destination.droppableId === source.droppableId && destination.index === source.index) { return }
    
    if (type === 'column') { return }

    const start = taskState.columns[source.droppableId];
    const finish = taskState.columns[destination.droppableId];

    // If dropped inside the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }
      const newTaskState = {
        ...taskState,
        columns: {
          ...taskState.columns,
          [newColumn.id]: newColumn,
        }
      }
      setTaskState(newTaskState)
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

    const newTaskState = {
      ...taskState,
      columns: {
        ...taskState.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }
    setTaskState(newTaskState)
  }

  useEffect(async () => {
    if (!window.ic?.plug?.agent) {
      setActor(false);
      setPlugConnected(false);
    }
  }, []);

  useEffect(async () => {
    if (plugConnected) {
      const principal = await window.ic.plug.agent.getPrincipal();

      if (principal) {
        setPrincipalId(principal.toText());
      }
    }
    console.log(`plugConnected: ${plugConnected}`)
  }, [plugConnected]);

  useEffect(async () => {
    if (plugConnected) {
      fetchAllTasks()
      // TODO: fetchAllMyTasks()
    }
  }, [plugConnected]);

  return (
    <>
      <Box m={30}>
        {plugConnected ? `Connected to plug`: (
          <PlugConnect
            host={network}
            whitelist={whitelist}
            dark
            onConnectCallback={handleConnect}
          />
        )}
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (
            <Box display="flex" {...provided.droppableProps} ref={provided.innerRef}>
              {columnOrder.map((id, index) => {
                const column = taskState.columns[id]
                const tasks = column.taskIds.map(taskId => taskState.tasks[taskId])

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
