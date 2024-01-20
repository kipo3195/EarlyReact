/*eslint-disable no-restricted-globals*/
self.addEventListener('message', e =>{

  console.log('worker.js 최초 호출');


    setTimeout(()=> tokenVerificationken(0), 10000);
    

    console.log('worker.js end');

});

function tokenVerificationken(data){
  console.log('토큰 검증을 위한 서버호출 : ', data)

  postMessage({
    data
  });
  data++;

  setTimeout(()=> tokenVerificationken(data), 10000);
}