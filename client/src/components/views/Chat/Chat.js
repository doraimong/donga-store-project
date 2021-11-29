import React,{useEffect, useState} from 'react'
import io from "socket.io-client";

function Chat() {
   /* const socketClient = io('http://localhost:5000');
    socketClient.on("connect", (err) => { 
        console.log(err); 
    });*/

    const [s, sets] = useState('')
    useEffect(() => {
        let socket = io('http://localhost:5000')
        socket.emit("chatting","haha", (err)=> {
        sets(err)
    })
    }, [])
    

    return (
        <div>
            {s}
        </div>
    )
}

export default Chat
