import cookie from "js-cookie";
import Router from "next/router";


// set the cookie in the browser cookie
// name to the token
export const setCookie = (key, value) => {

    // make sure in client side

    
    if (process.browser) {
        // expire in 5 day
        cookie.set(key, value, {expires: 5})
    }
}


// when user sign up, remove the cookie from the browser cookie
// remove need to name
export const removerCookie = (key) => {
    if (process.browser) {
        cookie.remove(key);
    }

}


// get the cookie and send to server whenever to make request to protected routes
export const getCookie = (key, req) => {
    // if (process.browser) {
    //     return cookie.get(key);
    // }

     // to get cookies from the server side, we need access to req as well
     return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
}



export const getCookieFromBrowser = (key) => {
    return cookie.get(key)
}


export const getCookieFromServer = (key, req) => {
    //running on the server, read the client's cookies by checking req.headers.cookie
    if (!req.headers.cookie) {
        return undefined;
    }

    
    console.log("req.headers.cookie: ", req.headers.cookie);
    let token = req.headers.cookie.split(";").find(c => c.trim().startsWith(`${key}=`));
    if (!token) {
        return undefined;
    }

    const tokenValue = token.split("=")[1];
    // console.log("getCookieFromServer: ", tokenValue);
    return tokenValue


}





// set in localstorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        // when storing to localstorage, need to save name as json data
        localStorage.setItem(key, JSON.stringify(value));
    }
}

//remove from localstroage
export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
}


// above functions would be utlize in the following method
// authenticate user when user successfully login, expect to get response 
// from frontend that sent post request to backend


export const authenticate = (response, next) => {
    setCookie("token", response.data.token);
    setLocalStorage("user", response.data.user);
    
    //once we save response to cookie and localstorage, expect to redirect user to home page
    next();
};


// access user from localstorage
export const hasAuth = () => {
    if (process.browser) {
        const hasCookie = getCookie("token");
        if (hasCookie) {
            if (localStorage.getItem("user")) {

                // if take data back, need to convert json to obj
                return JSON.parse(localStorage.getItem("user"));
            } else {
                return false
            }
        }
    }
}


// logout  field
export const logout = () => {
    removeLocalStorage("user");
    removerCookie("token");
    Router.push("/login");
     
}


export const updateLocalStorage = (user, next) =>  {

    // check if is client side
    if (process.browser) {
        if (localStorage.getItem("user")) {
            // save as json data, need to parse as a js object
            // let auth = JSON.parse(localStorage.getItem("user"));
            let auth = user;
            localStorage.setItem("user", JSON.stringify(auth));
            next();
        }
    }

}