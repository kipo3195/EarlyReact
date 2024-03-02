
function MentionCheck(props){

    var checkLine = props.checkLine;

    var tempArr = checkLine.split('\n');
    // console.log('tempArr', tempArr);
    
    return(
       <span>
        {
            tempArr.map((line)=> 
            <p className="chatContentsP">
                {
                    (line.includes('@mt')
                    ?
                    <> {/*해당 <> 태그가 있어야 span을 @mt로 나눌 수 있다. react의 fragment */}
                        <span style={{color:'blue'}} >{line.split('@mt')[0]}</span>
                        <span> {line.split('@mt')[1]}</span>
                    </>    
                    :
                    line
                    )
                }
            </p>
            
        )}
        </span>
    )
}
// 


export default MentionCheck;