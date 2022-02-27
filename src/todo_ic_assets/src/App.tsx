import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { 
  Box,
  Button,
} from "@chakra-ui/react"
import PlugConnect from '@psychedelic/plug-connect';
import { taskDatasetEmpty, initialColumnDataset, columnOrder } from './constants'
import Column from './components/Column'
import {
  todo_ic,
  canisterId,
  idlFactory,
} from "../../declarations/todo_ic";
import { convertArrayToObject } from './utils/array';

declare global {
  interface Window { ic: any; }
}

const App = () => {
  const [taskState, setTaskState] = useState({tasks: taskDatasetEmpty, columns: initialColumnDataset})

  const [plugConnected, setPlugConnected] = useState(false);
  const [actor, setActor] = useState(null);

  const whitelist = [canisterId];
  const network = `http://${canisterId}.localhost:8000`;

  const fetchAllTasks = async () => {
    const allTasks = await todo_ic.listAllTasks()
    const globalTaskOrders = await todo_ic.getGlobalTaskOrders()

    const newColumnData = {
      'backlog': { ...taskState.columns['backlog'], taskIds: globalTaskOrders.backlog},
      'inProgress': { ...taskState.columns['inProgress'], taskIds: globalTaskOrders.inProgress},
      'review': { ...taskState.columns['review'], taskIds: globalTaskOrders.review},
      'done': { ...taskState.columns['done'], taskIds: globalTaskOrders.done},
    }
    const newTaskState = {
      ...taskState,
      tasks: convertArrayToObject(allTasks, 'id'),
      columns: newColumnData,
    }
    setTaskState(newTaskState)
  }

  const fetchMyTaskOrders = async () => {
    if (!plugConnected) {
      console.log('Not authorized')
      return
    }
    // Slow response with plug agent
    console.log('fetchMyTaskOrders start')
    const myTaskOrders = await actor.getMyTaskOrders()
    console.log('End fetching')

    const newColumnData = {
      'backlog': { ...taskState.columns['backlog'], taskIds: myTaskOrders.backlog},
      'inProgress': { ...taskState.columns['inProgress'], taskIds: myTaskOrders.inProgress},
      'review': { ...taskState.columns['review'], taskIds: myTaskOrders.review},
      'done': { ...taskState.columns['done'], taskIds: myTaskOrders.done},
    }
    const newTaskState = {
      ...taskState,
      columns: newColumnData,
    }

    setTaskState(newTaskState)
  }

  const createTask = async () => {
    console.log('start creteTask')

    fetchMyTaskOrders()
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

  useEffect(() => {
    if (!window.ic?.plug?.agent) {
      setActor(null);
      setPlugConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTasks()
  }, []);

  useEffect(() => {
    if (plugConnected) {
      fetchMyTaskOrders()
    }
  }, [plugConnected]);

  return (
    <>
      <Box m={30}>
        {plugConnected ? `My tasks`: (
          <Box>
            <PlugConnect
              host={network}
              whitelist={whitelist}
              dark
              onConnectCallback={handleConnect}
            />
            <Box mt={30}>
              Global tasks
            </Box>
            
          </Box>
        )}
      </Box>
      <Button variant='outline' ml={30} onClick={createTask}>createTask</Button>

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