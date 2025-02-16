"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from '@aws-amplify/auth';

Amplify.configure(outputs);
const client = generateClient<Schema>();


const getAuthToken = async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();  // Get the ID token
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};


export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  const sendRequest = async () => {
    const token = await getAuthToken();

    if (!token) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const response = await fetch('https://n5bop1su69.execute-api.us-east-1.amazonaws.com/predict', {
        method: 'POST',  // Change based on your API
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Attach Cognito JWT
        },
        body: JSON.stringify({ key1: 'value1', key2: 'value2' }),
      });

      const data = await response.json();
      console.log('API response:', data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  return (
    <main>
      <h1 className="text-3xl font-bold underline">{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>
            {todo.content}
          </li>
        ))}

      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
      <button onClick={sendRequest}>Send API Request</button>
    </main>
  );
}
