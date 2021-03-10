import Layout from "../components/Layout";
import {useState, useEffect} from "react";
import axios from "axios";
import Router from "next/router";
import Link from "next/link";
import {successMessageBox, errorMessageBox} from "../helpers/alert";
import {env} from "../next.config";
import {authenticate, hasAuth} from "../helpers/auth";

const Login = () => {

    const [setRegister, setRegisterState] = useState({
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Login'
    });

    // if has authentication then redirect to home page
    useEffect(() => {
        hasAuth() && Router.push("/");
    }, [])




    const {email, password, error, success, buttonText} = setRegister;

    const handleChange = (name) => (event) => {
        return (
            setRegisterState({
                ...setRegister,
                [name]: event.target.value,
                error: "",
                success: "",
                buttonText: "Login"
            })
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
       
        // send register data to backend server
        const server_url = `${env.API}/login`;
        setRegisterState({
            ...setRegister,
            buttonText: "Logging in"
        })

        try {
            const response = await axios.post(server_url, {
                email: email,
                password: password
            })
            console.log(response);

            authenticate(response, () => {
                return hasAuth() && hasAuth().role === "admin" ? Router.push("/admin") : Router.push("/user");
            });

        } catch (error) {
            console.log(error);
            setRegisterState({
                ...setRegister,
                buttonText: "Login",
                error: error.response.data.error
            })
        }
    }

    const form = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="email" className="form-control" onChange={handleChange("email")} value={email} placeholder="enter email" />
            </div>
            <div className="form-group">
                <input type="password" className="form-control" onChange={handleChange("password")} value={password} placeholder="Enter password" />
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-secondary btn-lg">{buttonText}</button>
            </div>
        </form>
    );
    

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1 className="register-heading text-center">Login</h1> 
                {success && successMessageBox(success)}
                {error && errorMessageBox(error)}
                {form()}
                <div className="text-center pt-2">
                    <Link href="/auth/password/forgot" >
                            <a className="text-danger custom">forgot password?</a>
                    </Link>
                </div>
            </div>            
        </Layout>
    )
}





export default Login;

