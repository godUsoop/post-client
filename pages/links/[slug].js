import Layout from "../../components/Layout";
import axios from "axios";
import {useEffect, useState} from "react";
import {env} from "../../next.config";
import Link from "next/link";
import reactHtml from "react-render-html";
import moment from "moment";
import InfiniteScroll from 'react-infinite-scroller';



const Links = ({query, category, links, totalLinks, linksLimit, linkSkip}) => {
    


    const [setLinks, setLinksState] = useState(links);
    const [setTrending, setTrendingState] = useState([]);


    // to determine load more or not
    const [setLimit, setLimitState] = useState(linksLimit);
    const [setSkip, setSkipState] = useState(0);
    const [setSize, setSizeState] = useState(totalLinks);

    // load trending
    useEffect(() => {
        loadTrending()
    }, []);


    const loadTrending = async () => {
        const response = await axios.get(`${env.API}/link/popular/${category.slug}`)
        setTrendingState(response.data);
    }


    const handleClick = async (link_Id) => {
        const response = await axios.put(`${env.API}/view-count`, {link_Id});
        updateLinks();
        loadTrending();
    };


    const updateLinks = async () => {

        // set skip and limit to default;
        const response = await axios.post(`${env.API}/category/${query.slug}`);
        setLinksState(response.data.links)

    }


    const allLinks = () => {
        return (
            setLinks.map((link, index) => {
                return (
                    <div className="row" style={{"marginLeft": "20px"}}>
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
                        </div>
                    </div>
                )
            })
        )
    }

    const handleLoad = async () => {
        let Skips = setSkip + setLimit;

        const response = await axios.post(`${env.API}/category/${query.slug}`, {skip: Skips, limit: setLimit});
        
        setLinksState([...setLinks, ...response.data.links])
        setSizeState(response.data.links.length);
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


    const displayLinks = () => {
        return (
            setTrending.map((link, index) => {
                return (
                    <div className="row alert alert-secondary">
                        <div className="col-md-6" onClick={() => handleClick(link._id)}>
                            <a href={link.url} target="_blank" className="custom text-secondary">{link.title}</a>
                        </div>
                        <div className="col-md-6">
                            <span className="badge text-dark">{moment(link.createdAt).fromNow()} added by {link.postedBy.name} </span>
                            {/* <span className="badge text-dark">{moment(link.createdAt).fromNow()} added by  </span> */}
                        </div>
                        <div className="colmd-12">
                            <span className="badge text-dark">{link.type} {link.medium}</span>
                            <span className="badge text-dark">{link.views} views</span>
                                {link.categories.map((category, index) => {
                                    return (
                                        <span className="badge text-dark">{category.name}</span>
                                    )
                                })}
                        </div>

                    </div>
                )
            })
        )
    }

    return (
        <Layout>
            <div className="row">
                <div className="col-md-4">
                    <img src={category.image.url} alt={category.name} style={{"width": "auto", "maxHeight": "150px"}}></img>
                </div>
                <div className="col-md-8">
                    <h1>{category.name}</h1>
                    <div>{reactHtml(category.content) || ""}</div>
                </div>
            </div>
            <br/>
            <div className="row" style={{"paddingTop": "150px"}}>
                <div className="col-md-5">
                    <h2>top trending</h2>
                    {displayLinks()}
                </div>
            
                <div className="col-md-7">
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

Links.getInitialProps = async ({query, req}) => {
    
    
    // for infinite scrolling
    let skip = 0;
    let limit = 2;

    // get slug from query
    const response = await axios.post(`${env.API}/category/${query.slug}`, {skip, limit})
    return {
        query,
        category: response.data.category,
        links: response.data.links,
        totalLinks: response.data.links.length,
        linksLimit: limit,
        linkSkip: skip
    }
}

export default Links;
