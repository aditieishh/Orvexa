import React, { useEffect, useRef} from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import "codemirror/addon/edit/continuelist";
import "codemirror/addon/comment/comment";
import ACTIONS from '../Actions';

const Editor = ({socketRef,roomId,onCodeChange}) => {
    const editorRef = useRef(null);
    
    useEffect(() => {
         async function init(){
            editorRef.current=Codemirror.fromTextArea(document.getElementById('realtime-editor'), {
                mode: { name: "javascript", json: true },
                theme: "dracula",
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                indentUnit: 4,      
                tabSize: 4,
                indentWithTabs: false,
                smartIndent: true,
                electricChars: true,
            });
            


            editorRef.current.on('change',(instance,changes)=>{

                const {origin} = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if(origin!== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                        roomId,
                        code,
                    });
                }
            })
        }
        init();
        
    }, []);


    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
                if(code!==null){
                    //const cursor = editorRef.current.getCursor();
                    editorRef.current.setValue(code);
                    //editorRef.current.setCursor(cursor);
                }
            })
        }
        return ()=>{
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }

    },[socketRef.current]);



        return <textarea id= "realtime-editor">    </textarea> 
}
        

export default Editor
/*socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
                if(code!==null){
                    //const cursor = editorRef.current.getCursor();
                    editorRef.current.setValue(code);
                    //editorRef.current.setCursor(cursor);
                }
            })*/
           