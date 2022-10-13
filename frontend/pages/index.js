import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import axios from 'axios';
import { FormControl, FormLabel, Input, FormHelperText, Box, Button, WrapItem } from '@chakra-ui/react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [resp, setResponse] = useState('');
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setCreateObjectURL(URL.createObjectURL(i));
      // setCreateObjectURL([...event.target.files[0]]);
    }
  };
  const sendRequest = async () => {
    setShowResponse(false)
    setIsLoading(true)
    const formData = new FormData();
    // formData.append('file');
    formData.set('file', createObjectURL);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    const response = await axios.post('http://localhost:4000', formData, config);
    const data = await response.data
    console.log(data)
    setIsLoading(false)
    setResponse(data)
    setShowResponse(true)
  }
  return (
    <Box p={24}>
      <FormControl>
        <FormLabel>Input File</FormLabel>
        <Input type='file' onChange={uploadToClient} />
        <FormHelperText>Please use a csv or npy file only.</FormHelperText>
      </FormControl>
      {/* padding */}
      <Box p={4} />
      <WrapItem display='flex' alignItems='center'>
        <Button
          onClick={sendRequest}
          isLoading={isLoading}
          loadingText='Submitting'
          colorScheme='teal'
          variant='outline'
        >Predict</Button>
      </WrapItem>
      <Box p={4} />
      {
        showResponse ? <Box>{resp}</Box> : <></>
      }
    </Box>
  )
}
