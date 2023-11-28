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

const CustomMap = ({position, handleSetPosition, handleSetModalData, handleModalIsOpen, restaurants, client, url, keyword}) => {
  const mapRef = useRef();
  const [map, setMap] = useState();

  const [markers, setMarkers] = useState([]);

  const [path, setPath] = useState(null);
  const [currentPathFeature, setCurrentPathFeature] = useState(null);
  const [vectorSourceSave, setVectorSourceSave] = useState(null);

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
            
            const routeResponse = await client.post(url + '/mapRoute/minDistances', {
              startLat: position.lat,
              startLng: position.lng,
              endLat: clickMarker[1].geometry.location.lat,
              endLng: clickMarker[1].geometry.location.lng
            });
            console.log(routeResponse.data);
            setPath(routeResponse.data);

            const response = await client.post(url + '/search/place', {place_id: clickMarker[1].place_id, keyword: keyword})
            const result = response.data.result;
            // console.log(result);
            handleSetModalData(result);
            handleModalIsOpen(true);

            
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

          // markersArray.forEach(async clickMarker => {
          //   if(clickMarker[0] === feature) {
          //     if(currentPathFeature) {
          //       console.log("원래 있었음");
          //       vectorSource.removeFeature(currentPathFeature);
          //     }

          //     const routeResponse = await client.post(url + '/mapRoute/minDistances', {
          //       startLat: position.lat,
          //       startLng: position.lng,
          //       endLat: clickMarker[1].geometry.location.lat,
          //       endLng: clickMarker[1].geometry.location.lng
          //     });
          //     console.log(routeResponse.data);
          //     setPath(routeResponse.data);

          //     const pathCoordinates = routeResponse.data.paths[0].points.coordinates;
              
          //     // OpenLayers의 좌표 형식으로 변환
          //     const olCoordinates = pathCoordinates.map(coord => fromLonLat(coord));

          //     // LineString 객체 생성
          //     const lineString = new LineString(olCoordinates);

          //     // LineString에 대한 스타일 설정
          //     const lineStyle = new Style({
          //         stroke: new Stroke({
          //             color: 'blue',
          //             width: 5
          //         })
          //     });

          //     // LineString Feature 생성
          //     const lineFeature = new Feature({
          //         geometry: lineString
          //     });

          //     // 스타일 적용
          //     lineFeature.setStyle(lineStyle);

          //     // 벡터 소스에 LineString Feature 추가
          //     vectorSource.addFeature(lineFeature);
              
          //     setCurrentPathFeature(lineFeature);

          //     const response = await client.post(url + '/search/place', {place_id: clickMarker[1].place_id, keyword: keyword})
          //     const result = response.data.result;
          //     // console.log(result);
          //     handleSetModalData(result);
          //     handleModalIsOpen(true);

              
          //   }
          // })
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
  }, [position, restaurants]);


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
    
    // const pathCoordinates = path.paths[0].points.coordinates;
    //       // OpenLayers의 좌표 형식으로 변환
    //       const olCoordinates = pathCoordinates.map(coord => fromLonLat(coord));

    //       // LineString 객체 생성
    //       const lineString = new LineString(olCoordinates);

    //       // LineString에 대한 스타일 설정
    //       const lineStyle = new Style({
    //           stroke: new Stroke({
    //               color: 'blue',
    //               width: 5
    //           })
    //       });

    //       // LineString Feature 생성
    //       const lineFeature = new Feature({
    //           geometry: lineString
    //       });

    //       // 스타일 적용
    //       lineFeature.setStyle(lineStyle);

    //       // 벡터 소스에 LineString Feature 추가
    //       vectorSourceSave.addFeature(lineFeature);
          
    //       console.log("저장 돼? " + lineFeature);
    //       setCurrentPathFeature(lineFeature);
    //       setVectorSourceSave(vectorSourceSave);
    
  }, [path]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default CustomMap;