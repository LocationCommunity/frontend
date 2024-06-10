
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./BoardsLists.css"; // CSS 파일 import
import LoadingSpinner from './LoadingSpinner';

function BoardsList() {
    const [boardsList, setBoardsList] = useState([]);
    const [page, setPage] = useState(0); // 현재 페이지, 초기값을 1로 설정
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
    const pageSize = 10; // 고정된 페이지 크기
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부

    const observer = useRef();
    const lastBoardRef = useRef();

    // 데이터 로드 함수
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/boards/lists?page=${page}&size=${pageSize}`);
            setBoardsList((prevList) => [...prevList, ...res.data]);
            // 데이터가 없으면 hasMore 상태를 false로 설정
            if (res.data.length < pageSize) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Intersection Observer 초기화 및 설정
    useEffect(() => {
        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting && !isLoading && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        observer.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "20px",
            threshold: 0.3,
        });

        const currentRef = lastBoardRef.current;
        if (currentRef) {
            observer.current.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.current.unobserve(currentRef);
            }
        };
    }, [isLoading, hasMore]);

    // 페이지 변경 시 데이터 로드
    useEffect(() => {
        if (hasMore) {
            fetchData();
        }
    }, [page]);

    // boardsList 변경 시 마지막 항목 관찰
    useEffect(() => {
        if (lastBoardRef.current && observer.current) {
            observer.current.observe(lastBoardRef.current);
        }
    }, [boardsList]);

    return (
        <div className="boards-container">
            <h1>게시판 목록</h1>
            <Link to="/boards" className="create-post-button">게시물 작성</Link>
            <ul className="boards-list">
                {boardsList.map((board, index) => (
                    <li className="boards-item" key={index} ref={index === boardsList.length - 1 ? lastBoardRef : null}>
                        <Link className="boards-link" to={`/boards/${board.boardId}`}>
                            <div className="image-container">
                                {board.boardImage && board.boardImage.map((image, imgIndex) => (
                                    <img key={imgIndex} src={`/images/${image}`} alt={`게시판 이미지 ${imgIndex + 1}`} />
                                ))}
                            </div>
                            <div className="boards-content">
                                <h2 className="boards-title">{board.title}</h2>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            {isLoading && <LoadingSpinner />}
        </div>
    );
}

export default BoardsList;

