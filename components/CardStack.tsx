import {
  Button,
  Circle,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { initialTask, Task } from '../utils/types';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Taskcard from './Taskcard';

const CardStack = (props : any) => {
  const { title, task, id } = props
  const textcolor = useColorModeValue('black', 'white');
  const [newTask, setTasks] = useState<Task>(initialTask);
  const [dis, setDis] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (id === 1) {
      setDis('flex')
    } else {
      setDis('none')
    }
    
  }, [id])
  // @ts-ignore
  function handleModalInputs(e) {
    let value = e.target.value;
    setTasks({ ...newTask, [e.target.name]: value });
  }
  async function createNewTask() {
    try {
      const createtask = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      console.log(createtask);
      onClose();
      // setDis(true);
      return createtask;
    } catch (error) {
      return error;
    } finally {
      setTasks(initialTask);
      // setDis(false)
    }
  }
  return (
    <>
      <Stack
        flexBasis={'25%'}
        minWidth="330px"
        direction="column"
        color={textcolor}
        border="2px solid"
        px="12px"
        py="14px"
        borderColor="gray.500"
        borderStyle="dashed"
        borderRadius="16px"
      >
        <Flex justifyContent="space-between" alignItems="center" mb="10px">
          <Text mb="6px"> {title} </Text>
          
          <Button
            display={dis}
            variant="ghost"
            _active={{ outline: '0' }}
            size="sm"
            onClick={onOpen}
          >
            <Circle border="1px solid #d8d8d8" size="20px">
              <FaPlus fontSize="10px" />
            </Circle>
            <Text ml="6px" fontWeight="400">
              {' '}
              Add new task{' '}
            </Text>
          </Button>
        </Flex>
        {
          task?.map((data: any) => (
            <Stack key={data.id} direction="column" gap={'5'} py='5px'>
              <Taskcard
                title={data.title}
                team={data.description}
                label={data.label}
                date={data.createdAt}
                progress={'2'}
              />
            </Stack>
          )
            )
        }
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="500">Add a new Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel fontWeight="400" mt="8px" fontFamily="Oswald">
                Enter task title{' '}
              </FormLabel>
              <Input
                type="text"
                placeholder="Task title"
                name="title"
                value={newTask.title}
                onChange={handleModalInputs}
                variant="flushed"
              />
              <FormErrorMessage> Kindly add a task title </FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="400" mt="8px" fontFamily="Oswald">
                Task description{' '}
              </FormLabel>
              <Textarea
                placeholder="Add a short description"
                resize="vertical"
                name="description"
                value={newTask.description}
                onChange={handleModalInputs}
              />
              <FormErrorMessage>
                {' '}
                Kindly add a short description{' '}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="400" mt="8px" fontFamily="Oswald">
                Label{' '}
              </FormLabel>
              <Select
                name="label"
                value={newTask.label}
                placeholder="Choose a label"
                onChange={handleModalInputs}
              >
                <option value={'Critical'}> Critical </option>
                <option value={'High Priority'}> High Priority </option>
                <option value={'Low Priority'}> Low Priority </option>
              </Select>
              <FormErrorMessage> Kindly add a label </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={createNewTask}
            >
              Add task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    
  );
};

export default CardStack;
