import Layout from "../../../components/Layout";
import {useState, useEffect} from "react";
import axios from "axios";
import {successMessageBox, errorMessageBox} from "../../../helpers/alert";
import {env} from "../../../next.config";
import {hasAuth, updateLocalStorage} from "../../../helpers/auth";
import Router from "next/router";
import withUser from "../../withUser";



const Profile = ({userInfo, token}) => {

    const [setRegister, setRegisterState] = useState({
        name: userInfo.name,
        email: userInfo.email,
        password: '',
        error: '',
        success: '',
        buttonText: 'Update',
        loadCategories: [],

        // user favoirte categories; sending to backend as a user information
        categories: userInfo.categories
    });

    const { name, email, password, error, success, buttonText, loadCategories, categories } = setRegister;




    // when display success message, RUN runLoadCategories
    useEffect(() => {
        runLoadCategories();
    }, [])


    
    const runLoadCategories = async () => {
        const response = await axios.get(`${env.API}/categories`);
        setRegisterState({...setRegister, loadCategories: response.data})
    }



    const handleToggle = (elementId) => () => {
        const click = categories.indexOf(elementId);
        const allCategories = [...categories];

        // if click is not in loadCategories
        if (click === -1) {
            allCategories.push(elementId);
        // if category has been already in loadCategories then remove it from array
        } else {
            allCategories.splice(click, 1);
        }


        setRegisterState({...setRegister, categories: allCategories, success: "", error: ""})

    }




    
    

    const categoryDisplay = () => {
        return (
            loadCategories && loadCategories.map((element, index) => {
                return (
                    <li key={element._id}>
                        <input type="checkBox" checked={categories.includes(element._id)} style={{"marginRight": "5px"}} onChange={handleToggle(element._id)}/>
                        <label className="form-check-label">{element.name}</label>
                    </li>
                )
                
            })
        )
    };


    

    const handleChange = (name) => (event) => {
        return (
            setRegisterState({
                ...setRegister,
                [name]: event.target.value,
                error: "",
                success: "",
                buttonText: "Update"
            })
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
       
        // send register data to backend server
        // const server_url = `${env.API}/user`;
        setRegisterState({
            ...setRegister,
            buttonText: "Updating"
        })

        try {
            const response = await axios.put(`${env.API}/user`, {
                name: name,
                password: password,
                categories: categories
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Update profile response: ", response);
            updateLocalStorage(response.data, () => {
                setRegisterState({
                    ...setRegister,
                    buttonText: "Updated", 
                    success: "Updated successfully"
    
                });
            });

        } catch (error) {
            console.log("error: ", error);
            setRegisterState({
                ...setRegister,
                buttonText: "Update",
                error: "Update failed"
            })
        }
    }

    const form = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="text" className="form-control" onChange={handleChange("name")}  value={name} placeholder="Enter name" />
            </div>
            <div className="form-group">
                <input type="email" disabled className="form-control" onChange={handleChange("email")} value={email} placeholder="enter email" />
            </div>
            <div className="form-group">
                <input type="password" className="form-control" onChange={handleChange("password")} value={password} placeholder="Enter password" />
            </div>
            <div>
                <button type="submit" className="btn btn-secondary">{buttonText}</button>
            </div>
        </form>
    );
    

    return (
        <Layout>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="text-muted mb-1">Your favorite categories</label>
                        <ul style={{"listStyleTyp": "none", "paddingLeft": "10px", "maxHeight": "100px", "overflowY": "scroll"}}>{categoryDisplay()}</ul>
                    </div>

                </div>
                <div className="col-md-8">
                    <h1 className="register-heading">Update profile</h1>
                    {success && successMessageBox(success)}
                    {error && errorMessageBox(error)}   
                    {form()}
                </div>
                
            </div>
        </Layout>
    )
}





export default withUser(Profile);

