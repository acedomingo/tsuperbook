import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { GET_ROUTES } from "../graphql/Queries";

function GetRoutes() {
    const { error, loading, data } = useQuery(GET_ROUTES);
    const [routes, setRoutes] = useState([]);
    useEffect(() => {
        if (data) {
        setRoutes(data.routes);
        }
    }, [data]);

    return (
    <div id = "route_test"> { routes.map((val) => {
        console.log(val.longName)
        })} </div>
    );
}    

export default GetRoutes
