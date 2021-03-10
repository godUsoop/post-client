import Layout from "../../../../components/Layout";
import {useEffect, useState} from "react";
import Router, {withRouter} from "next/router";
import {successMessageBox, errorMessageBox} from "../../../../helpers/alert";
import axios from "axios";
import {env} from "../../../../next.config";
import jwt from "jsonwebtoken";


const resetPassword = ({router}) => {
    const [state, setState] = useState({
        name: "",
        token: "",
        newPassword: "",
        success: "",
        error: "",
        buttonText: "Reset"
    });


    const {name, token, newPassword, success, error, buttonText} = state;

    useEffect(() => {
        const decoded = jwt.decode(router.query.token);
        
        if (decoded) {
            setState({...state, name: decoded.name, token: router.query.token});
        }
    }, [router])


    const handleChange =(event) => {
        setState({
            ...state,
            newPassword: event.target.value,
            success: "",
            error: ""
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log("email has been sent to", email)
        setState({...state, buttonText: "Sending"});

        try {
            const response = await axios.put(`${env.API}/reset-password`, {resetPasswordLink: token, newPassword});
            setState({...state, newPassword: "", success: response.data.message, buttonText: "Reset"})
            
        } catch (error) {
            setState({...state, error: error.response.data.error, buttonText: "Reset"})
        }
    }

    const form = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="password" className="form-control" onChange={handleChange} value={newPassword} placeholder="enrter your passwrod " />
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
                    <h1 className="text-center ">Hi {name}, please reset password</h1>
                    <br />
                    {success && successMessageBox(success)}
                    {error && errorMessageBox(error)}
                    {form()}
                </div>
            </div>
        </Layout>
    )
}


export default withRouter(resetPassword);