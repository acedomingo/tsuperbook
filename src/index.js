import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// link to apollo server

const client = new ApolloClient({
    uri: 'https://84bc7d14af86-6212955561195407312.ngrok-free.app/otp/routers/default/index/graphql',
    cache: new InMemoryCache(),
  });

// main render

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render (
    <ApolloProvider client ={client}>
        <App />
    </ApolloProvider>
)