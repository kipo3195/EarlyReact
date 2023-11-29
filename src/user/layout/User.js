import axios from 'axios';
import AccessToken from '../../modules/AccessToken';

axios.defaults.withCredentials = true;
function User(props){
    
    

    return(
        <div>
        <table>
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
        </table>
    </div>
    )
 
   
}

export default User;