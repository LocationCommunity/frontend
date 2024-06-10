import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import './Map.css';
import { AuthContext } from '../Context/AuthContext';

const { naver } = window;

const Map = () => {
  const { accessToken } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const mapRef = useRef(null); // 지도 객체를 유지하기 위한 ref
  const markersRef = useRef([]); // 마커들을 저장하기 위한 ref
  const infoWindowRef = useRef(null); // 정보 창을 유지하기 위한 ref

  useEffect(() => {
    const fetchMapData = async () => {
      if (!accessToken) return;

      try {
        // 사용자의 현재 위치 가져오기
        navigator.geolocation.getCurrentPosition(async position => {
          const { latitude, longitude } = position.coords;
          try {
            console.log('Access Token:', accessToken); // accessToken 로그 출력
            const response = await axios.get('/place/map', {
              params: {
                x: latitude,
                y: longitude
              },
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            setLocations(response.data);
          } catch (error) {
            console.error('Error fetching locations!', error);
          }
        }, error => {
          console.error('Error fetching geolocation:', error);
        });
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchMapData();
  }, [accessToken]);

  useEffect(() => {
    if (mapRef.current) {
      // 기존 마커 제거
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = []; // 마커 배열 초기화

      locations.forEach(location => {
        // 마커 생성
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(location.x, location.y),
          map: mapRef.current,
          title: location.placeName
        });

        // 마커를 클릭했을 때 정보를 표시할 정보 창 생성
        const infoWindow = new naver.maps.InfoWindow({
          content: `
            <div class="info-window">
              <h3>${location.placeName}</h3>
              <h5><span class="bookmark-icon">&#9733;</span> ${location.bookMarkCnt}</h5>
              <h4>${location.category}</h4>
              <p>주소: ${location.address}</p>
            </div>
          `
        });

        // 마커를 클릭했을 때 정보 창 열기
        naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          infoWindow.open(mapRef.current, marker);
          infoWindowRef.current = infoWindow;

          // 장소 이름을 클릭했을 때 추가 정보 보여주기
          document.querySelector('.info-window h3').addEventListener('click', async () => {
            try {
              const response = await axios.get(`/place/info/${location.placeId}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              });
              setAdditionalInfo(response.data);
            } catch (error) {
              console.error('Error fetching place details:', error);
            }
          });
        });

        markersRef.current.push(marker); // 마커 배열에 추가
      });

      // 지도의 여백을 클릭했을 때 정보 창 닫기
      naver.maps.Event.addListener(mapRef.current, 'click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      });
    }
  }, [locations]);

  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.504277, 126.7620249),  // TODO: 좌표값을 사용자의 현재위치로 기본지정
      zoom: 15,
      zoomControl: true
    };

    mapRef.current = new naver.maps.Map('map', mapOptions);

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="App2">
      <div id="map" className="map" />
      {additionalInfo && (
        <div className="additional-info">
          <h3>{additionalInfo.placeName}</h3>
          <p>{additionalInfo.address}</p>
          <p>{additionalInfo.placeInfo}</p>
          <p>{additionalInfo.category}</p>
          <p>{additionalInfo.bookmarkCnt}</p>
          <div className="image-container">
            {additionalInfo.placeImage && additionalInfo.placeImage.map((image, index) => (
              <img key={index} src={`/place/info/images/${image}`} alt={`장소 이미지 ${index + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
