import axios from 'axios';

import '../css/UserHeader.css'
import address from '../../etc/img/address.png'
import chat from '../../etc/img/chat.png'
import unreadChat from '../../etc/img/unreadChat.png'
import message from '../../etc/img/message.png'
import email from '../../etc/img/email.png'
import calendar from '../../etc/img/calendar.png'
import env from '../../etc/img/env.png'


function UserHeader(props){

    var chatUnread = props.chatUnread;

    return(
            <header id ='userHeader'>
                <table id ='userHeaderTable'>
                    <tbody>
                        <tr>
                            <th id='userHeaderTitle'>Early!</th>

                            <td id='address' onClick={event=>{
                                event.preventDefault();
                                props.address();
                            }} className='userHeaderTd'><img className='userHeaderTdImg' src={address} width='45' alt='address'
                            ></img></td>

                            <td id='chat'onClick={event=>{
                                event.preventDefault();
                                props.chat();
                             }} className='userHeaderTd'>
                                {
                                    chatUnread && chatUnread >= 0 
                                    ?
                                    <img className='userHeaderTdImg' src={unreadChat} width='45' alt='chat'></img>
                                    :
                                    <img className='userHeaderTdImg' src={chat} width='45' alt='chat'></img>
                                }
                                
                                </td>

                            <td id='message' onClick={event=>{
                                event.preventDefault();
                                props.message();
                             }} className='userHeaderTd'><img className='userHeaderTdImg' src={message} width='45' alt='message'
                            ></img></td>

                            <td id='email' onClick={event=>{
                                event.preventDefault();
                                props.email();
                             }} className='userHeaderTd'><img className='userHeaderTdImg' src={email} width='45' alt='email'
                             ></img></td>

                            <td id='calendar' onClick={event=>{
                                event.preventDefault();
                                props.calendar();
                             }} className='userHeaderTd'><img className='userHeaderTdImg' src={calendar} alt='calendar'
                             ></img></td>

                            <td id='env' onClick={event=>{
                                event.preventDefault();
                                props.env();
                             }} className='userHeaderTd'><img className='userHeaderTdImg' src={env} width='45' alt='env'
                             ></img></td>
                           
                            <td className='userMenuTd' onClick={event=>{
                                event.preventDefault();
                                props.cs();
                                }}> 고객센터
                            </td>

                            <td className='userMenuTd'onClick={event=>{
                                event.preventDefault();
                                props.info();
                                }}> 마이페이지
                                
                            </td>

                            <td className='userMenuTd'onClick={event=>{
                                event.preventDefault();
                                if(window.confirm('로그아웃 하시겠습니까?')){
                                    props.logout();
                                }
                                }}>로그아웃
                            </td>
                        </tr>
                    </tbody>
                </table>                

            </header>
    
    )


}

export default UserHeader;

