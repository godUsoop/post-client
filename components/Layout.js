import Head from 'next/head';
import Link from "next/link";
import Nprogress from "nprogress";
import Router from "next/router";
import {hasAuth, logout} from "../helpers/auth";
import "nprogress/nprogress.css";
// import { isDynamicRoute } from 'next/dist/next-server/lib/router/utils';




Router.events.on('routeChangeStart', (url) => {Nprogress.start();});
Router.events.on("routeChangeComplete", () => {Nprogress.done();});
Router.events.on("routeChangeError", () => {Nprogress.done();});



const Layout = ({children}) => {
    


    const head = () => (
        <>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossOrigin="anonymous" />
        </>
    );

    const nav = () => (
        <ul className="nav nav-tabs" style={{"backgroundColor": "#c7ffd8"}}>
            <li className="nav-item">
                <Link href="/">
                    <a className="nav-link text-dark">
                        Home
                    </a>
                </Link>
            </li>

            <li className="nav-item">
                <Link href="/user/link/create">
                    <a className="nav-link text-dark">
                        post a link
                    </a>
                </Link>
            </li>
            

            {
                !hasAuth() && 
                <>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link text-dark" href="/login">
                                Login
                            </a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/register">
                            <a className="nav-link text-dark">
                                Register
                            </a>
                        </Link>
                    </li>
                </>
            }


            {/* dealing with admin and user page */}
            {
                hasAuth() && hasAuth().role === "admin" && 
                    <>
                        <li className="nav-item margin">
                            <Link href="/admin">
                                <a className="nav-link text-dark">{hasAuth().name}</a>
                            </Link>
                        </li>
                    </>
            }

            {
                hasAuth() && hasAuth().role === "subscriber" && 
                    <>
                        <li className="nav-item margin">
                            <Link href="/user">
                                <a className="nav-link text-dark">{hasAuth().name}</a>
                            </Link>
                        </li>
                    </>
            }

            {
                hasAuth() && (
                    <li className="nav-item">
                        {/* we do not need link because it is not going to take you anywhere */}
                        <a onClick={logout} className="nav-link text-dark">Logout</a>
                    </li>
                )

            }            
        </ul>
    )   

    return (
        <>  
            {head()}
            {nav()}
            <div className="container pt-5 pb-5">
                {children}
            </div>
            
        </>
    )

}

export default Layout;
