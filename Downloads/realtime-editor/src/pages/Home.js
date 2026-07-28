import React from 'react'
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuid();
        setRoomId(id);
        toast.success('Created a new room');
    }
    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }
        
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    }
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }

    return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <img src='/orvexa.png' alt='logo' style={{ marginBottom: "30px", width: "250px", height: "80px" }} />
                <h4 className='mainLabel'>Paste invite ROOM ID</h4>
                <div className='inputGroup'>
                    <input type='text' className='inputBox' placeholder='ROOM ID' value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter}    /> 
                    <input type='text' className='inputBox' placeholder='USERNAME ' value={username} onChange={(e) => setUsername(e.target.value)} onKeyUp={handleInputEnter} />
                    <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                    <span className='createInfo'>If you don't have an invite then create a &nbsp;
                        <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Home