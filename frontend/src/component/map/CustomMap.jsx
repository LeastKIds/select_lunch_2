import React, { useEffect, useRef, useState, } from 'react';
import * as ol from 'ol';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat  } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon, Stroke } from 'ol/style';
import { LineString } from 'ol/geom';

const CustomMap = ({position, handleSetPosition, handleSetModalData, restaurants, client, url, keyword, bestRestaurant}) => {
  const mapRef = useRef();
  const [map, setMap] = useState();

  const [markers, setMarkers] = useState([]);

  const [path, setPath] = useState(null);
  const [currentPathFeature, setCurrentPathFeature] = useState(null);
  const [vectorSourceSave, setVectorSourceSave] = useState(null);

  const [pointermove, setPointermove] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);
  const [popupContent, setPopupContent] = useState({});

  const bestRestaurantRouteColor = ["blue", "red", "purple"]
  const [bestPath, setBestPath] = useState(null);
  const [bestPathFeature, setBestPathFeature] = useState([]);

  useEffect(() => {
    // 지도 초기화
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([position.lng, position.lat]),
        zoom: 16,
      }),
    });

    const vectorSource = new VectorSource();

    const currentMarker = new Feature({
      geometry: new Point(fromLonLat([position.lng, position.lat]))
    });

    currentMarker.setStyle(new Style({
      image: new Icon({
        color: 'rgba(255, 0, 0, .5)',
        src: 'https://openlayers.org/en/latest/examples/data/icon.png'
      })
    }));

    vectorSource.addFeature(currentMarker);

    const markersArray = []

    if(restaurants !== null &&restaurants !== undefined && restaurants.results !== null &&restaurants.results !== undefined && restaurants.results && restaurants.results.length !== 0) {
        const results = restaurants.results;
        results.forEach( (result, index) => {

          const marker = new Feature({
            geometry: new Point(fromLonLat([result.geometry.location.lng, result.geometry.location.lat]))
          });

          marker.setStyle(new Style({
            image: new Icon({
              
              src: 'https://openlayers.org/en/latest/examples/data/icon.png'
            })
          }));

          vectorSource.addFeature(marker);
          markersArray.push([marker, result]);
        })
    } else if(bestRestaurant !== null && bestRestaurant !== undefined && bestRestaurant.length !== 0) {
      
        const results = bestRestaurant;
        const bp = [];

        results.forEach( (result, index) => {
          const marker = new Feature({
            geometry: new Point(fromLonLat([result.result.geometry.location.lng, result.result.geometry.location.lat]))
          });
          marker.setStyle(new Style({
            image: new Icon({
              src: 'https://openlayers.org/en/latest/examples/data/icon.png'
            })
          }));
          vectorSource.addFeature(marker);
          markersArray.push([marker, result.result]);
          bp.push(result.result.graphHopperResponse.paths[0]);
          
        })

        setBestPath(bp);

    }

    setMarkers(markersArray);

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    initialMap.addLayer(vectorLayer);

    // 클릭 이벤트 리스너 추가
    const handleClick = (event) => {
      let clickedOnFeature = false;

      const handleMarkerClick = async (markersArray, feature) => {

        markersArray.forEach(async clickMarker => {
          if(clickMarker[0] === feature) {
            const response = await client.post(url + '/search/place', {
              place_id: clickMarker[1].place_id, 
              keyword: keyword,
              startLat: position.lat,
              startLng: position.lng,
              endLat: clickMarker[1].geometry.location.lat,
              endLng: clickMarker[1].geometry.location.lng
            })
            const result = response.data.result;
            handleSetModalData(result);
            setPath(result.graphHopperResponse);
            console.log(result);
           

            
          }
        })
      }

      initialMap.forEachFeatureAtPixel(event.pixel, async (feature, layer) => {
        clickedOnFeature = true;
        // 여기서 마커 클릭 처리 로직을 추가할 수 있습니다.
        if(currentMarker === feature) {
          console.log("현재 위치: ", feature);
        } else {
          await handleMarkerClick(markersArray, feature);
        }
      });
    
      

      if (!clickedOnFeature) {
        // 마커가 아닌 지도의 빈 공간 클릭 처리
        const coordinate = toLonLat(event.coordinate);
        const [longitude, latitude] = coordinate;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        handleSetPosition({lat: latitude, lng: longitude});
      }

      
    };

    initialMap.on('singleclick', handleClick);

    

    setMap(initialMap);
    setVectorSourceSave(vectorSource);

    return () => {
      initialMap.setTarget(undefined)
      if (initialMap) {
        // 이벤트 리스너 제거
        initialMap.un('singleclick', handleClick);
      }
    };
  }, [position, restaurants, bestRestaurant]);


  useEffect(() => {
    if(currentPathFeature) {
      vectorSourceSave.removeFeature(currentPathFeature);
    }

    if(path) {
      const pathCoordinates = path.paths[0].points.coordinates;
      const olCoordinates = pathCoordinates.map(coord => fromLonLat(coord));
      const lineString = new LineString(olCoordinates);

      const lineStyle = new Style({
                  stroke: new Stroke({
                      color: 'blue',
                      width: 5
                  })
              });

      const lineFeature = new Feature({
                  geometry: lineString
              });

      lineFeature.setStyle(lineStyle);
      vectorSourceSave.addFeature(lineFeature);
      setCurrentPathFeature(lineFeature);
      setVectorSourceSave(vectorSourceSave);
    }
    
  }, [path]);

  useEffect(() => {
    if(!pointermove && map) {
  
      map.on('pointermove', (event) => {
        if(map.hasFeatureAtPixel(event.pixel)) {
          
          const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
          if(feature === currentPathFeature) {
            setPopupVisible(true);
            setPopupX(event.originalEvent.clientX);
            setPopupY(event.originalEvent.clientY);
            setPopupContent({
              distance: path.paths[0].distance,
              time: path.paths[0].time
            });
            
          } else {
            setPopupVisible(false);
          }
        } else {
          setPopupVisible(false);
        }
      });
    }
  }, [currentPathFeature]);

  useEffect(() => {
    if(bestPath && bestPath.length !== 0) {
      const routeFeature = []; 

      bestPath.forEach( (bp, index) => {
        const pathCoordinates = bp.points.coordinates;
        const olCoordinates = pathCoordinates.map(coord => fromLonLat(coord));
        const lineString = new LineString(olCoordinates);

        const lineStyle = new Style({
                    stroke: new Stroke({
                        color: bestRestaurantRouteColor[index],
                        width: 5+index
                    })
                });

        const lineFeature = new Feature({
                    geometry: lineString
                });

        lineFeature.setStyle(lineStyle);
        vectorSourceSave.addFeature(lineFeature);

        routeFeature.push(lineFeature);
      })

      setBestPathFeature(routeFeature);
      setVectorSourceSave(vectorSourceSave);
    }
  }, [bestPath]);

  return <>
    <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
    <Popup visible={popupVisible} x={popupX} y={popupY} content={popupContent} />
  </>
};

export default CustomMap;


const Popup = ({ visible, x, y, content }) => {
  if (!visible) return null;

  const style = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    // 추가적인 스타일링
    backgroundColor: 'white', // 하얀색 배경
    border: '1px solid black', // 검정색 테두리
    padding: '10px', // 안쪽 여백
    borderRadius: '10px', // 모서리 둥글게
    boxShadow: '0px 0px 10px rgba(0,0,0,0.5)', // 그림자 효과
  };

  const formatMilliseconds = (milliseconds) => {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // 두 자리 숫자로 포맷
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  return <div style={style}><p>거리: {content.distance}M <br/> 시간: {formatMilliseconds(content.time)}</p></div>;
};