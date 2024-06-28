import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyInfoUpdate({ onInfoUpdate, userInfo }) {
  const [file, setFile] = useState(null);
  const { accessToken } = useContext(AuthContext);
  const [updateRequest, setUpdateRequest] = useState({
    nickname: userInfo.nickname || "",
    introduction: userInfo.introduction || "",
  });
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setUpdateRequest({
        nickname: userInfo.nickname,
        introduction: userInfo.introduction,
      });
    }
  }, [userInfo]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateRequest({
      ...updateRequest,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nickname", updateRequest.nickname);
    formData.append("introduction", updateRequest.introduction);

    if (file) {
      formData.append("file", file);
    } else if (userInfo.imageUrl) {
      try {
        const response = await fetch(`/images/${userInfo.imageUrl}`);
        if (!response.ok) throw new Error("Failed to fetch image");
        const blob = await response.blob();
        const fileFromBlob = new File([blob], userInfo.imageUrl, {
          type: blob.type,
        });
        formData.append("file", fileFromBlob);
      } catch (error) {
        console.error("Failed to fetch image:", error);
        setNotification("프로필 이미지를 가져오는 데 실패했습니다.");
        return;
      }
    }

    try {
      const response = await axios.put("/members/my-info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNotification("회원 정보가 성공적으로 업데이트되었습니다.");
      onInfoUpdate(); // 부모 컴포넌트의 사용자 정보 다시 불러오기
    } catch (error) {
      console.error("회원 정보 업데이트에 실패했습니다:", error);
      setNotification("회원 정보 업데이트에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nickname"
        value={updateRequest.nickname}
        placeholder={userInfo.nickname || "닉네임"}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="introduction"
        value={updateRequest.introduction}
        placeholder={userInfo.introduction || "소개"}
        onChange={handleInputChange}
      />
      {userInfo.imageUrl && (
        <div className="profile-image-container">
          <img
            className="profile-image"
            src={`/images/${userInfo.imageUrl}?${Date.now()}`}
            alt="프로필 이미지"
          />
        </div>
      )}
      <input type="file" onChange={handleFileChange} />
      <div className="button-container">
        <button type="submit">업데이트</button>
        <button
          className="back-button"
          onClick={() => navigate("/members/my-info")}
        >
          뒤로가기
        </button>
      </div>
      {notification && <p>{notification}</p>}
    </form>
  );
}

export default MyInfoUpdate;
