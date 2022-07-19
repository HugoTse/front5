import "@aws-amplify/ui-react/styles.css";

import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

import { Amplify, API, Storage } from 'aws-amplify';
import React, { useState, useEffect } from "react";
// Table stuff
import { Flex, 
         Table, 
         TableCell, 
         TableHead,
         TableRow,
         TableBody,
         ThemeProvider,
         Theme,
         TextAreaField,
         SelectField } from '@aws-amplify/ui-react';
import { AiTwotoneDelete } from "react-icons/ai";


// For API
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
  // Table stuff
  const theme: Theme = {
    name: 'table-theme',
    tokens: {
      components: {
        table: {
          row: {
            hover: {
              backgroundColor: { value: '{colors.blue.20}' },
            },
  
            striped: {
              backgroundColor: { value: '{colors.blue.10}' },
            },
          },
  
          header: {
            color: { value: '{colors.blue.80}' },
            fontSize: { value: '{fontSizes.xl}' },
          },
  
          data: {
            fontWeight: { value: '{fontWeights.semibold}' },
          },
        },
      },
    },
  };

  const[cid, setCid] = useState('');
  const[timestamp, setTimestamp] = useState('');
  const[thand, setThand] = useState('');
  const[fname, setFname] = useState('');
  const[lname, setLname] = useState('');
  const[dob, setDob] = useState('');
  const[region, setRegion] = useState('');
  const[text, setText] = useState('');
  const[ir, setIr] = useState('');

  // For calling the API
  const apiName = 'testing';
  const path = 'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json'; 
  const myInit = { // OPTIONAL
  headers: {}, // OPTIONAL
  response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
  // queryStringParameters: {  // OPTIONAL
  //     name: 'param',
  //   },
  };

  // For calling the API
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

  // For uploadImage
  async function onChange(e) {
    e.preventDefault();
    // If there are no files, return
    if (!e.target.files[0]) return
    // Set the variable file to the uploaded file
    const file = e.target.files[0];
    // Set the key for the file
    const imageKey = 'image/raw/' + file.name;
    setIr(imageKey);
    // Log the key
    console.log(imageKey);
    try {
      // Place the image in the bucket
      await Storage.put(imageKey, file, {
        contentType: "image/png", // contentType is optional
      })
      // This returns the key
      .then((res) => 
        console.log(res)
      );
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  // For submitComment or processImage
  async function Comment(e) {
    e.preventDefault();
    console.log(cid,
                timestamp,
                thand,
                fname,
                lname,
                dob,
                region,
                text,
                ir);
    if(ir == ''){
      // No image uploaded
      console.log('No image uploaded, so call submitComment');
      const objectKey = 'input/'+cid+'_'+timestamp+'_'+thand;
      const comment = {
        "userMetaData": {
          "campaign_id": cid,
          "timestamp": timestamp,
          "twitter_handle": thand,
          "first_name": fname,
          "last_name": lname,
          "date_of_birth": dob,
          "region": region
        },
        "data": {
          "text": text
        }
      }
      try {
        // Place the image in the bucket
        await Storage.put(objectKey, comment, {
          contentType: "application/json", // contentType is optional
        })
        // This returns the key
        .then((res) => 
          console.log(res)
        );
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    } else {
      // Image was uploaded
      console.log('Image was uploaded');
      const objectKey = 'input/'+cid+'_'+timestamp+'_'+thand;
      const comment = {
        "userMetaData": {
          "campaign_id": cid,
          "timestamp": timestamp,
          "twitter_handle": thand,
          "first_name": fname,
          "last_name": lname,
          "date_of_birth": dob,
          "region": region
        },
        "data": {
          "text": text,
          "image_reference": ir
        }
      }
      try {
        // Place the image in the bucket
        await Storage.put(objectKey, comment, {
          contentType: "application/json", // contentType is optional
        })
        // This returns the key
        .then((res) => 
          console.log(res)
        );
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
    // Reset the variables
    setCid('');
    setTimestamp('');
    setThand('');
    setFname('');
    setLname('');
    setDob('');
    setRegion('');
    setText('');
    setIr('');
  }

  return (
    <View className="App">
      <Card>
        {/* <Image src={logo} className="App-logo" alt="logo" /> */}
        <Heading level={1}>Nautilus Marketing</Heading>
      </Card>

      <div className='formDiv'>
        <Button onClick={signOut}>Sign Out</Button>
      </div>

      {/* Form onsubmit = handlesubmit */}
      {/* Upload Image */}
      <div className='formDiv'>
        <input
          type="file"
          onChange={onChange}

        />
      </div>

      {/* Inputs */}
      <h2>Comment Metadata</h2>
      <form onSubmit={Comment}>
        <div className='formDiv'>
          <input
            className='input'
            // onChange={e => setFormData({ ...formData, 'cid': e.target.value})}
            onChange={e => setCid(e.target.value)}
            placeholder="Campaign ID"
            value={cid}
          />
        </div>
        <div className='formDiv'>
          <input
            className='input'
            onChange={e => setTimestamp(e.target.value)}
            placeholder="Timestamp"
            value={timestamp}
          />
        </div>
        <div className='formDiv'>
          <input
            className='input'
            onChange={e => setThand(e.target.value)}
            placeholder="Twitter Handle"
            value={thand}
          />
        </div>
        <div className='formDiv'>
          <input
            className='input'
            onChange={e => setFname(e.target.value)}
            placeholder="First Name"
            value={fname}
          />
        </div>
        <div className='formDiv'>
          <input
            className='input'
            onChange={e => setLname(e.target.value)}
            placeholder="Last Name"
            value={lname}
          />
        </div>
        <div className='formDiv'>
          <input
            className='input'
            onChange={e => setDob(e.target.value)}
            placeholder="Date of Birth"
            value={dob}
          />
        </div>
        <div className='formDiv'>
          <input
            className='input'
            onChange={e => setRegion(e.target.value)}
            placeholder="Region"
            value={region}
          />
        </div>

        <h2>Comment</h2>
        <div className='formDiv'>
          <textarea
            className='input'
            onChange={e => setText(e.target.value)}
            placeholder="Text"
            value={text}
          />
        </div>
        <div className='formDiv'>
          <button type='submit' className='submitButton'>SUBMIT</button>
        </div>
      </form>
      {/* <div className='formDiv'>
        <input
          className='input'
          onChange={e => setFormData({ ...formData, 'text': e.target.value})}
          placeholder="Text"
          value={formData.text}
        />
      </div> */}

      <div className='testDiv'>
        <Button onClick={() => callAPI()}> Post to API GW connected to Lambda </Button>
      </div>
      <div className='testDiv'>
        <Button onClick={() => callAPI()}> Post to API GW connected to S3 </Button>
      </div>

      {/* Table stuff */}
      {/* <div className='tableDiv'>
      <ThemeProvider theme={theme} colorMode="light">
        <Table highlightOnHover variation="striped">
          <TableHead>
            <TableRow>
              <TableCell>Customer, SA, Gap</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>GCP Claim/Customer Feedback</TableCell>
              <TableCell>Win/Loss to GCP? Key factor resulting in loss and learnings</TableCell>
              <TableCell>Priority/AWS GCP Compete Team Response</TableCell>
              <TableCell>Service Team PFR / Roadmap</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <TableRow>
              <TableCell>
                <TextAreaField label="" defaultValue="..." />
              </TableCell>
              <TableCell>
                <TextAreaField label="" defaultValue="..." />
              </TableCell>
              <TableCell>
                <TextAreaField label="" defaultValue="..." />
              </TableCell>
              <TableCell>
                <TextAreaField label="" defaultValue="..." />
              </TableCell>
              <TableCell>
              <SelectField label="Select Priority">
                <option value="banana">High</option>
                <option value="orange">Medium</option>
                <option value="orange">Low</option>
              </SelectField>
              </TableCell>
              <TableCell>
                <TextAreaField label="" defaultValue="..." />
              </TableCell>
              <TableCell>
                <Button
                  loadingText=""
                  onClick={() => alert('hello')}
                  ariaLabel=""
                >
                  Submit
                </Button>
            </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Earnin Inc. Marcin J User Interface or ease of use</TableCell>
              <TableCell>Glue (Analytics)</TableCell>
              <TableCell>Earnin is looking for Business data catalog solution with easy to use GUI and they are exploring GCP's offering: https://cloud.google.com/data-catalog we do not have such offering in our portfolio. Our data catalog with Glue is an ETL tool and it does not provide an easy to use GUI for non-technical users. As for now, Earnin has not gone for GCP service as all their data is on AWS but there is a threat from GCP as Earnin's new CTO is ex-Google</TableCell>
              <TableCell>Did not lose to GCP but customer is looking at in-house build solutions. There seems to be a lot of non-technical users that look forward to easier managed offerings.</TableCell>
              <TableCell>Priority: High</TableCell>
              <TableCell>AWS is working on a business catalog solution that should be available end of this year and we want to see if this is something that will fit Earnin's requirements.</TableCell>
              <TableCell>
                <Button
                  loadingText=""
                  onClick={() => alert('hello')}
                  ariaLabel=""
                >
                  Edit
                </Button>
                <AiTwotoneDelete className='deleteIcon'/>
            </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Earnin Inc. Marcin J User Interface or ease of use</TableCell>
              <TableCell>Glue (Analytics)</TableCell>
              <TableCell>Earnin is looking for Business data catalog solution with easy to use GUI and they are exploring GCP's offering: https://cloud.google.com/data-catalog we do not have such offering in our portfolio. Our data catalog with Glue is an ETL tool and it does not provide an easy to use GUI for non-technical users. As for now, Earnin has not gone for GCP service as all their data is on AWS but there is a threat from GCP as Earnin's new CTO is ex-Google</TableCell>
              <TableCell>Did not lose to GCP but customer is looking at in-house build solutions. There seems to be a lot of non-technical users that look forward to easier managed offerings.</TableCell>
              <TableCell>Priority: High</TableCell>
              <TableCell>AWS is working on a business catalog solution that should be available end of this year and we want to see if this is something that will fit Earnin's requirements.</TableCell>
              <TableCell>
                <Button
                  loadingText=""
                  onClick={() => alert('hello')}
                  ariaLabel=""
                >
                  Edit
                </Button>
                <AiTwotoneDelete className='deleteIcon'/>
            </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ThemeProvider>
      </div> */}
      

    </View>
  );
}

export default withAuthenticator(App);