import React,{useState} from 'react'
import Axios from 'axios';

function Test() {
    const [Secret, setSecret] = useState('')
    const [Check, setCheck] = useState('')

    const onChangeCheck = (e) => {
        setCheck(e.currentTarget.value);
    }
    const onCheckSecret = () => {
        if(Check == Secret){
            alert('맞다')
        }else {
            alert('아니다')
        }
    }

    const sendEmail = () => {
        let email = 'mkz'
        let body = {email}
        Axios.post('/api/users/sendEmail', body)
            .then(response => {
                console.log('응답',response.data.randNum)
                setSecret(response.data.randNum)
            })
    }
    return (
        <div>
            <br/><br/><br/><br/><br/>
            <button onClick={sendEmail}> 전송 </button>
            <h1>확인해보세요</h1>
            <input type='text' value={Check} onChange={onChangeCheck} />
            <button onClick={onCheckSecret}>인증번호 확인</button>
        </div>
    )
}

export default Test
