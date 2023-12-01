import axios from 'axios';
import AccessToken from '../../modules/AccessToken';

import '../css/UserContent.css'
axios.defaults.withCredentials = true;
function User(props){
    
    

    return(
        
        <div id ='userMainDiv'>
            <div id ='userListDiv'>

            </div>
            <div id ='userDetailDiv'>
                <table>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>
                            <a id ='findTableALink' href='' onClick={event=>{
                                event.preventDefault();
                                props.back();
                            }}>뒤로가기</a>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
 
   
}

export default User;