import '../css/UserChat.css';
import axios from 'axios';
axios.defaults.withCredentials = true;




function UserChat(props){
    
    console.log('UserChat', props);
    const items = ['a','b','c','d','e','f','g','h','i','j'];

    return(
        <div>
            <div id ='chatListDiv'>
                <table id ='chatListTable'>
                    <tbody>

                        {items.map((item) =>
                        <tr>
                            <td className='chatListTr' key={item}>{item}</td>
                        </tr>
                        )}            

                    </tbody>
                </table>
            </div>
            <div id ='contentDiv'>

            </div>
        </div>
    )

}

export default UserChat;