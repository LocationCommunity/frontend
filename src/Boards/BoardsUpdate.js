import React, { useState } from 'react';
import axios from 'axios';

const BoardsUpdate = ({ boardId, initialData }) => {
  const [placeId, setPlaceId] = useState(initialData.placeId || '');
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('placeId', placeId);
    formData.append('boardRequestDto', JSON.stringify({ title, content }));

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const token = localStorage.getItem('accessToken'); 
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`/board/${boardId}`, formData, config);
      alert('게시물이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('게시물 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Place ID:</label>
        <input
          type="text"
          value={placeId}
          onChange={(e) => setPlaceId(e.target.value)}
        />
      </div>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Files:</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>
      <button type="submit">수정하기</button>
    </form>
  );
};

export default BoardsUpdate;
