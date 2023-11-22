import axios from "axios";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import RestaurantBoxComponent from "./component/RestaurantBoxComponent";
import Modal from 'react-modal';

import CustomMap from './component/map/CustomMap'

import tomatoImg from './img/tomato.jpg'
import decayTomatoImg from './img/decay_tomato.png'
import greenTomato from './img/green_tomato.png'

function App() {

  const url = "https://f160-126-44-208-85.ngrok-free.app"

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

  const [reviewOpen, setReviewOpen] = useState(false);


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
        const response = await client.post( url + "/search/" + keyword, {
          lat: position.lat, lng: position.lng
        });
        const data = response.data;
        console.log(data);
        setRestaurants(data);
        
      } catch (error) {
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

      
      <div>
        <CustomMap 
          handleSetPosition={handleSetPosition} 
          position={position} restaurants={restaurants} 
          handleSetModalData={handleSetModalData} 
          handleModalIsOpen={handleModalIsOpen}
          url={url}
          client={client}
          />
      </div>


      <div style={{display: "flex", justifyContent: "Center", marginTop: "20px"}}>
        <button>
          next
        </button>
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
        <p>current open: {modalData.current_opening_hours?.open_now !== null ? modalData.current_opening_hours?.open_now.toString() : "ignorance"}</p>
        {
          modalData.current_opening_hours?.weekday_text &&
          <>
            {
              modalData.current_opening_hours.weekday_text.map( (date, index) => 
                <p key={index}>{date}</p>
              )
            }
          </>
        }
        <p>address: {modalData.formatted_address}</p>
        <p>telephone: {modalData.formatted_phone_number}</p>
        <p>delivery: {modalData.delivery ? modalData.delivery.toString() : 'ignorance'}</p>
        <p>takeout: {modalData.takeout ? modalData.takeout.toString() : 'ignorance'}</p>
        <p>price_level: {modalData.price_level}</p>
        <p>map: {modalData.url}</p>
        <p>website: {modalData.website}</p>

        <p>keyward: {modalData.types ? modalData.types.join(', ') : 'ignorance'}</p>
        <button onClick={() => setReviewOpen(true)}>review open</button>
        {
          reviewOpen && 
          <div>
            <img src={
              modalData.reviewEvaluation === "POSITIVE" ? tomatoImg :
              modalData.reviewEvaluation === "NEGATIVE" ? decayTomatoImg : greenTomato 
              } style={{width: "100px"}}/>

            {
              modalData.reviews.map( (review, index) => 
              <div key={index}>
                <h3>{review.author_name}</h3>
                <p>{review.text}</p>
                <button
                  onClick={async () => {
                    const response = await client.post(url + '/search/reviews/translation', {text: review.text})
                    console.log(response.data.translationText);
                    setModalData(prevObject => ({
                      ...prevObject, 
                      reviews: prevObject.reviews.map(item => item.text === review.text ? {...item, translationJp: response.data.translationText} : item)
                    }))
                  }}
                >日本語で機械翻訳</button>
                {
                  review.translationJp &&
                  <p>{review.translationJp}</p>
                }


                <p>{review.relative_time_description}</p>
                <p>url: {review.author_url}</p>
                
              </div>
              )
            }
            <button onClick={() => setReviewOpen(false)}>review close</button>
          </div>
        }

        <button onClick={()=> setModalIsOpen(false)}>Modal Close</button>
      </Modal>


      <div style={{textAlign: "center"}}>
        <p>tomato: <a href="https://kr.freepik.com/free-vector/sticker-design-with-tomato-isolated_16460149.htm#query=tomato&position=2&from_view=keyword&track=sph&uuid=438d58b3-3343-43fb-997f-9b8a7a818a29">작가 brgfx</a> 출처 Freepik</p>
      </div>
    </div>
  );
}


export default App;
