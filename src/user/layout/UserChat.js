import '../css/UserChat.css';
import axios from 'axios';
import * as StompJs from "@stomp/stompjs";


axios.defaults.withCredentials = true;




function UserChat(props){
    
   
    const stompClient = new StompJs.Client({
        brokerURL : 'wss://localhost:8080/earlyShake'
    });


    console.log('UserChat', props.list);
    const items = [props.list];
    console.log(items);
    const jsonData = JSON.parse(items);
    
    //채팅 데이터 jsonArray
    console.log(jsonData);

    function makeTitle(t){
        return t.split('|')[0] + ' 외 ' + t.split('|').length+'명';
    }

    function makeLastDate(t){
        var date ='';

        for(var i = 0 ; i < 6; i++){
            date += t[i];
            if(i == 1 || i == 3){
                date +='-';
            }
            
        }

        return date;
    }


    
    return(
        
        <div>
            {/*리스트 영역 */}
            <div id ='chatListDiv'>
                <table id ='chatListTable'>
                    <tbody>
                        {jsonData.map((item) =>
                        <tr className='chatListTr' key={item.chatRoomSeq}>
                            <td className='chatListTitleTd'>
                                {/* return 내에서 조건문(삼항 연산자)*/}
                                { 
                                    item.chatRoomTitle === null
                                    ? makeTitle(item.chatRoomUsers)
                                    : item.chatRoomTitle
                                }
                            </td>
                                {/* return 내에서 split*/}
                            <td className='chatListUsersTd'>{ 
                                 item.chatRoomTitle === null
                                 ? ''
                                 : makeTitle(item.chatRoomUsers)
                                }
                            </td>
                            <td className='chatListLastDateTd'>
                                {makeLastDate(item.lastLineKey)}
                            </td>
                            
                        </tr>
                        )}            
                    </tbody>
                </table>
            </div>

            {/*컨텐츠 영역*/}
            <div id ='contentDiv'>
                    <tablt>
                        <tbody>
                            <tr>
                                <td><input type ='button' value='연결' onClick={(event)=>{
                                    event.preventDefault();
                                    
                                    stompClient.activate();
                                    
                                    stompClient.onConnect = function (frame) {
                                        console.log(frame);
                                      };
                                     
                                    // stompClient.onWebSocketError = (error) => {
                                    //     console.error('Error with websocket## : ', error);
                                    // };
                                    
                                }}></input></td>
                            </tr>
                            <tr>
                                <td><input type ='text'></input></td>
                                <td><input type ='submit' value='전송'></input></td>
                            </tr>
                        </tbody>
                    </tablt>
            </div>
        </div>
    )

}

export default UserChat;