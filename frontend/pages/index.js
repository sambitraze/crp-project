import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import axios from 'axios';
import {
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Box,
    Button,
    WrapItem,
} from '@chakra-ui/react';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [resp, setResponse] = useState(null);
    const [file, setFile] = useState(null);
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile({ uploadFile: event.target.files[0] });
        }
    };
    const sendRequest = async () => {
        setShowResponse(false);
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file.uploadFile, 'file.png');
        try {
            const data = await axios.post('http://127.0.0.1:4000/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(data);
            setIsLoading(false);  
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Box p={24}>
            <FormControl>
                <FormLabel>Input File</FormLabel>
                <Input type='file' onChange={uploadToClient} />
                <FormHelperText>
                    Please use a csv or npy file only.
                </FormHelperText>
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
                >
                    Predict
                </Button>
            </WrapItem>
            <Box p={4} />

            {/* You cannot a render a object directly, you can only render a specidic value, to render an array or object use map function */}
            {/* {resp && <Box height={'300px'} width={'300px'}>{resp}</Box>} */}
        </Box>
    );
}
