import { useState, useEffect } from "react";
import { useImperativeFilePicker } from 'use-file-picker';
import axios from 'axios';

function FileSendModal(props){

    const serverUrl = process.env.REACT_APP_SERVER_FILE_URL;

    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [sender, setSender] = useState(null);

    function closeModal(e){
        e.preventDefault();
        props.closeModal();
    }

    useEffect(()=>{
        var temp = props.file;
        console.log(temp);
        const imageUrl = URL.createObjectURL(temp);
        setPreviewUrl(imageUrl);
        setFile(temp);
        setSender(props.sender);
    }, [props.file])

    // 파일 전송 버튼 클릭시
    const fileUpload = async(e) => {
        e.preventDefault();
        // 파일 없으면 창닫아버림.
        if(!file){
            props.closeModal();
            return;
        }
        const formData = new FormData();
        console.log(file);
        formData.append('fileData', file);
        formData.append('senderId', sender);
        try {
            let axiosConfig = {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
            const response = await axios.post(serverUrl+'upload', formData, axiosConfig);
            console.log(response.data)
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
                                <td id ='fileSendListTableLTd'><img src={previewUrl}  width='40px' height='40px' alt="uploaded"></img></td>
                                <td>{file ? file.name : ''}</td>
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
                                    <input type='button' value='전송' onClick={e=>fileUpload(e)}></input>
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