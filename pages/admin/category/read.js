import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import axios from "axios";
import {useState, useEffect} from "react";
import {env} from "../../../next.config";
import {successMessageBox, errorMessageBox} from "../../../helpers/alert";
import Link from "next/link";


const Read = ({userInfo, token}) => {

    const [state, setState] = useState({
        error: '',
        success: '',
        categories: []
    });


    const {error, succes, categories} = state;


    useEffect(() => {
        loadCategories();
    }, []);


    const loadCategories = async () => {
        const response = await axios.get(`${env.API}/categories`);
        setState({...state, categories: response.data})
    }



    const checkDelete = (event, slug) => {
        // console.log("delete post: ", slug);
        event.preventDefault();

        const popUpConfirm = window.confirm("Do yo want to delete category?");

        if (popUpConfirm) {
            handleDelete(slug);
        }
    }

     const handleDelete = async (slug) => {
         try {

            const response = await axios.delete(`${env.API}/category/${slug}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Category delete successfully: ", response);
            loadCategories();

         } catch(error) {
            console.log("Category delete failed: ", error);
         }

     }


    const listCategories = () =>
        categories.map((element, index) => (
            <Link key={index} href={`/links/${element.slug}`}>
                <a className="bg-light p-3 col-md-4 custom">
                    <div>
                        <div className="row">
                            <div className="col-md-3">
                                <img
                                    src={element.image && element.image.url}
                                    alt={element.name}
                                    style={{ width: '100px', height: 'auto' }}
                                    className="pr-3"
                                />
                            </div>
                            <div className="col-md-6">
                                <h3>{element.name}</h3>
                            </div>
                            <div className="col-md-3">
                                <Link href={`/admin/category/${element.slug}`}>
                                    <button className="btn btn-sm btn-secondary mb-2">Update</button>
                                </Link>
                                <button onClick={(event) => checkDelete(event, element.slug)} className="btn btn-sm btn-secondary">Delete</button>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        ));


    return (
        <Layout>
            <div className="row">{listCategories()}</div>
        </Layout>
    )

};





export default withAdmin(Read);