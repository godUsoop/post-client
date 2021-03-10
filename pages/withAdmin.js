import axios from "axios";
import {env} from "../next.config";
import {getCookie} from "../helpers/auth"



// take page as props
// const withAdmin = (Page) => {
    
//     const onlyAdminUser = (props) => <Page {...props} />
    
//     onlyAdminUser.getInitialProps = async (context) => {
//         const token = getCookie("token", context.req);
//         let userInfo = null;
//         let userLinks = [];
        

//         if (token) {
//             try {
//                 const response = await axios.get(`${env.API}/admin`, {
//                     headers: {
//                         authorization: `Bearer ${token}`,
//                         contentType: "application/json"
//                     }
//                 });
//                 // userInfo = response.data;
//                 userInfo = response.data.user;
//                 userLinks = response.data.links;
                

//             } catch (error) {
//                 if (error.response.status === 401) {
//                     userInfo = null;
//                 }
//             }
//         }

//         if (userInfo === null) {
//             // telling server-side of the application to send some new header information
//             // redirect  to home page
//             context.res.writeHead(302, {Location: "/"})

//             // To finish it off, res.end() to let the application know to execute the changes
//             context.res.end();
//         } else {
//             return {
//                 // If the page has a prop fetcher invoke it
//                 ...(Page.getInitialPorps ? await Page.getInitialProps(context): {}),
//                 userInfo,
//                 token,
//                 userLinks
//             };

//         }
        
//     };

//     return onlyAdminUser;
// }


// export default withAdmin;


const withAdmin = Page => {
    const onlyAdminUser = props => <Page {...props} />;
    onlyAdminUser.getInitialProps = async context => {
        const token = getCookie('token', context.req);
        let user = null;
        let userLinks = [];

        if (token) {
            try {
                const response = await axios.get(`${env.API}/admin`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        contentType: 'application/json'
                    }
                });
                user = response.data.user;
                userLinks = response.data.links;
            } catch (error) {
                if (error.response.status === 401) {
                    user = null;
                }
            }
        }

        if (user === null) {
            // redirect on server side
            context.res.writeHead(302, {
                Location: '/'
            });
            context.res.end();
        } else {
            return {
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user,
                token,
                userLinks
            };
        }
    };

    return onlyAdminUser;
};

export default withAdmin;
