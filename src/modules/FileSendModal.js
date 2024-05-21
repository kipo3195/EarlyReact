import { useState, useEffect } from "react";
import { useImperativeFilePicker } from 'use-file-picker';

function FileSendModal(props){

    const [previewUrl, setPreviewUrl] = useState(null);

    var file = props.file;
    function closeModal(e){
        e.preventDefault();
        props.closeModal();
    }
    useEffect(()=>{
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
    }, [file])

    return (

        <div id='fileSendModalParent'>
            <div id ='fileSendModal'>

                {/* 타이틀 + 모달 닫기 영역 */}
                <div id='fileSendTitle'>
                    <table>
                        <tbody>
                            <tr>
                                <td><span>파일전송</span></td>
                                <td><input type="button" value='X' onClick={e=>closeModal(e)}></input></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 리스트 영역 */}
                <div id='fileSendList'>
                    <table id ='fileSendListTable'>
                        <tbody>
                            <tr>
                                <td><img src={previewUrl} alt="uploaded"></img></td>
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
                                    <input type='button' value='전송'></input>
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