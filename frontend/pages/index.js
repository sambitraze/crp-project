import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { FormControl, FormLabel, Input, FormHelperText, Box } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box p={24}>
      <FormControl>
        <FormLabel>Input File</FormLabel>
        <Input type='file' />
        <FormHelperText>Please use a csv or npy file only.</FormHelperText>
      </FormControl>
    </Box>
  )
}
