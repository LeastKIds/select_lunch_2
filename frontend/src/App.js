import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import RestaurantBoxComponent from "./component/RestaurantBoxComponent";
import Modal from 'react-modal';


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

  const [mapref, setMapRef] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});


  Modal.setAppElement('#root');


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
        console.log(data);
        setRestaurants(data);
        
      } catch (error) {
        console.error(error);
      }
    })();


  }

  const onMarkerDragEnd = (event) => {
    // const lat = event.latLng.lat()
    // const lng = event.latLng.lng()

    // const newPos = {
    //   lat: lat,
    //   lng: lng
    // };
    // setPosition(newPos);

    // setLatitude(lat);
    // setLongitude(lng);
    console.log(event);
  };

  const handleOnLoad = map => {
    setMapRef(map);
  };
  const handleCenterChanged = () => {
    if (mapref) {
      const newCenter = mapref.getCenter();
      console.log(newCenter);
    }
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
        <div>
          <p>latitude: {position.lat}</p>
          <p>longitude: {position.lng}</p>
        </div>
        
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

          onLoad={handleOnLoad}
          
          
        >
          <>
            {
           
              (restaurants && restaurants["results"]) && 
              <>
                {
                  restaurants["results"].map((data, index) => 
                  
                    <MarkerF 
                      position={{lat: data["geometry"]["location"]["lat"], lng: data["geometry"]["location"]["lng"]}}
                      draggable={false}
                      onClick={() => {
                        setModalData(data);

                        setModalIsOpen(true);
                      
                      }}
                    />
                  )
                }
              </>
            }

            
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
        

      <Modal 
        isOpen={modalIsOpen}
        
        style={{
          content: {
            width: '500px',
            height: '700px',
            margin: 'auto', // 모달을 화면 중앙에 위치시킵니다.
            display: 'flex', // Flexbox를 사용하여 내용을 정렬합니다.
            flexDirection: 'column', // 아이템을 세로로 정렬합니다.
            justifyContent: 'space-between' // 상단과 하단의 컨텐츠를 분리합니다.
          }
        }}
      >
        <h1>name: {modalData.name}</h1>
        <button onClick={()=> setModalIsOpen(false)}>Modal Close</button>
      </Modal>

    </div>
  );
}


export default App;
