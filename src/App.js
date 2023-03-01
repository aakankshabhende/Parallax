import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { Home } from './Components/Home/Home';

Amplify.configure(awsconfig);

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <AmplifySignOut />
            </header>
            <Home/>
        </div>
    );
}

export default withAuthenticator(App);
