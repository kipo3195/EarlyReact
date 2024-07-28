
import { select } from 'react-cookies';
import userSearch from '../../../etc/img/userSearch.png';
import userSearchCancle from '../../../etc/img/userSearchCancle.png';
import { useEffect, useState, useRef } from 'react';

function CreateChatRoomModal(props){

    const[searchContents, setSearchContents] = useState('');
    const[searchUsers, setSearchUsers] = useState();
    const[searchUsersCount, setSearchUsersCount] = useState();    
    const[chatRoomTitleProcess, setChatRoomTitleProcess] = useState(false);

    const[roomTitle, setRoomTitle] = useState('');

    const[selectUsers, setSelectUsers] = useState([]);
    
    var makeUserId = props.makeUserId;
    var userList = [props.userList];
    // console.log('chatRoomModal의 userList : ',userList);
    var users = JSON.parse(userList);

    // 맨처음에 한번 랜더링
    useEffect(()=>{

        setSearchUsers(users);
        setSearchUsersCount(users.length);

    }, [])


    // 검색창 X버튼 클릭시 최초 리스트로 돌아가도록 처리함 
    function clearSearchValue(){
        setSearchContents('');
        changeSearchText(null, true);
    }

    // 검색 입력시 라이브 필터
    function changeSearchText(e, clear){
        var word = null;
        if(clear){
            word = '';
        }else{
            word = e.target.value;
        }
        
        var temp = [];        
        for(let i = 0; i < users.length; i++){
            var username = users[i].name;
            if(username.includes(word)){
                temp.push(users[i]);
            }
        }
        setSearchUsers(temp);
        setSearchContents(word);
        setSearchUsersCount(temp.length);
    }

    // 사용자 선택 리스트에서 반복하면서 비교 TODO KEY로 접근 할 수 있는 객체?
    function isChecked(e, user){
        // 매번 새로운 []를 만들어서 update 함
        var temp = [...selectUsers];
        var tempMap = [];

        if(temp.length === 0 ){
            tempMap.push(user);
        }else{
            var flag = false;
            for(let i = 0; i < temp.length; i++){
                if(temp[i].username !== user.username){
                    tempMap.push(temp[i]);
                }else{
                    flag = true;
                }
            }
            // 동일한 사용자가 없는 경우로 판단하고 현재 선택된 사람 추가 
            if(!flag){
                tempMap.push(user);
            }
        }

        //console.log('result : ' , tempMap );
        
        setSelectUsers(tempMap);
    }

    // 사용자 선택 후 확인버튼
    function chatRoomTitle(e, flag){
        if(flag){
            setChatRoomTitleProcess(true);
        }else{
            // 뒤로가기 
            setChatRoomTitleProcess(false);
        }
    }

    // 채팅방 이름 입력 후 생성버튼
    function createRoom(e, roomTitle){
        e.preventDefault();
        
        var recevier = '';
        for(var i = 0; i < selectUsers.length; i++){
            
            if(i === selectUsers.length-1){
                recevier += selectUsers[i].username;
            }else{
                recevier += selectUsers[i].username+'|';
            }
        }
        
        // 만든사람 + 검색(혹은 선택)한 사람
        props.createEmptyRoom(makeUserId+'|'+recevier, roomTitle);
        setSelectUsers([]);
    }

    // 채팅방 이름 입력 감지 
    function enterRoomTitle(e){
        e.preventDefault();
        setRoomTitle(e.target.value);
    }

    return(
        <div id='createChatRoomModalParent'>
            {(chatRoomTitleProcess) 
            ? (
                // 이하 방생성에서 확인 버튼 클릭시 - 채팅방 타이틀 입력으로 전환 
                <div className='createChatRoomModal'>
                    <div>
                        <table className='createChatRoomTable'>
                            <thead>
                                <tr className ='createChatRoomTitleTr' >
                                    <td colSpan='3'>
                                        <input type="button" value='X' onClick={props.closeModal} style={{float:'right', marginTop:'2px'}}></input>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className ='createChatRoomTitleTr'>
                                    <td colSpan='3' className='createChatRoomTitle'>
                                        <span>그룹채팅방 정보 설정</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div id ='chatRoomTitleDiv'>
                        <table id='chatRoomTitleTable'>
                            <thead id='chatRoomTitleHead'>
                                <tr>
                                    <td>
                                        선택된 사용자의 이미지 표시 영역
                                    </td>
                                </tr>
                            </thead>
                            <tbody id='chatRoomTitleInputBody'>
                                <tr>
                                    <td>
                                        <input type='text' id='chatRoomTitleInputTd' placeholder='채팅방 이름입력' onChange={e=>{enterRoomTitle(e)}}></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div id ='createChatRoomBtnDiv'>
                        <table id='createChatRoomBtnTable'>
                            <tbody>
                                <tr id ='createChatRoomBtnTr'>
                                    <td colSpan='3'>
                                        <input className='createChatRoomBtn' type='button' value='생성' onClick={e=>{createRoom(e, roomTitle)}}></input>
                                        <input className='createChatRoomBtn' type='button' value='뒤로가기'  onClick={e=>{chatRoomTitle(e, false)}}></input>
                                        <input className='createChatRoomBtn' type='button' value='취소'  onClick={props.closeModal}></input>
                                    </td>
                                </tr>                    
                            </tbody>    
                        </table>
                    </div>
                </div>

                ): (

                    
                // 이하 방생성 버튼 클릭시 
                <div className='createChatRoomModal'>
                    <table className ='createChatRoomTable'>
                        <thead>
                            <tr className ='createChatRoomTitleTr' >
                                <td colSpan='3'>
                                    <input type="button" value='X' onClick={props.closeModal} style={{float:'right', marginTop:'2px'}}></input>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className ='createChatRoomTitleTr'>
                                <td colSpan='3' className='createChatRoomTitle'>
                                    <span>대화상대 선택</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/* 이하 사용자 검색창 */}
                    <table id ='createChatRoomUserSearchTable'>
                        <tbody>
                            <tr>
                                <td>
                                    <img src={userSearch} className='userSearchImg'></img>
                                </td>
                                <td colSpan='2'>
                                    <input type='text' id='createChatRoomSearch' onChange={e=> changeSearchText(e, false)}
                                    value ={searchContents} autoFocus></input>
                                </td>
                                <td>
                                    <img src={userSearchCancle} className='userSearchImg' id='userSearchCancle' onClick={e=>{
                                        clearSearchValue();
                                    }}></img>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/* 이하 사용자 리스트 */}
                    <div id ='createChatRoomUserList'>
                        <table  id ='createChatRoomUserListTable'>
                            <thead>
                                <tr id ='createChatRoomSearchUserTitle' >
                                    <td colSpan='3' style={{paddingLeft:10}} >
                                        친구 {searchUsersCount ? searchUsersCount-1 : 0 }
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {/*사용자 반복해서 나오게 처리 */}
                                {
                                    (searchUsers === undefined || searchUsers === null) ? ('') : (
                                        searchUsers.map((user)=>(
                                            user.username !== makeUserId && (
                                            <tr className='createChatRoomSearchUserTr' key={user.username}>
                                            <td className="createChatRoomSearchUserProfile">early!</td>{/* 프로필 사진 TODO */}
                                            <td className="createChatRoomSearchUserName">{user.name}</td>
                                            <td><input type='checkbox' onChange={e=>{isChecked(e, user)}}></input></td>
                                            </tr>    
                                            )                                       
                                    ))
                                    )
                                }
                            </tbody>    
                        </table>
                    </div>
                    {/* 이하 확인 취소 버튼 */}
                    <div id ='createChatRoomBtnDiv'>
                        <table id='createChatRoomBtnTable'>
                            <tbody>
                                <tr id ='createChatRoomBtnTr'>
                                    <td colSpan='3'>
                                        <input className='createChatRoomBtn' type='button' value='확인' onClick={e=>{chatRoomTitle(e, true)}}></input>
                                        <input className='createChatRoomBtn' type='button' value='취소'  onClick={props.closeModal}></input>
                                    </td>
                                </tr>                    
                            </tbody>    
                        </table>
                    </div>
                </div>
           )}


        </div>
    )
}


export default CreateChatRoomModal