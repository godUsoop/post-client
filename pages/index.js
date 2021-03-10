import Layout from "../components/Layout";
import axios from "axios";
import {env} from "../next.config";
import Link from "next/link";
import {useState, useEffect} from "react";
import moment from "moment";


const Home = ({ categories}) => {
    
    const [setTrending, setTrendingState] = useState([]);


    useEffect(() => {
        loadTrending();
    }, []);


    const loadTrending = async () => {
        const response = await axios.get(`${env.API}/link/popular`);
        setTrendingState(response.data);
    };


    const handleClick = async (link_Id) => {

        // send link id to backend in order to increase views
        const response = await axios.put(`${env.API}/view-count`, {link_Id});
        loadTrending();
    }


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



    const listCategories = () =>
        categories.map((element, index) => (
            <Link href={`/links/${element.slug}`}>
                <a className="bg-light col-md-4 custom">
                        <div className="row" style={{"marginLeft": "0"}}>
                            <div className="col-md-4 pb-3">
                                <img
                                    src={element.image && element.image.url}
                                    alt={element.name}
                                    style={{ width: '100px', height: 'auto' }}
                                    className="pr-3"
                                />
                            </div>
                            <div className="col-md-8" style={{"paddingLeft": "0"}}>
                                <h3>{element.name}</h3>
                            </div>
                        </div>
                </a>
            </Link>
        ));

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1 className="font-weight-bold text-center">Category</h1>
                    <br />
                </div>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <h3>Top trending</h3>
                    <br/>
                    {displayLinks()}
                </div>
                <div className="col-md-7">
                    {listCategories()}
                </div>
            </div>
        </Layout>
    );
};


// server side render
Home.getInitialProps = async () => {
    const response = await axios.get(`${env.API}/categories`);
    return {categories: response.data};
};


export default Home;



