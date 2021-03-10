import axios from "axios";
import {env} from "../next.config";
import {getCookie} from "../helpers/auth"
import {Router} from "next/router";



const withUser = Page => {
    const onlyAuthUser = props => <Page {...props} />;
    onlyAuthUser.getInitialProps = async context => {
        const token = getCookie('token', context.req);
        let userInfo = null;
        let userLinks = [];

        if (token) {
            try {
                const response = await axios.get(`${env.API}/user`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        contentType: 'application/json'
                    }
                });
                console.log('response in withUser', response);
                userInfo = response.data.user;
                userLinks = response.data.links;
            } catch (error) {
                if (error.response.status === 401) {
                    userInfo = null;
                }
            }
        }

        if (userInfo === null) {
            // redirect on server side
            context.res.writeHead(302, {
                Location: '/'
            });
            context.res.end();

            
        } else {
             
            return {
                // Get the page's own initial props
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                userInfo,
                token,
                userLinks
            };
        }
    };

    return onlyAuthUser;
};

export default withUser;
