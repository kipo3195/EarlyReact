import axios from 'axios';
import { useState } from 'react';
import { select } from 'react-cookies';

import noProfile from '../../../etc/img/noProfile.png';


axios.defaults.withCredentials = true;

function AddFriendModal(props){

    const myId = props.myId;

    var serverUrl = process.env.REACT_APP_SERVER_ADDRESS_URL;

    const [inputText, setInputText] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectType, setSelectType] = useState('id');
    const [searchResult, setSearchResult] = useState(false);

    const [searchFriend, setSearchFriend] = useState();

    // X로 닫기 
    function addFriendClose(e){
        e.preventDefault();
        props.addFriendModalClose();
    }

    function changeType(e, type){
        if(type === 'id'){
            setPhoneNumber('');
            setInputText('');  
            setSelectType('id');
            setSearchResult(false);
            setSearchFriend();
            document.getElementById('addFriendInsert').value = '';
        }else{
            setPhoneNumber('');
            setInputText('');
            setSelectType('phone');
            setSearchResult(false);
            setSearchFriend();
            document.getElementById('addFriendInsert').value = '';
        }
        
    }

    // 계정, 이름 입력시 
    function inputTextChange(e){
        e.preventDefault();
        var text = document.getElementById('addFriendInsert').value;
        setInputText(text);
    }

    // 전화번호 입력시 
    function changeUserPhone(e){
        e.preventDefault();
        var phoneNumber = document.getElementById('phoneNumber').value;
        setPhoneNumber(phoneNumber);
    }

    // 추가 전 검색
    function searchUser(e){

        const resultPromise = searchUserRequest();
        resultPromise.then(promiseResult=>{
            console.log(promiseResult);
            var type = promiseResult.type;

            if(type === 'error'){
                setSearchResult(false);
                setSearchFriend();
            }else{
                var data = promiseResult.data;
                var friendInfo = data.friend_info;
                if(friendInfo === 'no_user'){
                    alert('존재하지 않는 사용자 입니다.');
                    setSearchResult(false);
                    setSearchFriend();
                }else{
                    var myFriendFlag = data.my_friend;
                    if(myFriendFlag){
                        alert('이미 주소록에 존재하는 사용자 입니다.');
                        setSearchResult(false);
                        setSearchFriend();
                    }else{
                        setSearchResult(true);
                        setSearchFriend(friendInfo);
                    }
                }
            }
        })
    }

    async function searchUserRequest(){

        var returnData = null;

        await axios({
            method : 'POST',
            url : serverUrl+'searchUser',
            data:{
               type : selectType,
               inputText : inputText,
               phoneNumber : phoneNumber,
               myId : myId
              }
        }).then(function(response){        

            returnData = response.data;
            
        }).catch(function(error){
          console.log(error);
        })

        return returnData;
    }

    // 추가
    function addFriend(e){
        e.preventDefault();
        if(searchFriend !== undefined && searchResult){
            if(window.confirm(searchFriend.name + '님을 친구로 등록하시겠습니까?')){
                const resultPromise = addFriendRequest();
                resultPromise.then(promiseResult=>{
                    var type = promiseResult.type;
                    if(type.result === 'success'){
                        alert('친구로 등록되었습니다.');
                        props.addFriendSuccess();
                    }else{
                        var data = promiseResult.data;
                        if(data.error_msg === 'already_registered'){
                            alert('이미 친구로 등록된 사용자 입니다.');
                        }else{
                            alert('친구 등록 실패 ! ' + data.error_msg);
                            props.addFriendModalClose();
                        }
                    }
                })
            }
        }
    }

    async function addFriendRequest(){

        var returnData = null;

        await axios({
            method : 'POST',
            url : serverUrl+'addUser',
            data:{
              myId : myId,
              friendId : searchFriend.username
              }
        }).then(function(response){        
            console.log(response);
            returnData = response.data;
            
        }).catch(function(error){
          console.log(error);
        })

        return returnData;
    }
 
    return (
        // 백그라운드 클릭안되도록 처리
        <div id ='addFriendModalParent'>
            <div id='addFriendModalDiv'>
                <div id ='addFriendCloseDiv'>
                    <table id ='addFriendCloseTable'>
                        <tbody>
                            <tr>
                                <td id ='addFriendModalTitle'>
                                    <span>
                                        친구 추가
                                    </span>
                                </td>
                                <td>
                                    <input type='button' value='X' onClick={e=>{addFriendClose(e)}}></input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id ='addFriendSelectDiv'>
                    <table id='addFriendselectTable'>
                        <tbody>
                            {
                                selectType === 'id' ?
                                    <tr id = 'addFriendselectTr'>
                                        <td className='addFriendselectTd' style={{textDecoration:'underline', 
                                                 color: 'rgb(105, 105, 105)'}}>
                                            <p className='addFriendselectP'>계정으로 추가</p>
                                        </td>
                                        <td className='addFriendselectTd'>
                                            <p className='addFriendselectP' onClick={e=>{changeType(e, 'phone')}}>전화번호로 추가</p>
                                        </td>
                                    </tr>
                                :
                                <tr id = 'addFriendselectTr'>
                                    <td className='addFriendselectTd'>
                                        <p className='addFriendselectP' onClick={e=>{changeType(e, 'id')}}>계정으로 추가</p>
                                    </td>
                                    <td className='addFriendselectTd' style={{textDecoration:'underline', 
                                                 color: 'rgb(105, 105, 105)'}}>
                                        <p className='addFriendselectP' >전화번호로 추가</p>
                                    </td>
                                </tr>
                            }
                            
                        </tbody>
                    </table>
                </div>
                <div id ='addFriendInsertDiv'>
                    {
                    selectType === 'id' ? 
                    <div className ='addFriendInsertIdDiv'>
                        <table className ='addFriendInsertIdTable'>
                            <tbody>
                                <tr className ='addFriendInsertTr'>
                                    <td>
                                        <input className ='addFriendInsert' type='text' id='addFriendInsert' placeholder='친구 ID' maxLength='100' onChange={e=>{

                                            inputTextChange(e)}} autoFocus></input>
                                    </td>
                                    <td id ='inputTextCountTd'>
                                        <span id='inputTextCount'>&nbsp; {inputText.length}/100</span>
                                    </td>
                                </tr>
                                <tr id ='addFriendHrTr'>
                                    <td colSpan="2"><hr/></td>
                                </tr>

                                {
                                    searchResult ?
                                    <>
                                         <tr className='searchFriendImgTr'>
                                            {
                                                searchFriend.userProfile === '' ?
                                                <td className='searchFriendNoProfileTd' colSpan="2">
                                                    <img src={noProfile} width='110' height='110' style={{borderRadius:'20px'}} alt={searchFriend.username}></img>
                                                    <div className="searchFriendNoprofileName">
                                                        {searchFriend.name[0]}
                                                    </div>
                                                </td>
                                                :
                                                <td className='searchFriendTd' colSpan="2">
                                                    <img src={searchFriend.userProfile} width='110' height='110' style={{borderRadius:'20px'}} alt={searchFriend.username}></img>
                                                </td>
                                            }
                                        </tr>
                                        <tr className='searchFriendNameTr'>
                                            <td id='searchFriendNameIdTd' colSpan="2">
                                                {searchFriend.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className='searchFriendStatusMsgTd'>
                                                <span>
                                                    상태메시지
                                                </span>
                                            </td>
                                        </tr>
                                    </>
                                    :
                                    <tr id ='addFriendInsertCommentTr'>
                                        
                                        <td colSpan="2">
                                            <span>친구 ID를 등록하고 검색을 허용한 친구만<br/> 찾을 수 있습니다.</span>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className ='addFriendInsertIdDiv'>
                        <table className ='addFriendInsertIdTable'>
                            <tbody>
                                <tr className ='addFriendInsertTr'>
                                    <td>
                                        <input className ='addFriendInsert' id='addFriendInsert' type='text' placeholder='친구 이름' maxLength='20' onChange={e=>{
                                            if(inputText.length >= 100){
                                                return;
                                            }
                                            inputTextChange(e)}} autoFocus></input>
                                    </td>
                                    <td id ='inputTextCountTd'>
                                        <span id='inputTextCount'>&nbsp; {inputText.length}/20</span>
                                    </td>
                                </tr>
                                <tr id ='addFriendHrTr'>
                                    <td colSpan="2"><hr/></td>
                                </tr>

                                <tr id ='addFriendPhoneInsertTr'>
                                    <td>
                                        <input type='text' className ='addFriendInsert' id='phoneNumber' placeholder="전화번호 '-' 제외" maxLength='20' onChange={e=>{changeUserPhone(e)}}></input>
                                    </td>
                                </tr>
                                <tr id = 'addFriendPhoneLastTr'>
                                    <td colSpan="2">
                                        <hr/>
                                    </td>
                                </tr>
                                {
                                    searchResult ?
                                    <>
                                        <tr className='searchFriendImgTr'>
                                            {
                                                searchFriend.userProfile === '' ?
                                                <td className='searchFriendNoProfileTd' colSpan="2">
                                                    <img src={noProfile} width='110' height='110' style={{borderRadius:'20px'}} alt={searchFriend.username}></img>
                                                    <div className="searchFriendNoprofileName">
                                                        {searchFriend.name[0]}
                                                    </div>
                                                </td>
                                                :
                                                <td className='searchFriendTd' colSpan="2">
                                                    <img src={searchFriend.userProfile} width='110' height='110' style={{borderRadius:'20px'}} alt={searchFriend.username}></img>
                                                </td>
                                            }
                                        </tr>
                                        <tr>
                                            <td id='searchFriendNameTd' colSpan="2">
                                                {searchFriend.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                <span>
                                                    상태메시지
                                                </span>
                                            </td>
                                        </tr>
                                    </>
                                    :
                                    <tr id ='addFriendInsertCommentTr'>
                                        <td colSpan="2">
                                            <span>이름과 전화번호가 일치하고 검색을 허용한 <br/> 친구를 찾을 수 있습니다.</span>
                                        </td>
                                    </tr>
                                }            
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
                <div id ='addFriendBtnDiv'>
                    <table id='addFriendBtnTable'>
                        <tbody>
                            <tr>
                                <td className='addFriendBtnTd'>
                                    <input className='addFriendBtn' type='button' value='검색' onClick={e=>{searchUser(e)}}></input>
                                </td>
                                
                                <td className='addFriendBtnTd'>
                                    
                                    {searchResult 
                                    ?
                                    <input className='addFriendBtn' type='button' value='친구 추가' onClick={e=>{addFriend(e)}}></input>
                                    :
                                    <input className='addFriendBtn' type='button' value='친구 추가' disabled></input>
                                     }
                                </td>                                
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}




export default AddFriendModal;