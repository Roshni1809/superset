import React, {  useEffect } from 'react'
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from 'axios'
//import getGuestToken from "./FetchData"
import "../App.css"

const Loader = ({tokens}) => {

    const DASHBORD_ID = "5"

    useEffect( () => {

      const getGuestToken = async () => {
        const response = await axios.get("http://localhost:5000/get")
        if(response) {
          // console.log(response.data)
          return response?.data
        }
      }

      embedDashboard({
        id : DASHBORD_ID, 
        supersetDomain: "http://192.46.214.215",
        mountPoint: document.getElementById("supersetContainer"),
        //fetchGuestToken: () => getGuestToken(tokens?.access_token, DASHBORD_ID)
        fetchGuestToken :  () => getGuestToken()
    })
 
    },[])


    return (<>
        <div id="supersetContainer" className="IFrameLoader"></div>
       </>
    )
}

export default Loader;