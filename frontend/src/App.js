import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
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

  
  const containerStyle2 = {
    width: '700px',
    height: '400px'
  };

  const markerStyle = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];


  const [keyword, setkeyword] = useState('');
  const [restaurants, setRestaurants] = useState(null);
  
  const [latitude, setLatitude] = useState(35.67642344101245);
  const [longitude, setLongitude] = useState(139.65002534640476);

  const [position, setPosition] = useState({lat: latitude, lng: longitude});
  const [selectedMarker, setSelectedMarker] = useState(null);


  const googleApi = process.env.REACT_APP_GOOGLE_MAP_API


  const handleInputChange = (event) => {
    setkeyword(event.target.value)
  }

  const handleButton = () => {
    (async () => {
      try {
        // const response = await axios.get("http://leastkids@leastkids.iptime.org:8080/search/" + keyword);
        // const response = await axios.get("http://126.44.208.85:8080/search/" + keyword);
        // const response = await client.get("https://2901-126-44-208-85.ngrok-free.app/search/" + keyword);
        const response = await client.post("https://8475-126-44-208-85.ngrok-free.app/search/" + keyword, {
          lat: latitude, lng: longitude
        });
        const data = response.data;
        // console.log(response);
        setRestaurants(data);
        // console.log(data)
        // console.log(restaurants)
      } catch (error) {
        console.error(error);
      }
    })();


  }

  const onMarkerDragEnd = (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    const newPos = {
      lat: lat,
      lng: lng
    };
    setPosition(newPos);

    setLatitude(lat);
    setLongitude(lng);
  };


  

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

  useEffect(() => {
    setPosition({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);
  
  

  

  return (
    <div className="App">
      <div style={containerStyle}>
        <input type="text" style={inputStyle} placeholder="여기에 입력하세요" value={keyword} onChange={handleInputChange} />
        <button style={buttonStyle} onClick={handleButton}>클릭</button>
        <p>latitude: {latitude}</p>
        <p>longitude: {longitude}</p>
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
          center={position}
          zoom={13}
          options={{disableDefaultUI: true, styles: markerStyle}}
          onClick={(e) => {setPosition({lat: e.latLng.lat(), lng: e.latLng.lng()})}}

        >
          <>
            <MarkerF 
              position={position}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
            />

            
          </>
        </GoogleMap>
      </LoadScript>
      </div>

      <div>
        {
          restaurants && 
          <>
            <RestaurantBoxComponent restaurants={restaurants["results"]} />
          </>
        }
      </div>
        
    </div>
  );
}


export default App;
