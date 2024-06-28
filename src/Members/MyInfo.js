import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyInfo.css";
import MyInfoUpdate from "./MyInfoUpdate";

const MyInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        const response = await axios.get("/members/my-info", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserInfo(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInfoUpdate = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const response = await axios.get("/members/my-info", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 회원 탈퇴하시겠습니까?")) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found");

        await axios.delete("/members/withdrawal", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // 회원 탈퇴 후 로그아웃 및 리디렉션 처리
        localStorage.removeItem("accessToken");
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "/"; // 홈 페이지로 리디렉션
      } catch (err) {
        console.error("회원 탈퇴에 실패했습니다:", err);
        setError(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="my-info-container">
      <h1>내 정보</h1>
      {isEditing ? (
        <MyInfoUpdate userInfo={userInfo} onInfoUpdate={handleInfoUpdate} />
      ) : userInfo ? (
        <div>
          {userInfo.imageUrl && (
            <div className="profile-image-container">
              <img
                className="profile-image"
                src={`/images/${userInfo.imageUrl}?${Date.now()}`}
                alt="프로필 이미지"
              />
            </div>
          )}
          <p>
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Introduction:</strong> {userInfo.introduction}
          </p>

          {/* 추가적인 사용자 정보 */}
          <div className="button-container">
            <button onClick={() => setIsEditing(true)}>회원정보 변경</button>
            <button onClick={handleDeleteAccount}>회원 탈퇴</button>
          </div>
        </div>
      ) : (
        <p>사용자 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default MyInfo;
