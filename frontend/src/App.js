import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import RestaurantBoxComponent from "./component/RestaurantBoxComponent";


function App() {

  const client = axios.create({
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'ngrok-skip-browser-warning': true,
      Authorization: `Bearer ${process.env.REACT_APP_NGROK}`
    }
  })


  const containerStyle = {
    display: 'flex',
    justifyContent: 'center', // 수평 정렬을 위해
    // alignItems: 'center', // 수직 정렬을 하려면 이 속성을 사용하세요.
    // height: '100vh' // 컨테이너의 높이를 화면 전체 높이로 설정,
    marginTop: "100px"
  };

  const inputStyle = {
    padding: '10px',
    margin: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer'
  };

  const mapStyle = {
    display: "flex",
    justifyContent: "center"
  }

  const [keyword, setkeyword] = useState('');
  const [restaurants, setRestaurants] = useState(null);
  

  const handleInputChange = (event) => {
    setkeyword(event.target.value)
  }

  const handleButton = () => {
    (async () => {
      try {
        // const response = await axios.get("http://leastkids@leastkids.iptime.org:8080/search/" + keyword);
        // const response = await axios.get("http://126.44.208.85:8080/search/" + keyword);
        // const response = await client.get("https://2901-126-44-208-85.ngrok-free.app/search/" + keyword);
        const response = await client.post("https://2901-126-44-208-85.ngrok-free.app/search/" + keyword, {
          lat: latitude, lng: longitude
        });
        const data = response.data;
        console.log(response);
        // setRestaurants(data);
        // console.log(data)
        // console.log(restaurants)
      } catch (error) {
        console.error(error);
      }
    })();


  }

  const containerStyle2 = {
    width: '700px',
    height: '400px'
  };

  const[latitude, setLatitude] = useState(35.67642344101245);
  const[longitude, setLongitude] = useState(139.65002534640476);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude); 
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    }

  }, []);
  
  

  const googleApi = process.env.REACT_APP_GOOGLE_MAP_API

  return (
    <div className="App">
      <div style={containerStyle}>
        <input type="text" style={inputStyle} placeholder="여기에 입력하세요" value={keyword} onChange={handleInputChange} />
        <button style={buttonStyle} onClick={handleButton}>클릭</button>
        <br />
        <br />
        <br />
        <br />
        

      </div>

      <div style={mapStyle}>
        <LoadScript
        googleMapsApiKey={googleApi}
      >
        <GoogleMap
          mapContainerStyle={containerStyle2}
          center={{lat: latitude, lng: longitude}}
          zoom={14}
        >
          <></>
        </GoogleMap>
      </LoadScript>
      </div>

      <div>
        {
          restaurants && 
          <>
            <RestaurantBoxComponent restaurants={restaurants["results"]} />
          
            {/* {restaurants["results"].map(result => <div>{result["name"]}</div>)} */}
          </>
        }
      </div>
        
    </div>
  );
}


export default App;
