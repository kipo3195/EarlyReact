import '../css/UserHeader.css'

function UserHeader(){

    return(
            <header id ='userHeader'>
                
                <h1 id = "userHeaderTitle">early!</h1>
                
                <ul className ='userHeaderUl'>
                    <li>address</li>
                    <li>chat</li>
                    <li>message</li>
                    <li>email</li>
                    <li>calendar</li>
                    <li>env</li>
                </ul>
   
            </header>
    
    )


}

export default UserHeader;

