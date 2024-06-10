

import React, { useState, useEffect } from "react";
import axios from "axios";
import './BoardWrite.css';

const PlaceCategory = {
  CAFE: "CAFE",
  RESTAURANT: "RESTAURANT",
  BAR: "BAR",
  MUSEUM: "MUSEUM",
  SHOPPING: "SHOPPING",
  PARK: "PARK",
  ENTERTAINMENT: "ENTERTAINMENT"
};

function BoardWrite() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    files: [],
    placeId: "",
    state: "",
    PlaceCategory: PlaceCategory.RESTAURANT,
  });

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]); // 필터된 장소 목록을 따로 관리
  const [selectedCategory, setSelectedCategory] = useState(PlaceCategory.RESTAURANT);

  const getAccessTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
    if (cookie) {
      return cookie.split('=')[1];
    } else {
      return null;
    }
  };

  const accessToken = getAccessTokenFromCookie();
  console.log(accessToken)

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await axios.get("/place/list", {
          params: {
            state: formData.state,
            PlaceCategory: selectedCategory,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("장소 목록:", response.data);
        setPlaces(response.data);
        setFilteredPlaces(response.data); // 초기 목록 설정
      } catch (error) {
        console.error("장소 목록을 불러오는 중 에러 발생:", error);
      }
    }

    fetchPlaces();
  }, [formData.state, selectedCategory, accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 장소 필터링
    const filtered = places.filter(place =>
      place.placeName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: e.target.files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("placeId", formData.placeId);
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files", formData.files[i]);
      }

      await axios.post("/boards/write", formDataToSend, config);
      alert("게시물이 성공적으로 작성되었습니다.");
    } catch (error) {
      console.error("게시물 작성 에러:", error);
    }
  };

  return (
    <div>
      <h2>게시물 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">내용:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="files">파일 첨부:</label>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="state">지역으로 검색</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="PlaceCategory">카테고리 선택:</label>
          <select
            id="PlaceCategory"
            name="PlaceCategory"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value={PlaceCategory.CAFE}>카페</option>
            <option value={PlaceCategory.RESTAURANT}>음식점</option>
            <option value={PlaceCategory.BAR}>술집</option>
            <option value={PlaceCategory.MUSEUM}>박물관</option>
            <option value={PlaceCategory.SHOPPING}>쇼핑</option>
            <option value={PlaceCategory.PARK}>공원</option>
            <option value={PlaceCategory.ENTERTAINMENT}>오락시설</option>
          </select>
        </div>
        <div>
          <label htmlFor="placeId">장소 선택:</label>
          <select
            id="placeId"
            name="placeId"
            value={formData.placeId || ''}
            onChange={handleChange}
            required
          >
            <option key="" value="">장소를 선택하세요</option>
            {filteredPlaces.map((place) => ( // 필터링된 목록을 사용
              <option key={place.placeId} value={place.placeId}>
                {place.placeName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
}

export default BoardWrite;
