import React from 'react';
import axios from 'axios';

import host from '../host';

class Signin extends React.Component {
    state = {
        username: '',
        password: ''
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { username, password } = this.state
        const loginEndpoint = `${host}/api/login`;

        axios.post(loginEndpoint, { username, password })
        .then(res => {
            localStorage.setItem('jwt', res.data.token);
            this.props.history.push('/jokes');
        })  
        .catch(error => {
            this.setState({
                error: error.response.data.message,
                username: '',
                password: '',
            });
            document.getElementById('signinForm').reset();
        })    
    };

    render() {
        return (
            <>
                <h2>Sign In</h2>
                <form onSubmit={this.handleSubmit} id='signinForm'>
                    <div>
                        <label htmlFor='username'>Username</label>
                        <input 
                            name='username' 
                            id='username' 
                            value={this.state.username} 
                            onChange={this.handleInputChange} 
                            type='text'
                        >
                        </input>
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input 
                            name='password' 
                            id='password' 
                            value={this.state.password} 
                            onChange={this.handleInputChange} 
                            type='password'
                        >
                        </input>
                    </div>
                    <div>
                        <button type='submit'>Sign In</button>
                    </div>
                </form>

                {this.state.error 
                ? <p>{this.state.error}</p>
                : null
                }
            </>
        )
    }
}

export default Signin;