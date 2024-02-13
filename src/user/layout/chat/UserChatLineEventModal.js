

function UserChatLineEventModal(){


    function closeModal(){
        console.log('모달창 X버튼 클릭')
    }

    return(

        <div className="lineEventModalDiv">

            <button id="lineEventModalCloseBtn" onClick='closeModal'>
                X
            </button>

        </div>

    )


}


export default UserChatLineEventModal;