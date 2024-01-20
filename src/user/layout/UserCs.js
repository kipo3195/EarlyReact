import axios from 'axios';
import { useEffect, useState } from 'react';
/* eslint import/no-webpack-loader-syntax: off */
import Worker from 'worker-loader!./worker';
axios.defaults.withCredentials = true;


function UserCs(){
  
const worker = new Worker();

worker.postMessage({
  repeatCount: 3
});

worker.onmessage = e => {
  const { data } = e.data;
  console.log('UserCs.js : ', data);

  if(data > 10) {
    console.log('UserCs.js worker 종료');
    worker.terminate(); 
   }

}




}

export default UserCs;