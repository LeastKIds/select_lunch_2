import axios from "axios";
import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function App() {

  const client = axios.create({
    withCredentials: false,
    headers: {
      'Access-Control-Allow_credentials': true,
      'ngrok-skip-brower-warning': true,
      Authorization: `Bearer ${process.env.NGROK}`
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

  

  const handleInputChange = (event) => {
    setkeyword(event.target.value)
    console.log(keyword)
  }

  const handleButton = () => {
    (async () => {
      try {
        console.log("test")
        // const response = await axios.get("http://leastkids@leastkids.iptime.org:8080/search/" + keyword);
        // const response = await axios.get("http://126.44.208.85:8080/search/" + keyword);
        const response = await client.get("https://4e39-126-44-208-85.ngrok-free.app/search/" + keyword);
        const result = response.data.results;



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

  const success = (event) => {
    console.log(event.coords.latitude);
    console.log(event.coords.longitude);

    setLatitude(event.coords.latitude);   // 위도
    setLongitude(event.coords.longitude);  // 경도
  }

  const error = (event) => {
    console.log(event);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude)
          console.log(position.coords.longitude)
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude); 
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    }

  }, []);
  
  const center = {
    lat: latitude,
    lng: longitude
  };

  

  const googleApi = process.env.GOOGLE_MAP_API

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
        
    </div>
  );
}


export default App;
