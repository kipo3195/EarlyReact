import axios from 'axios';
import '../css/UserAddress.css';
import searchBtn from '../../etc/img/addressSearchBtn.png';
import addBtn from '../../etc/img/addressAddBtn.png';
import userSearchCancle from '../../etc/img/userSearchCancle.png';
import noProfile from '../../etc/img/noProfile.png';
import AddFriendModal from '../layout/address/AddFriendModal';
import { useEffect, useRef, useState } from 'react';

axios.defaults.withCredentials = true;

function UserAddress(props){

    const scrollRef = useRef();
    
    const friendList = props.list.friend_list;
    const myInfo = props.list.my_info;
    const friendCount = props.list.friend_count;
    const [isAddFriendModal , setAddFriendModal] = useState(false);

    
    function onScrollCallBack(){
        //console.log("스크롤 전체 높이 : ", scrollRef.current?.scrollHeight); // 스크롤의 크기
        //console.log('스크롤의 위치 : ', scrollRef.current?.scrollTop); // 스크롤 바 탑의 위치
        //console.log("요소의 높이 : ", scrollRef.current?.clientHeight); // 스크롤 바의 크기 
        if(scrollRef.current?.scrollHeight <= (scrollRef.current?.scrollTop + scrollRef.current?.clientHeight + 1)){
            if(friendCount === friendList.length){
                // 더 호출 할 거 없음
            }else{
                props.getAddressList(friendList.length);
            }
        }
    }

    function searchUser(e){
        e.preventDefault();
        
        var addressSearchDiv = document.getElementById('addressSearchDiv');

        // console.log(addressSearchDiv.style.display);
        // 최초 호출시 display가 빈 값.
        if (addressSearchDiv.style.display === 'none' || addressSearchDiv.style.display === '') {
            addressSearchDiv.style.display = 'block';
            document.getElementById("addrSearchText").focus();
        } else {
            addressSearchDiv.style.display = 'none';
        }

    }

    function addFriend(e){
        e.preventDefault();
        setAddFriendModal(true);
    }

    const addFriendModal = <AddFriendModal myId={myInfo.username} addFriendModalClose={()=>{setAddFriendModal(false);}} 
    addFriendSuccess={()=>{
        setAddFriendModal(false);
        props.addFriendSuccess();
    }}
    ></AddFriendModal>

    return(
        <div id='addressDiv'>
            {/* 친구 추가 버튼 */}
            <div id='addressBtnDiv'>
                <table id='addressTable'>
                    <tbody>
                        <tr>
                            <td id ='addressTitle'>주소록</td>
                            <td id ='addressSearch'>
                                <img src={searchBtn} alt={searchBtn} width='25px' onClick={(e)=>{
                                    searchUser(e);
                                }}></img>
                            </td>
                            <td id ='addressAdd'>
                                <img src={addBtn} alt={addBtn} width='30px' onClick={(e)=>{
                                    addFriend(e);
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
                                <img src={searchBtn} className='addrSearch' width='20px' alt='searchBtn'></img>
                            </td>
                            <td colSpan='2'>
                                <input type='text' id='addrSearchText' ></input>
                            </td>
                            <td>
                                <img src={userSearchCancle} className='addrSearch' width='20px' alt='userSearchCancle' onClick={e=>{
                                    
                                }}></img>
                            </td>
                        </tr>
                </table>
            </div>


            {/* 내 정보 */}
            <div id='myInfoDiv'>
                <table id='myTable'>
                    <tbody>

                        <tr key={myInfo.id} className='myTr'>
                            <td className='myProfile'>
                                <img src={myInfo.userProfile} width='70' height='70' style={{borderRadius:'20px', verticalAlign:'middle'}} alt={myInfo.username}></img>
                            </td>
                            <td className='myName'>
                                {myInfo.name}
                            </td>
                            <td className='myStatusMsg'>
                                상태메시지
                            </td>

                            <input type='hidden' value ={myInfo.username}></input>
                            
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id='friendCountDiv'>
                <table>
                    <tr>
                        <td>
                            친구 {friendCount}
                        </td>
                    </tr>
                </table>
            </div>
            {/* 사용자 리스트 */}
            <div id='friendDiv' ref={scrollRef} onScroll={onScrollCallBack}>
                <table id='friendTable'>
                    <tbody>
                        {friendList.map((friend)=>
                           <tr key={friend.id} className='friendTr'>
                             {(friend.userProfile === '') ?   
                             <td className='friendNoprofile' >
                              {friend.name[0]}
                             </td>
                             :
                             <td className='friendProfile'>
                             <img src={friend.userProfile} width='50' height='50' style={{borderRadius:'20px', verticalAlign:'middle'}} alt={friend.username}></img>
                             </td>
                             }
                          
                            <td className='friendName'>
                                {friend.name}
                            </td>
                            <td className='friendStatusMsg'>
                                상태메시지
                            </td>

                            <input type='hidden' value ={friend.username}></input>
                            
                           </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/*친구 추가 modal*/
            ((isAddFriendModal) ? addFriendModal : '')}
        </div>
    )

}

export default UserAddress;