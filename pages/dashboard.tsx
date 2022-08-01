import { Box, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import BottomNav from '../components/BottomNav';
import CardStack from '../components/CardStack';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { auth } from '../firebase.config';
import { authEmail } from '../utils/atom';
import { Category } from '../utils/types';

const Dashboard: NextPage = () => {
  const bgcolor = useColorModeValue('white', '#1A202C');
  const [category, setCategory] = useState<Category[]>([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (userCred) => {
      if (userCred) {
        // @ts-ignore
        setEmail(userCred.email);
        // @ts-ignore
        getTasks(userCred.email);
      }
    });
  }, []);
  async function getTasks(email: string) {
    try {
      const dew = await axios({
        method: 'post',
        url: '/api/usertasks',
        data: {
          email
        }
      });
      console.log(category, "before checking data")
      console.log(dew.data);
      console.log(category, "after checking data")
      setCategory(dew.data);
      console.log(category, "after setting data")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Stack
      direction={['column', 'column', 'row']}
      bgColor={bgcolor}
      w={['100vw', '', '100%']}
      minH="100vh"
    >
      <Box pos="fixed" display={['none', 'none', 'block']} w={['0', '', '']}>
        <Sidebar />
      </Box>
      <BottomNav/>
      <Box
        pos="relative"
        left={['0', '', '50px']}
        minWidth={['100%', '', 'calc(100vw - 60px)']}
        p={['', '', '20px']}
        h="100%"
      >
        <Box px={['10px']}>
          <Navbar />
        </Box>
        <Box>
          <Flex
            wrap="nowrap"
            overflowY="scroll"
            overflowX="scroll"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={['2', '', '5']}
            px={['10px', '', '']}
            py={['30px', '', '20px']}
            pb={['60px', '', '20px']}
            w={['100vw', '', 'calc(100vw - 100px)']}
          >
            {category?.map((data) => (
              <CardStack
                key={data.id}
                title={data.title}
                task={data.tasks}
                id={data.id}
                rev={getTasks}
              />
            ))}
          </Flex>
        </Box>
      </Box>
    </Stack>
  );
};

export default Dashboard;
