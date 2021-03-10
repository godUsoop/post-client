import Layout from "../../components/Layout";
import axios from "axios";
import {useEffect, useImperativeHandle, useState} from "react";
// import { set } from "nprogress";
import {env} from "../../next.config";
import {getCookie} from "../../helpers/auth"; 
import withUser from "../withUser";
import moment from "moment";
import Router from "next/router";

import Link from "next/link";



const User = ({userInfo, userLinks, token}) => {
    
    
    

 
    const checkDelete = (event, id) => {
        // console.log("delete post: ", slug);
        event.preventDefault();

        const popUpConfirm = window.confirm("Do yo want to delete category?");

        if (popUpConfirm) {
            handleDelete(id);
        }
    }

     const handleDelete = async (id) => {

        console.log("delete id: ", id);

        try {

            const response = await axios.delete(`${env.API}/link/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Link delete successfully: ", response);
            // once deleted link, return to dashboard
            Router.replace("/user");
            // Router.push("/user");

         } catch(error) {
            console.log("link delete failed: ", error);
         }

     }


    const displayLinks = () => {
        return userLinks.map((link, index) => {
            return (
                <div className="row" key={index}>
                        <div className="col-md-8 filter-drop-shadow box">
                            <a className="custom text-secondary" href={link.url} target="_blank">
                                <h3 className="title-width">{link.title}</h3>
                            </a>
                            <div className="col-md-4">
                                <span className="badge text-dark">{moment(link.createdAt).fromNow()} added by {link.postedBy.name}</span>
                                
                            </div>
                            <div className="col-md-12">
                                <span className="badge text-dark">
                                    {link.type}
                                </span>
                                <span className="badge text-dark">
                                    {link.medium}
                                </span>
                                {link.categories.map((link, index) => {
                                    return <span className="badge text-dark">{link.name}</span>
                                })}        
                            </div>
                            <span className="badge text-dark">{link.views} views</span>
                            <span onClick={(event) => checkDelete(event, link._id)} className="badge text-dark">Delete</span>
                            <Link href={`/user/link/${link._id}`}>
                                <span className="badge text-dark">Update</span>
                            </Link>
                        </div>
                </div>
            )     
        })
    }
    


    return (
        <Layout>
            
            <h1>
                {userInfo.name}'s Dashboard / {userInfo.role}
            </h1>
            <br />
            <div className="row">

                <div className="col-md-4">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/user/link/create">
                                <a className="nav link custom">Post a link</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/user/profile/update">
                                <a className="nav link custom">Update proflie</a>
                            </Link>
                        </li>
                    </ul>

                </div>
                <div className="col-md-8">
                    <h2>My posted links</h2>
                    <br/>
                    {displayLinks()}
                </div>


            </div>
        </Layout>
    )
}






// run in the both enviroment; client and server

// User.getInitialProps = async (context) => {

    
//     const token = getCookie("token", context.req);

//     try {
//         // second arg is header that we need to send because this is a protect route
//         const response = await axios.get(`${env.API}/user`, {
//             headers: {
//                 authorization: `Bearer ${token}`,
//                 contentType: "application/josn"
//             }
//         });

//         return {userInfo: response.data}

//     } catch(error) {
//         if (error.response.status === 401) {
//             return {userInfo: "user not found"}
//         }
//     }
    
// }


// wiht HOC 
// export default User;
export default withUser(User);




