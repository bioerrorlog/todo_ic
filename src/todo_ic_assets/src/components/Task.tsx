import { 
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'

const Container = styled.div`
    border: 1px solid lightgrey;
    padding:8px;
    margin-bottom:8px;
    border-radius:2px;
    background-color:${props => (props.isDragging ? '#A0AEC0' : 'white')};
    &:hover {
        cursor: pointer;
        background-color: #A0AEC0;
    }
`
const Task = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box>
            <Draggable draggableId={props.task.id} index={props.index}>
                {(provided, snapshot) => (
                    <Container
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        onClick={onOpen}
                    >
                        {props.task.title}
                    </Container>
                )}
            </Draggable>

            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size="xl"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{props.task.title}</DrawerHeader>

                    <DrawerBody>
                        {props.task.description}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                        Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Task;
