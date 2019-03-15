import React from 'react';
import axios from 'axios';

import host from '../host';

class Jokes extends React.Component {
    state = {
        jokes: []
    }

    componentDidMount() {
        const jokesEndpoint = `${host}/api/jokes`;
        const token = localStorage.getItem('jwt');
        const reqOptions = {
            headers: {
                authorization: token,
            }
        };

        axios.get(jokesEndpoint, reqOptions)
        .then(res => {
            this.setState({ jokes: res.data })
        })
        .catch(error => {
            this.setState({
                error: error.response.data.message,
                jokes: [],
            });
        });
    }

    render() {
        return (
            <>
                {this.state.error ? <p>You must sign in or sign up to access jokes!</p> :

                <ul>
                {this.state.jokes.map(joke => 
                    <li key={joke.id}>{joke.joke}</li>
                )}
                </ul>

                }
            </>
        )
    }
}

export default Jokes;