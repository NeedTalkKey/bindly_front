import urlParamsUtil from "../../util/urlparams.js";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext.js"; // AuthContext import

const SaveToLocalStorage = () => {
  // AuthContext에서 login 함수를 가져옴
  const { login } = useContext(AuthContext);
  const params = urlParamsUtil(); // URL에서 query param을 객체로 받아옴
  const navigate = useNavigate();

  useEffect(() => {
    if ("token" in params && "nickname" in params) {
      localStorage.setItem("token", params["token"]);
      localStorage.setItem("nickname", params["nickname"]);
      localStorage.setItem("user_model", params["user_model"]);
      login(params["token"], params["nickname"], params["user_model"]);
      navigate("/");
    }
  }, [params, navigate]);

  return <div>데이터를 저장 중입니다...</div>;
};

export default SaveToLocalStorage;
