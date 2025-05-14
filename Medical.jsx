import React,{useEffect,useState} from 'react';
import axios from 'axios';

const Medical = () => {
    const [data,setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const BASE_URL="http://apis.data.go.kr/1471000/DayMaxDosgQyByIngdService/getDayMaxDosgQyByIngdInq";
  
    const fetchData = async(query) => {
        setLoading(true);
        setError(null);

        try{
            const response = await 
            axios.get(BASE_URL, {
                params: {
                    serviceKey:process.env.REACT_APP_API_KEY,
                    type: 'json',
                    numOfRows: 10,
                    pageNo: 1,
                    DRUG_CPNT_KOR_NM:query,
                },
        });
        
        console.log("API 응답 데이터:", response.data);
        console.log("API Key:", process.env.REACT_APP_API_KEY);

        if (response.data.body?.items){
            setData(response.data.body.items.item);
        } else {
            setData([]);
        }
    } catch (error) {
        setError("데이터를 불러오는 중에 오류가 발생했습니다.");
    }finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchData(" ");
}, []);

const handleSearch = () => {
    fetchData(searchTerm);
};

return(
  <div style={{ padding:"20px"}}>
    <h1>의약품 성분 1일 최대 투여량 조회</h1>

    <div>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="의약품 성분을 입력하세요"
            style={{ padding: "8px",marginRight: "10px" }}/>
            <button onClick={handleSearch} style={{ padding: "8px" }}>검색</button>
    </div>

    <ul>
        {data.length > 0 ? (
            data.map((item,index)=>(
                <li key={index}>
                    <strong>{item.DRUG_CPNT_KOR_NM}</strong>
                    -{item.DAY_MAX_DOSG_QY} {item.DAY_MAX_DOSG_QY_UNIT} </li>
            ))
        ) : (
            <p>조회된 데이터가 없습니다.</p>
            )}
    </ul>
  </div>
);
};
export default Medical;
