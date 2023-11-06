import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Test(){
  const [item, setItem] = useState([]);

  useEffect(()=>{
    axios({
        method:'GET',
        url : 'http://localhost:8080/api/test'
    }).then(function(response){
      console.log(response.data.data);
      setItem(response.data.data);
    }).catch(function(error){
      console.log(error);
    })
    
  })

  return (
    <div> 
      response 결과 : {item}
    </div>
  )
}


function TestAsync(){

  const [asyncItem, setAsyncItem] = useState(null);

  return(
    <div>
      <p>result : {asyncItem}</p>
      <input type="button" value="async test" onClick={()=>{
       axios({
        method:'GET',
        url : 'http://localhost:8080/api/random'
        }).then(function(response){
          console.log(response.data.data);
          setAsyncItem(response.data.data);
        }).catch(function(error){
          console.log(error);
        })
        
      }}/>
    </div>
  )
}

function App() {
  return (
      <div>
        <Test></Test>
        <TestAsync></TestAsync>
      </div>
  );
}

export default App;
