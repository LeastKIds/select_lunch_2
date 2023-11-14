import axios from "axios";
import { useState } from "react";
import {Wrapper} from "@googlemaps/react-wrapper"


function App() {

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center', // 수평 정렬을 위해
    // alignItems: 'center', // 수직 정렬을 하려면 이 속성을 사용하세요.
    // height: '100vh' // 컨테이너의 높이를 화면 전체 높이로 설정,
    marginTop: "100px"
  };

  const inputStyle = {
    padding: '10px',
    margin: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer'
  };

  const [keyward, setKeyward] = useState('');

  const handleInputChange = (event) => {
    setKeyward(event.target.value)
    console.log(keyward)
  }

  const handleButton = () => {
    (async () => {
      try {
        
        // const response = await axios.get("http://leastkids@leastkids.iptime.org:8080/search/" + keyward);
        const response = await axios.get("http://126.44.208.85:8080/search/" + keyward);
        const result = response.data.results;



      } catch (error) {
        console.error(error);
      }
    })();
  }

  return (
    <div className="App">
      <div style={containerStyle}>
        <input type="text" style={inputStyle} placeholder="여기에 입력하세요" value={keyward} onChange={handleInputChange} />
        <button style={buttonStyle} onClick={handleButton}>클릭</button>
        <br />
        <br />
        <br />
        <br />
        <Wrapper apiKey="" libraries={"places"}>

        </Wrapper>

    </div>
    </div>
  );
}

export default App;
