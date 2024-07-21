import { useState, useEffect } from "react";
import { useImperativeFilePicker } from 'use-file-picker';
import axios from 'axios';

function FileSendModal(props){

    const serverUrl = process.env.REACT_APP_SERVER_FILE_URL;
    const fileSendErrorMsg = process.env.REACT_APP_FILE_SENDING_ERROR_MSG; 

    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [sender, setSender] = useState(null);

    // chatType에 이용. 
    const [fileType, setFileType] = useState(null);

    function closeModal(e){
        e.preventDefault();
        props.closeModal();
    }

    console.log(previewUrl);

    useEffect(()=>{
        var temp = props.file;
        if(temp){
            console.log(temp);
            setFile(temp);
            setSender(props.sender);
            setFileName(temp.name);
            if(temp.type){
                if(temp.type.match('image')){
                    const imageUrl = URL.createObjectURL(temp);
                    setPreviewUrl(imageUrl);
                    setFileType('I');
                }else{
                    setFileType('F');
                }
            }
        }
    }, [props.file])

    // 파일 전송 버튼 클릭시
    function fileHash(e){
        e.preventDefault();

        const fileHashRequestPromise = fileHashRequest();

        fileHashRequestPromise.then(promise=>{
            var fileHash = promise.fileHash;
            fileUpload(e, fileHash);
        })

    }

    async function fileHashRequest(){
        var returnData = null;

        await axios({
            method:'get',
            url: serverUrl+'getFileHash',
        }).then(function(response){
    
            //console.log('ChatList', response);
            returnData = response.data;
            //console.log(returnData);
    
        }).catch(function(error){
            console.log(error);
        })
        return returnData;
    }

    const fileUpload = async(e, fileHash) => {
        e.preventDefault();
        // 파일 없으면 창닫아버림.
        if(!file){
            props.closeModal();
            return;
        }
        const formData = new FormData();
        formData.append('fileData', file);
        formData.append('senderId', sender);
        formData.append('fileHash', fileHash);
        try {
            let axiosConfig = {
                
            }
            const response = await axios.post(serverUrl+'upload', formData, axiosConfig);
            
            if(response.data && response.data.type === 'fail'){
                alert(fileSendErrorMsg);
                props.closeModal();
            }else{
                const fileSendData = {
                    'fileHash' : fileHash,
                    'previewUrl' : previewUrl,
                    'fileType' : fileType,
                    'fileName' : fileName
                }
                props.fileSend(fileSendData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <div id='fileSendModalParent'>
            <div id ='fileSendModal'>

                {/* 타이틀 + 모달 닫기 영역 */}
                <div id='fileSendTitle'>
                    <table id='fileSendTitleTable'>
                        <tbody>
                            <tr>
                                <td><span>파일전송</span></td>
                                <td id='fileSendCloseTd'><input type="button" value='X' onClick={e=>closeModal(e)}></input></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr></hr>

                {/* 리스트 영역 */}
                <div id='fileSendList'>
                    <table id ='fileSendListTable'>
                        <tbody>
                            <tr>
                                {(previewUrl) 
                                    ? 
                                (<td id ='fileSendListTableLTd'><img src={previewUrl}  width='40px' height='40px' alt="uploaded"></img></td>)
                                    :
                                (<td></td>)}
                                <td>{file ? file.name : ''}</td>
                                <td>{file ? file.size : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                {/* 전송 버튼 영역 */}
                <div id='fileSendBtn'>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <input type='button' value='전송' onClick={e=>fileHash(e)}></input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
    )
}


export default FileSendModal