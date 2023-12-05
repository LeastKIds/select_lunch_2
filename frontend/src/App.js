import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import RestaurantBoxComponent from "./component/RestaurantBoxComponent";
import Modal from 'react-modal';

import CustomMap from './component/map/CustomMap'


import { Paper, TextField } from "@mui/material";
import SearchCard from "./component/map/SearchCard";
import SwipeableEdgeDrawer from "./component/map/SwipeableEdgeDrawer";


function App() {

  const url = "https://44da-126-44-208-85.ngrok-free.app"

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

  const keywordsButtonStyle = {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  }
  const keywordsButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const [address, setAddress] = useState('');

  const [keyword, setkeyword] = useState('');
  const [restaurants, setRestaurants] = useState(null);
  const handleSetRestaurants = (newRestaurants) => {
    setRestaurants(newRestaurants);
  }
  
  const [latitude, setLatitude] = useState(35.67642344101245);
  const [longitude, setLongitude] = useState(139.65002534640476);

  const [position, setPosition] = useState({lat: latitude, lng: longitude});
  const handleSetPosition = (newPosition) => {
    setPosition(newPosition)
  } 

  const [mapref, setMapRef] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleModalIsOpen = (newModalIsOpen) => {
    setModalIsOpen(newModalIsOpen);
  } 
  const [modalData, setModalData] = useState({});
  const handleSetModalData = (newModalData) => {
    setModalData(newModalData);
  }
  const handleRestaurantBoxSetModalData = (response, review) => {
    setModalData(prevObject => ({
      ...prevObject, 
      reviews: prevObject.reviews.map(item => item.text === review.text ? {...item, translationJp: response.data.translationText} : item)
      }))
  }

  const [reviewOpen, setReviewOpen] = useState(false);

  const [keywordsButton, setKeywordsButton] = useState([]);

  const [bestRestaurant, setBestRestaurant] = useState([]);
  const handleSetBestRestaurant = (newBestRestaurant) => {
    setBestRestaurant(newBestRestaurant);
  }

  const [path, setPath] = useState(null);
  const setPathHandler = (newPath) => {
    setPath(newPath);
  }



  Modal.setAppElement('#root');



  const handleInputChange = (event) => {
    setkeyword(event.target.value)
  }

  const handleAddressInputChange = (event) => {
    setAddress(event.target.value);
  }

  const handleButton = () => {
    (async () => {
      try {
        // const response = await axios.get("http://leastkids@leastkids.iptime.org:8080/search/" + keyword);
        // const response = await axios.get("http://126.44.208.85:8080/search/" + keyword);
        // const response = await client.get("https://2901-126-44-208-85.ngrok-free.app/search/" + keyword);
        const response = await client.post( url + "/search/" + keyword, {
          lat: position.lat, lng: position.lng, next_page_token: null
        });
        const data = response.data;
        console.log(data);
        setRestaurants(data);
        
      } catch (error) {
        console.error(error);
      }
    })();
  }

  const handleGeocoding = () => {
    (async () => {
      try {

        const response = await client.get(url + "/search/geocoding/" + address);
        const data = response.data;
        setPosition({lat: data.lat, lng: data.lng});

      } catch (error) {
        console.error(error);
      }
    })();
  }

  const handleInitAddress = () => {
    setPosition({lat: 35.6667076, lng: 139.7143023})
  }

  const handleNextPage = () => {
    (async () => {
      try {
        const response = await client.post(url + '/search/' + keyword, {
          lat: 0.0, lng: 0.0, next_page_token: restaurants.next_page_token
        })

        const data = response.data
        console.log(data);
        setRestaurants(data);
      } catch(error) {
        console.error(error);
      }
    })();
  }

  const handleKeywordsButton = (keyword) => {
    (async () => {
      try {
        const response = await client.get(url + '/search/best/' + keyword);
        console.log(response.data);
        setRestaurants(null);
        setBestRestaurant(response.data);
        setkeyword(keyword);
      } catch(error) {
        console.error(error);
      }
    })();
  }

  

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
      <SearchCard props={{client: client,
         url: url, 
         restaurants: restaurants,
         handleSetRestaurants: handleSetRestaurants,
         handleSetBestRestaurant: handleSetBestRestaurant,
         position: position,
         handleSetPosition: handleSetPosition
         }} />

      
      <div>
        <CustomMap 
          handleSetPosition={handleSetPosition} 
          position={position} restaurants={restaurants} 
          handleSetModalData={handleSetModalData} 
          
          url={url}
          client={client}
          keyword={keyword}
          bestRestaurant={bestRestaurant}
          path={path}
          setPathHandler={setPathHandler}
          />
      </div>

      
         
      <SwipeableEdgeDrawer props={{restaurants: restaurants, 
        keyword: keyword, url: url, client: client, 
        position: position, handleRestaurantBoxSetModalData: handleRestaurantBoxSetModalData}}/>
      
      {/* {
        restaurants && restaurants.next_page_token !== null &&
        <div style={{display: "flex", justifyContent: "Center", marginTop: "20px"}}>
          <button style={buttonStyle} onClick={handleNextPage}>
            next
          </button>
        </div>

      } */}

      {/* <div>
        {
          modalData && 
          <>
            <RestaurantBoxComponent modalData={modalData} client={client} url={url} handleRestaurantBoxSetModalData={handleRestaurantBoxSetModalData}/>
          </>
        }
      </div> */}
        
    </div>
  );
}


export default App;
