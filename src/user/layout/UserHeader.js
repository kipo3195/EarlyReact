import axios from 'axios';

import '../css/UserHeader.css'
import address from '../../etc/img/address.png'
import chat from '../../etc/img/chat.png'
import message from '../../etc/img/message.png'
import email from '../../etc/img/email.png'
import calendar from '../../etc/img/calendar.png'
import env from '../../etc/img/env.png'


function UserHeader(props){

    return(
            <header id ='userHeader'>
                <table id ='userHeaderTable'>
                    <tbody>
                        <tr>
                            <th id='userHeaderTitle'>Early!</th>

                            <td id='address' 
                            className='userHeaderTd'><img className='userHeaderTdImg' src={address} width='45' alt='address'
                            onClick={event=>{
                                event.preventDefault();
                                props.address();
                            }}></img></td>

                            <td id='chat'
                             className='userHeaderTd'><img className='userHeaderTdImg' src={chat} width='45' alt='chat'
                             onClick={event=>{
                                event.preventDefault();
                                props.chat();
                             }}></img></td>

                            <td id='message'
                             className='userHeaderTd'><img className='userHeaderTdImg' src={message} width='45' alt='message'
                             onClick={event=>{
                                event.preventDefault();
                                props.message();
                             }}></img></td>

                            <td id='email'
                             className='userHeaderTd'><img className='userHeaderTdImg' src={email} width='45' alt='email'
                             onClick={event=>{
                                event.preventDefault();
                                props.email();
                             }}></img></td>

                            <td id='calendar'
                             className='userHeaderTd'><img className='userHeaderTdImg' src={calendar} alt='calendar'
                             onClick={event=>{
                                event.preventDefault();
                                props.calendar();
                             }}></img></td>

                            <td id='env'
                             className='userHeaderTd'><img className='userHeaderTdImg' src={env} width='45' alt='env'
                             onClick={event=>{
                                event.preventDefault();
                                props.env();
                             }}></img></td>
                           
                            <td className='userMenuTd'>
                            <a id ='findTableALink' href='' onClick={event=>{
                                event.preventDefault();
                                props.cs();
                            }}>고객센터</a>
                            </td>

                            <td className='userMenuTd'>
                            <a id ='findTableALink' href='' onClick={event=>{
                                event.preventDefault();
                                props.info();
                            }}>마이페이지</a>
                            </td>

                            <td className='userMenuTd'>
                            <a id ='findTableALink' href='' onClick={event=>{
                                event.preventDefault();
                                if(window.confirm('로그아웃 하시겠습니까?')){
                                    props.logout();
                                }
                            }}>로그아웃</a>
                            </td>
                        </tr>
                    </tbody>
                </table>                

            </header>
    
    )


}

export default UserHeader;

