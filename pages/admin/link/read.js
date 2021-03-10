import Layout from "../../../components/Layout";
import axios from "axios";
import {useEffect, useState} from "react";
import {env} from "../../../next.config";
import Link from "next/link";
import reactHtml from "react-render-html";
import moment from "moment";
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from "../../withAdmin";
import {getCookie} from '../../../helpers/auth';
import Router from "next/router";



const Links = ({links, totalLinks, linksLimit, linkSkip, token}) => {

    
    


    const [setLinks, setLinksState] = useState(links);


    // to determine load more or not
    const [setLimit, setLimitState] = useState(linksLimit);
    const [setSkip, setSkipState] = useState(0);
    const [setSize, setSizeState] = useState(totalLinks);


    const checkDelete = (event, id) => {

        event.preventDefault();

        const popUpConfirm = window.confirm("Do yo want to delete category?");

        if (popUpConfirm) {
            handleDelete(id);
        }
    }

    const handleDelete = async (id) => {
        try {

            const response = await axios.delete(`${env.API}/link/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Link delete successfully: ", response);

            // once deleted link, it still in browser; unless refetch from backend
            process.browser && window.location.reload();
            

            

        } catch(error) {
            console.log("link delete failed: ", error);
        }

    }





    const allLinks = () => {
        return (
            setLinks.map((link, index) => {
                return (
                    <div className="row">
                        <div className="col-md-8 filter-drop-shadow box">
                            <a className="custom text-secondary" href={link.url} target="_blank">
                                <h3 onClick={() => handleClick(link._id)} className="title-width">{link.title}</h3>
                            </a>
                            <div className="col-md-4">
                                <span className="badge text-dark">{moment(link.createdAt).fromNow()} added by {link.postedBy.name}</span>
                                {/* <span className="badge text-dark">{moment(link.createdAt).fromNow()} added by </span> */}
                                
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
                                <a className="custom"><span className="badge text-dark">Update</span></a>
                            </Link>


                        </div>
                    </div>
                )
            })
        )
    }

    const handleLoad = async () => {
        let Skips = setSkip + setLimit;
        const response = await axios.post(`${env.API}/links/`, {skip: Skips, limit: setLimit}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })


        
        setLinksState([...setLinks, ...response.data])
        setSizeState(response.data.length);
        setSkipState(Skips);

    }

    // const loadButton = () => {
    //     return (
    //         setSize > 0 && setSize >= setLimit && (
    //             <div className="text-center">
    //                 <button onClick={handleLoad} className="btn btn-lg btn-secondary">Load more links</button>
    //             </div>
    //         )
    //     )
    // }

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1>All links</h1>
                </div>
            </div>
            <br/>
            <div className="row" style={{"paddingTop": "150px"}}>
                <div className="col-md-4">
                    <h2>top trending</h2>
                    <p>show links</p>
                </div>
            
                <div className="col-md-8">
                    {allLinks()}
                    {/* {loadButton()} */}
                </div>
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-8 text-center">
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleLoad}
                            hasMore={setSize > 0 && setSize >= setLimit }
                            // loader={<div className="loader" key={0}>Loading ...</div>}
                            loader={<img key={0} className="custom-image" src="/static/images/loading.gif" alt="loading" />}
                        >
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
            
        </Layout>
    )
};

Links.getInitialProps = async ({req}) => {

    let skip = 0;
    let limit = 2;
    const token = getCookie("token", req)

    // get slug from query
    const response = await axios.post(`${env.API}/links/`, {skip, limit}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return {
        links: response.data,
        totalLinks: response.data.length,
        linksLimit: limit,
        linkSkip: skip,
        token
    }
}

export default withAdmin(Links);
