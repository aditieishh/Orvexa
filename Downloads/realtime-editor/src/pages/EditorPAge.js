import React, { useState,useRef, useEffect } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Navigate, useLocation } from 'react-router-dom';
import react from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import { useNavigate,useParams } from 'react-router-dom';

const EditorPAge = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const [socketReady, setSocketReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            setSocketReady(true);

            socketRef.current.on('connect_error', (err) => handleErrors(err));  
            socketRef.current.on('connect_failed', (err) => handleErrors(err)); 

            function handleErrors(e){
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username: location.state?.username,
            });
            socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room.`);
                    console.log(`${username} joined `);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    code:codeRef.current,
                    socketId
                });
            })


            socketRef.current.on(ACTIONS.DISCONNECTED,( {socketId,username} )=>{
                toast.success(`${username} left the room`);
                setClients((prev) =>{
                    return prev.filter((client)=>client.socketId!==socketId
                    )
                })
            })




        };
        init();
        return ()=>{
    if(socketRef.current){
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
    }
};
    }, []);
    
    async function copyRoomId(){
        try{
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        }catch(err){
            toast.error('Could not copy Room Id');
            console.error(err);
        }
    }   
    function leaveRoom(){
        reactNavigator('/');
    }

    if(!location.state){
        return <Navigate to='/' />
    }
    
                                 
  return (
    <div className='mainWrap'>
        <div className='aside'>
            <div className='asideInner'>
                <div className='logo'>
                    <img className='logoImage' src='/orvexa.png' alt='logo' />
                </div>
                
            
                <h3>Connected</h3>
                <div className='clientsList'>
                    {clients.map((client) => (
                        <Client key={client.socketId} username={client.username} />
                    ))}
                </div>
            </div>
            <button className='btn copyRoomId'onClick={copyRoomId}> Copy Room ID</button>
            <button className='btn leaveRoom' onClick={leaveRoom}> Leave Room</button>
        </div>
        <div className='editorWrap'>
            {socketReady && (<Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
            )}
        </div>
    </div>
  )
}

export default EditorPAge