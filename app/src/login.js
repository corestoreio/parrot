import React from 'react';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    setValue(field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    }

    register(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={this.register.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="emailInput">Email address</label>
                        <input
                            type="email"
                            onChange={this.setValue.bind(this, 'email')}
                            className="form-control"
                            id="emailInput"
                            placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput">Password</label>
                        <input
                            type="password"
                            onChange={this.setValue.bind(this, 'password')}
                            className="form-control"
                            id="passwordInput"
                            placeholder="Password"/>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary">
                    Register
                    </button>
                </form>
            </div>
        )
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    setValue(field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    }

    login(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.login.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="emailInput">Email address</label>
                        <input
                            type="email"
                            onChange={this.setValue.bind(this, 'email')}
                            className="form-control"
                            id="emailInput"
                            placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput">Password</label>
                        <input
                            type="password"
                            onChange={this.setValue.bind(this, 'password')}
                            className="form-control"
                            id="passwordInput"
                            placeholder="Password"/>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary">
                    Login
                    </button>
                </form>
            </div>
        )
    }
}

export { Register, Login }