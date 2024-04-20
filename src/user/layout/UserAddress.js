import axios from 'axios';
import '../css/UserAddress.css';
import searchBtn from '../../etc/img/addressSearchBtn.png';
import addBtn from '../../etc/img/addressAddBtn.png';
axios.defaults.withCredentials = true;

function UserAddress(){

    return(
        <div id='addressDiv'>
            {/* 친구 추가 버튼 */}
            <div id='addressBtnDiv'>
                <table>
                    <tbody>
                        <tr>
                            <td id ='addressTitle'>친구</td>
                            <td id ='addressSearch'>
                                <img src={searchBtn} alt={searchBtn}></img>
                            </td>
                            <td id ='addressAdd'>
                                <img src={addBtn} alt={addBtn}></img>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>
            
            {/* 사용자 리스트  */}
            <div id='addressList'>


            </div>

        </div>
    )

}

export default UserAddress;