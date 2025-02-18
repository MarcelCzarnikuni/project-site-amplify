"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from '@aws-amplify/auth';
import { Button, Flex, Heading, Text, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import DropZoneInput from '../components/filePicker'
import './../app/app.css'
import Navbar from "@/components/NavBar";

Amplify.configure(outputs);
const client = generateClient<Schema>();

const theme = {
  name: 'custom-theme',
  tokens: {
    components: {
      card: {
        backgroundColor: { value: '{colors.background.secondary}' },
        outlined: {
          borderColor: { value: '{colors.black}' },
        },
      },
      heading: {
        color: { value: 'white' },
      },
      text: {
        color: { value: 'white' },
      },
    },
  },
};

type input = {
  files: Blob[]
}

export default function App() {
  const { user, signOut } = useAuthenticator();
  const [files, setFiles] = useState([]);

  function ParseFloat(str: string, val: number) {
    str = str.toString();
    str = str.slice(0, (str.indexOf(".")) + val + 1);
    return Number(str);
  }

  const getAuthToken = async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };
  getAuthToken()

  async function uploadImage() {
    if (files.length === 0) {
      alert("No file selected.");
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    try {
      const token = await getAuthToken()
      const response = await fetch('https://api.marcelcz.uk/predict/', {
        method: 'POST',
        headers: {
          'Authorization': token?.toString(),
        },
        body: formData
      });
      const result = await response.json();
      // result.predictionCancer = ParseFloat(result.predictionCancer, 2) * 100
      // result.predictionHealthy = ParseFloat(result.predictionHealthy, 2) * 100
      document.getElementById('resultCancer')!.textContent = `cancer prediction: ${result.predictionCancer} %`;
      document.getElementById('resultHealthy')!.textContent = `healthy prediction: ${result.predictionHealthy} %`;
    } catch (error) {
      console.error('Error:', error);
      alert('failed');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Flex
        direction={{ base: 'column', large: 'row' }}
        maxWidth="32rem"
        padding="1rem"
        width="100%"
        justifyContent="center"
        alignContent="center"
      >
        <Flex justifyContent="space-between" direction="column" alignItems="center" alignContent="center">
          <Heading level={2}>Brain Tumour Inference</Heading>
          <Text> Please select an image. </Text>
          <DropZoneInput selectedFiles={setFiles} />

          <Button
            loadingText="processing..."
            onClick={() => uploadImage()}
            variation="primary"
          >
            Get Inference
          </Button>
          <Text id="resultHealthy"></Text>
          <Text id="resultCancer"></Text>
        </Flex>
      </Flex>
    </ThemeProvider>
  );
}
