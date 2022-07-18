import './App.css';
import "@aws-amplify/ui-react/styles.css";

import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import { Amplify, API } from 'aws-amplify';

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "uploadImage",
        endpoint: "https://7covdp4jnl.execute-api.us-west-2.amazonaws.com/dev"
      },
      {
        name: "testing",
        endpoint: "http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json"
      }
    ]
  }
})

function App({ signOut }) {

const apiName = 'testing';
const path = 'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json'; 
const myInit = { // OPTIONAL
headers: {}, // OPTIONAL
response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
// queryStringParameters: {  // OPTIONAL
//     name: 'param',
//   },
};

async function callAPI() { 
    // const apiName = 'uploadImage';
    // const path = '20220714s3bucket/test3.jpeg';
    // const myInit = { // OPTIONAL
    //     body: {}, // replace this with attributes you need
    //     headers: {}, // OPTIONAL
    // };
    // return await API.post(apiName, path, myInit);
    console.log('Invoked callAPI function');
    API
    .get(apiName, path, myInit)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error.response);
    });
}


  return (
    <View className="App">
      <Card>
        {/* <Image src={logo} className="App-logo" alt="logo" /> */}
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>

      <Button onClick={() => callAPI()}> POSTING </Button>
    </View>
  );
}

export default withAuthenticator(App);