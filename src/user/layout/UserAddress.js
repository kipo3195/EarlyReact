import axios from 'axios';
import '../css/UserAddress.css';
import searchBtn from '../../etc/img/addressSearchBtn.png';
import addBtn from '../../etc/img/addressAddBtn.png';
import userSearchCancle from '../../etc/img/userSearchCancle.png';
import noProfile from '../../etc/img/noProfile.png';
import AddFriendModal from '../layout/address/AddFriendModal';
import AddressChatRoomModal from '../layout/address/AddressChatRoomModal';

import { useEffect, useRef, useState } from 'react';

axios.defaults.withCredentials = true;

function UserAddress(props){

    const serverUrl = process.env.REACT_APP_SERVER_A_URL;
    const scrollRef = useRef();
    
    const friendList = props.list.friend_list;
    const myInfo = props.list.my_info;
    const friendCount = props.list.friend_count;
    // 친구 추가 
    const [isAddFriendModal , setAddFriendModal] = useState(false);

    // 채팅방 입장
    const [isChatRoomModal, setEnterChatRoomModal] = useState(false);
    const [friendInfo, setFriendInfo] = useState(false);

    // 채팅방 입장시 채팅 라인 불러오기 
    const [lineDatas, setLineDatas] = useState('');
    const [nextLine, setNextLine] = useState('');

    // 채팅방 입력 처리 
    const [roomKey, setRoomKey] = useState('');
    const [recevier, setRecevier] = useState('');
    const [sender, setSender] = useState(props.list.my_info.username);
    const [emptyRoomFlag, setEmptyRoomFlag] = useState(false);
    const [title, setTitle] = useState('');
    const [createRoomDate, setCreateRoomDate] = useState('');

    // 웹소켓 클라이언트 : 실시간 채팅 수신을 위함. 
    var client = props.client;
    // 채팅 수신 데이터
    const [recvData, setRecvData] = useState(null);

    function onScrollCallBack(){
       
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

    // 친구 추가
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
    

    // 1:1 채팅방 입장
    function enterChatRoom(e, friend){
        e.preventDefault();
        
        const addrChatRoomListPromise = addrChatRoomListRequest(friend);

        addrChatRoomListPromise.then((promise)=>{
            var type = promise.type;
            var data = promise.data;

            // 기존 방 구독 취소 
            if(roomKey != null){
                client.unsubscribe(roomKey);
            }

            if(type && data){
                var result = type;
                if(result === 'success'){

                    if(client !== null){
                        var roomKey = null;
                        setEnterChatRoomModal(true);
                        setFriendInfo(friend);
                        if(data.newChatRoomKey){
                            // 아직 생성되지않음. UserChatContentsInput 컴포넌트 이용함.
                            roomKey = data.newChatRoomKey;
                            setRoomKey(data.newChatRoomKey);
                            setRecevier(myInfo.username+'|'+friend.username);
                            setEmptyRoomFlag(true);
                            setTitle(myInfo.name+', '+friend.name);
                            const today = new Date();
                            const formattedDate = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${today.getSeconds()}${today.getMilliseconds()}`;
                            setCreateRoomDate(formattedDate);
                            setLineDatas('');
                            setNextLine(0); // 채팅방 입장후 더 가져오기 처리 안하기 위함
                        }else{
                            roomKey = data.chatRoomKey;
                            setRoomKey(data.chatRoomKey);
                            setRecevier(myInfo.username+'|'+friend.username);
                            setEmptyRoomFlag(false);
                            setTitle(data.title);
                            setLineDatas(data.chatRoomLine);
                            setNextLine(data.nextLine);
                        }

                        client.subscribe('/topic/room/'+roomKey, chatRoomCallback, {id:roomKey});

                    }
                }
            }
        }) 
    }

    // 입장한 채팅방의 대화 callback 함수 
    function chatRoomCallback(message){
    
        if (message.body) {
            // console.log('chatRoomCallback : ', message.body);
            var recvJson = JSON.parse(message.body);
            var type = recvJson.type;
            
            // 일반 채팅 수신
            // {"chatSender":"","chatLineKey":"","chatUnreadCount":"","chatRoomKey":"","chatContents":"","type":"chat"}
            if(type === 'chat'){
                var chatSender = recvJson.chatSender;
                if(sender !== chatSender){
                    setRecvData(message.body);
                }

            // 채팅방 라인별 미확인 건수 갱신   
            // {"result":{"20240130230411054":"0","20240130230415410":"0"},"type":"readLines"}
            }
            else if(type ==='readLines'){
                
               // setReloadLines(recvJson.result);
                
            // 채팅방 라인의 좋아요, 굿, 체크
            // {"lineKey":"20240204151128490","like":"0","check":"1","roomKey":"R_231212224649930","type":"lineEvent"}
            }else if(type ==='lineEvent'){
                
               // setReloadLineEvent(recvJson);

            }

          } else {
            
          }
    }

    async function addrChatRoomListRequest(friend){
        var returnData = null;
        var chatRoomKey = null;
        // console.log('friend : ', friend.username);
        if(myInfo.id < friend.id){
            chatRoomKey = 'R_'+myInfo.username+'|'+friend.username;
        }else{
            chatRoomKey = 'R_'+friend.username+'|'+myInfo.username;
        }
        await axios({
            url:serverUrl+'/user/getChatLines',
            method:'post',
            data:{
                roomKey : chatRoomKey,
                enterType : "a",
                userId : myInfo.username,
                readLineKey : "99999999999999999"
            }
        }).then(function(response){
            returnData = response.data;
        }).catch(function(error){
            console.log(error);
        });
        return returnData;
    }

    const enterChatRoomModal = <AddressChatRoomModal recvData={recvData} myInfo={myInfo} friendInfo={friendInfo} closeModal={()=>{
        setEnterChatRoomModal(false);
    }} roomKey={roomKey} recevier={recevier} sender={sender} emptyRoomFlag={emptyRoomFlag} client={props.client} title={title}
    createRoomDate={createRoomDate} lineDatas={lineDatas} nextLine={nextLine} readLines={(chat)=>{
        props.chatListReload(chat);
    }}></AddressChatRoomModal>

    return(
        <div>
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

                                {
                                myInfo.userProfile === '' ?
                                <td id='myInfoNoProfileTd' >
                                    <img src={noProfile} width='70' height='70' style={{borderRadius:'20px', verticalAlign:'middle'}} alt={myInfo.username}></img>
                                    <div id="myInfoNoprofileName">
                                        {myInfo.name[0]}
                                    </div>
                                </td>
                                :
                                <td className='myProfile'>
                                    <img src={myInfo.userProfile} width='70' height='70' style={{borderRadius:'20px', verticalAlign:'middle'}} alt={myInfo.username}></img>
                                </td>
                                } 
                                <td className='myName'>
                                    {myInfo.name}
                                </td>
                                <td className='myStatusMsg'>
                                    상태메시지
                                </td>
                                <td>
                                    <input type='hidden' value ={myInfo.username}></input>
                                </td>
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
                            <tr key={friend.id} className='friendTr' onDoubleClick={e=>{enterChatRoom(e, friend)}} >
                                {(friend.userProfile === '' || friend.userProfile == null) ?   
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

            {/*1:1 대화방 입장 */
            ((isChatRoomModal) ? enterChatRoomModal:'')}
        </div>
    )

}

export default UserAddress;