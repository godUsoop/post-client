import Layout from "../../../components/Layout";
import {useState} from "react";
import {Router} from "next/router";
import {successMessageBox, errorMessageBox} from "../../../helpers/alert";
import axios from "axios";
import {env} from "../../../next.config";





const forgotPassword = () => {

    const [state, setState] = useState({
        email: "",
        success: "",
        error: "",
        buttonText: "Forgot password"
    });

    const {email, success, error, buttonText} = state;

    
    const handleChange =(event) => {
        setState({
            ...state,
            email: event.target.value,
            success: "",
            error: ""
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log("email has been sent to", email)

        try {
            const response = await axios.put(`${env.API}/forgot-password`, {email: email});
            setState({...state, email: "", success: response.data.message, buttonText: "Email sent"})
            
        } catch (error) {
            setState({...state, error: error.response.data.error, buttonText: "Forgot password"})
        }
    }

    const form = () => {
        return (

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    
                    <input type="email" className="form-control" onChange={handleChange} value={email} placeholder="enrter your email" />

                </div>
                <div className="text-center">
                    <button className="btn btn-secondary btn-lg" onSubmit={handleSubmit}>{buttonText}</button>
                </div>
            </form>
        )
    }

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    
                    <h1 className="text-center ">Forgot password</h1>
                    <br />
                    {success && successMessageBox(success)}
                    {error && errorMessageBox(error)}
                    {form()}
                </div>
            </div>
        </Layout>
    )

};




export default forgotPassword;