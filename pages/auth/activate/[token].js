import Layout from "../../../components/Layout";
import {useEffect, useState} from "react";
import {withRouter} from "next/router";
import jwt from "jsonwebtoken";
import {successMessageBox, errorMessageBox} from "../../../helpers/alert";
import axios from "axios";
import {env} from "../../../next.config";



const activateAccount = ({router}) => {


    const [setAccountInfo, setAccountInfoState] = useState({
        name: "",
        token: "",
        success: "",
        error: "",
        buttonText: "activate"
    });

    const {name, token, success, error, buttonText} = setAccountInfo;

   
    useEffect(() => {
        const token = router.query.token;
        if (token) {
            // returns the decoded payload without verifying if the signature is valid
            const {name} = jwt.decode(token);
            setAccountInfoState({...setAccountInfo, name: name, token: token})
        }
    }, [router]);


    const handleClick = async (event) => {
        event.preventDefault();
        setAccountInfoState({...setAccountInfo, buttonText: "activating"})

        try {
            const response = await axios.post(`${env.API}/register/activate`, {token: token});
            setAccountInfoState({...setAccountInfo, name: "", token: "", buttonText: "activated", success: response.data.message})


        } catch (error) {
            console.log(error.response)
            setAccountInfoState({...setAccountInfo, buttonText: "activate", error: error.response.data.error})

        }
    }

    return (
        <Layout>
            
                <div className="col-md-6 offset-md-3">
                    <h1>Hi {name},</h1>
                    <h1>Click the button below to activate</h1>
                    <br />
                    {success && successMessageBox(success)}
                    {error && errorMessageBox(error)}
                    <button  className="btn btn-secondary btn-lg" onClick={handleClick}>{buttonText}</button>

                </div>
            
        </Layout>
    );

}



export default withRouter(activateAccount);
