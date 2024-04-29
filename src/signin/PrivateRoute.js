import React, {useContext} from "react"
import {Route, Redirect} from "react-router-dom"
import {AuthContext} from "./FirebaseAuth"

const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    const {user} = useContext(AuthContext)
    return ( 
        <Route
            render={routeProps => 
               !!user ?<RouteComponent {...routeProps} />
               :<Redirect to={'/firebaseSignin'} />
            }
        />
    )
}

export default PrivateRoute
