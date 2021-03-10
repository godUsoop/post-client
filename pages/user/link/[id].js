import Layout from "../../../components/Layout";
import axios from "axios";
import {useState, useEffect} from "react";
import {env} from "../../../next.config";
import {successMessageBox, errorMessageBox} from "../../../helpers/alert";
import {getCookie, hasAuth} from "../../../helpers/auth";
import withUser from "../../withUser";





const Update = ({oldLink, token}) => {
    

    const [setPost, setPostState] = useState({
        // for link, populate category to categories array when clicking
        title: oldLink.title,
        url: oldLink.url,
        categories: oldLink.categories,
        success: "",
        error: "",
        type: oldLink.type,
        medium: oldLink.medium,
        // for application; when creating a new category
        loadCategories: []
    });

    const {title, url, categories, loadCategories, success, error, type, medium} = setPost;

    // when display success message, RUN runLoadCategories
    useEffect(() => {
        runLoadCategories();
    }, [success])


    
    const runLoadCategories = async () => {
        const response = await axios.get(`${env.API}/categories`);
        setPostState({...setPost, loadCategories: response.data})
    }

    const handleTitle = (event) => {
        setPostState({...setPost, title: event.target.value, success: "", error: ""});
    }
    
    const handleURL = (event) => {
        setPostState({...setPost, url: event.target.value, success: "", error: ""});
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


        setPostState({...setPost, categories: allCategories, success: "", error: ""})

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


    const handleTypeClick = (event) => {
        setPostState({...setPost, type: event.target.value, success: "", error: ""});

    }

    const handleMediumClick = (event) => {
        setPostState({...setPost, medium: event.target.value, success: "", error: ""});

    }

    const typeDisplay = () => {
        return (
            <>
                <li>
                    <input type="radio" style={{"marginRight": "5px"}} name="type" value="free" checked={type === "free"} onClick={handleTypeClick}/>
                    <label className="form-check-label">Free</label>
                </li>
                <li>
                    <input type="radio" style={{"marginRight": "5px"}} name="type" value="paid" checked={type === "paid"} onClick={handleTypeClick}/>
                    <label className="form-check-label">Paid</label>
                </li>
            </>
        )
        
    };

    const mediumDisplay = () => {
        return (
            <>
                <li>
                    <input type="radio" style={{"marginRight": "5px"}} name="medium" value="video" checked={medium === "video"} onClick={handleMediumClick}/>
                    <label className="form-check-label">Video</label>
                </li>
                <li>
                    <input type="radio" style={{"marginRight": "5px"}} name="medium" value="article" checked={medium === "article"} onClick={handleMediumClick}/>
                    <label className="form-check-label">Article</label>
                </li>
            </>
        )
        
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.table({title, url, type, medium, categories});
        // link modify base on role
        let updateUrl;

        if (hasAuth() && hasAuth().role === "admin") {
            updateUrl = `${env.API}/link/admin/${oldLink._id}`
        } else {
            updateUrl = `${env.API}/link/${oldLink._id}`
        }

        try {
            const response = await axios.put(updateUrl, {title, url, categories, type, medium}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            // setPostState({...setPost, success: "Link is posted", title: "", url: "", medium: "", type: "", loadCategories: [], categories: []});
            setPostState({...setPost, success: "link is updated"});

            
        } catch(error) {
            console.log("Update link error: ", error);
            setPostState({...setPost, error: error.response.data.error})

        }

    }
    


    const form = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" className="form-control" onChange={handleTitle} value={title} />
                </div>
                <div className="form-group">
                    <label>URL</label>
                    <input type="url" className="form-control" onChange={handleURL} value={url} />
                </div>
                <div className="form-group">
                    <button disabled={!token} className="btn btn-secondary btn-lg">{hasAuth() || token ? "Update" : "Please login"}</button>
                </div>
            </form>
        )
    }


    return (
        <Layout>
            <div className="row">
                <div className="col-md-12 offset-md-4">
                    <h1>Update a link</h1>
                    <br />
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="text-muted mb-1">Category</label>
                        <ul style={{"listStyleTyp": "none", "paddingLeft": "10px", "maxHeight": "100px", "overflowY": "scroll"}}>{categoryDisplay()}</ul>
                    </div>
                    <div className="form-group">
                        <label className="text-muted mb-1">Type</label>
                        <ul style={{"listStyleTyp": "none", "paddingLeft": "10px", "maxHeight": "100px", "overflowY": "scroll"}}>{typeDisplay()}</ul>
                    </div>
                    <div className="form-group">
                        <label className="text-muted mb-1">Medium</label>
                        <ul style={{"listStyleTyp": "none", "paddingLeft": "10px", "maxHeight": "100px", "overflowY": "scroll"}}>{mediumDisplay()}</ul>
                    </div>         
                </div>
                <div className="col-md-8">
                    {success && successMessageBox(success)}
                    {error && errorMessageBox(error)}
                    {form()}
                </div>
            </div>
        </Layout>
    )
    
};

// destructure context 
Update.getInitialProps = async ({req, token, query}) => {

    try {
        const response = await axios.get(`${env.API}/link/${query.id}`);
        return {oldLink: response.data, token};
    } catch(error) {
        console.log(error); 
    }
    
}


export default withUser(Update);