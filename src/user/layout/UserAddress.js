import axios from 'axios';
import '../css/UserAddress.css';
import searchBtn from '../../etc/img/addressSearchBtn.png';
import addBtn from '../../etc/img/addressAddBtn.png';
import userSearchCancle from '../../etc/img/userSearchCancle.png';
import { useEffect } from 'react';

axios.defaults.withCredentials = true;

function UserAddress(){
    
    function searchUser(e){
        e.preventDefault();
        
        var addressSearchDiv = document.getElementById('addressSearchDiv');

        console.log(addressSearchDiv.style.display);
        // 최초 호출시 display가 빈 값.
        if (addressSearchDiv.style.display === 'none' || addressSearchDiv.style.display === '') {
            addressSearchDiv.style.display = 'block';
            document.getElementById("addrSearchText").focus();
        } else {
            addressSearchDiv.style.display = 'none';
        }

    }

    function addUser(e){
        e.preventDefault();
        console.log('사용자 추가')
    }

    return(
        <div id='addressDiv'>
            {/* 친구 추가 버튼 */}
            <div id='addressBtnDiv'>
                <table>
                    <tbody>
                        <tr>
                            <td id ='addressTitle'>친구</td>
                            <td id ='addressSearch'>
                                <img src={searchBtn} alt={searchBtn} width='25px' onClick={(e)=>{
                                    searchUser(e);
                                }}></img>
                            </td>
                            <td id ='addressAdd'>
                                <img src={addBtn} alt={addBtn} width='30px' onClick={(e)=>{
                                    addUser(e);
                                }}></img>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 검색창 */}
            <div id='addressSearchDiv'>
                <table id ='addressSearchTable'>
                        <tr>
                            <td>
                                <img src={searchBtn} className='addrSearch' width='20px'></img>
                            </td>
                            <td colSpan='2'>
                                <input type='text' id='addrSearchText' ></input>
                            </td>
                            <td>
                                <img src={userSearchCancle} className='addrSearch' width='20px' onClick={e=>{
                                    
                                }}></img>
                            </td>
                        </tr>
                </table>
            </div>


            {/* 내 정보 */}
            <div id='myAddress'>


            </div>
            
            {/* 사용자 리스트 */}
            <div id='addressList'>


            </div>

        </div>
    )

}

export default UserAddress;