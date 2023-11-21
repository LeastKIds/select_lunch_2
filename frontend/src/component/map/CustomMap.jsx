import React, { useEffect, useRef, useState, } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat  } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style';

const CustomMap = ({position, handleSetPosition, restaurants}) => {
  const mapRef = useRef();
  const [map, setMap] = useState();

  useEffect(() => {
    console.log('lat:' + position.lat);
    console.log('lng: ' + position.lng);
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
        zoom: 18,
      }),
    });

    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, [position]);

  useEffect(() => {
    if (!map) return;

    // 클릭 이벤트 리스너 추가
    const handleClick = (event) => {
      // 클릭한 지점의 좌표 추출
      const coordinate = toLonLat(event.coordinate);
      const [longitude, latitude] = coordinate;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      handleSetPosition({lat: latitude, lng: longitude});
    };

    map.on('singleclick', handleClick);

    return () => {
      if (map) {
        // 이벤트 리스너 제거
        map.un('singleclick', handleClick);
      }
    };
  }, [map, position]);


  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default CustomMap;