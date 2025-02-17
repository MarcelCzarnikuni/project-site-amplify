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
import NavBar from "@/components/navBar";

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

const getAuthToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();  // Get the ID token
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

type input = {
  files: Blob[]
}

export default function App() {
  const { user, signOut } = useAuthenticator();
  const [files, setFiles] = useState([]);

  async function uploadImage() {
    if (files.length === 0) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    // const file = input.files[0];
    // const formData = new FormData();
    // formData.append('file', file);

    try {
      const response = await fetch('https://n5bop1su69.execute-api.us-east-1.amazonaws.com/predict/', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      document.getElementById('resultCancer')!.textContent = `cancer prediction: ${result.predictionCancer}`;
      document.getElementById('resultHealthy')!.textContent = `healthy prediction: ${result.predictionHealthy}`;
    } catch (error) {
      console.error('Error:', error);
      alert('failed');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Flex
        direction={{ base: 'column', large: 'row' }}
        maxWidth="32rem"
        padding="1rem"
        width="100%"
      >
        <Flex justifyContent="space-between" direction="column">
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
