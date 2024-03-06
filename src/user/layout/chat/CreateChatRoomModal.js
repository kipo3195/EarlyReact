
import userSearch from '../../../etc/img/userSearch.png';
import userSearchCancle from '../../../etc/img/userSearchCancle.png';
import { useEffect, useState, useRef } from 'react';

function CreateChatRoomModal(props){

    const[searchContents, setSearchContents] = useState('');
    const[searchUsers, setSearchUsers] = useState();    
    
    var makeUserId = props.makeUserId;
    var userList = [props.userList];
    // console.log('chatRoomModal의 userList : ',userList);
    var users = JSON.parse(userList);

    // 마지막에 랜더링
    useEffect(()=>{

        setSearchUsers(users);

    }, [])


    function clearSearchValue(e){
        setSearchContents('');
    }

    function changeSearchText(e){
        var word = e.target.value;
        var temp = [];        
        for(let i = 0; i < users.length; i++){
            var username = users[i].name;
            if(username.includes(word)){
                temp.push(users[i]);
            }
        }
        setSearchUsers(temp);
        setSearchContents(word);
    }

    function isChecked(e){
        console.log(e);
    }

    return(
        <div id='createChatRoomModalParent'>
            <div id='createChatRoomModal'>
                <table id ='createChatRoomTable'>
                    <thead>
                        <tr className ='createChatRoomTitleTr' >
                            <td colSpan='3'>
                                <input type="button" value='X' onClick={props.closeModal} style={{float:'right', marginTop:'2px'}}></input>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className ='createChatRoomTitleTr'>
                            <td colSpan='3' id='createChatRoomTitle'>
                                <span>대화상대 선택</span>
                            </td>
                        </tr>

                    </tbody>
                </table>
                {/* 이하 사용자 검색창 */}
                <table id ='createChatRoomUserSearchTable'>
                    <tr>
                        <td>
                            <img src={userSearch} className='userSearchImg'></img>
                        </td>
                        <td colSpan='2'>
                            <input type='text' id='createChatRoomSearch' onChange={e=> changeSearchText(e)}
                            value ={searchContents}></input>
                        </td>
                        <td>
                            <img src={userSearchCancle} className='userSearchImg' id='userSearchCancle' onClick={e=>{
                                clearSearchValue();
                            }}></img>
                        </td>
                    </tr>
                </table>

                {/* 이하 사용자 리스트 */}
                <div id ='createChatRoomUserList'>
                    <table  id ='createChatRoomUserListTable'>
                        <tbody>
                                <tr id = 'createChatRoomSearchUserTitle'>
                                    <td colSpan='3' style={{paddingLeft:10}} >
                                        친구 {users.length}
                                    </td>
                                </tr>
                                {/*사용자 반복해서 나오게 처리 */}
                                {
                                    (searchUsers === undefined) ? ('') : (
                                        searchUsers.map((user)=>(
                                        <tr className='createChatRoomSearchUserTr'>
                                            <td className="createChatRoomSearchUserProfile">early!</td> {/* 프로필 사진 TODO */}
                                            <td className="createChatRoomSearchUserName">{user.name}</td>
                                            <td><input type='checkbox' onChange={e=>{isChecked(user)}}></input></td>
                                        </tr>
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
                                    <input className='createChatRoomBtn' type='button' value='확인'></input>
                                    <input className='createChatRoomBtn' type='button' value='취소'  onClick={props.closeModal}></input>
                                </td>
                            </tr>                    
                        </tbody>    
                    </table>
                </div>
            </div>
        </div>
    )
}


export default CreateChatRoomModal