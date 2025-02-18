import { useLocation } from "react-router-dom";

/* 
url의 쿼리 파라미터 값들을 한 번에 객체로 반환
(예시)
URL = http://localhost:3000?accessToken=xyz123&nickname=홍길동
return = { accessToken: "xyz123", nickname: "홍길동" }
*/
const useQueryParams = () => {
  return Object.fromEntries(new URLSearchParams(useLocation().search));
};

export default useQueryParams;
