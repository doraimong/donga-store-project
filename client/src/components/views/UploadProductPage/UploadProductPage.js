import React, {useState} from 'react'
import {Typography, Button, Form, Input} from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';
const {TextArea} = Input;

const {Title} = Typography;


const Continents = [                   //카테고리 
    { key:1, value: "도서" },
    { key:2, value: "전자제품" },
    { key:3, value: "의류" },
    { key:4, value: "뷰티" },
    { key:5, value: "생활용품" },
    { key:6, value: "스포츠/레저" },
    { key:7, value: "반려동물" }
]

function UploadProductPage(props) {

    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(1)   //수정해야할 부분 : 카테고리 
    const [Images, setImages] = useState([])   

    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }
    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }
    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
    }
    const continentChangeHandler = (event) => {
        setContinent(event.currentTarget.value)
    }

    const updateImages = (newImages) => {   //인자 newImages는 FileUpload.js의 Images state를 받는다.
        setImages(newImages)
    }

    const submitHandler = (event) => {
        event.preventDefault();             //화면 리프레시 방지    
        
        if(!Title || !Description || !Price || !Continent || !Images){              //!!!!!!!!!수정 사진 안넣고싶으면 ㅅImages빼자 
            return alert("모든 값을 넣어주세요")
        }
        
        //서버에 채운 값을 request로 전송 
        const body = {
            //로그인 된 사람의 ID //hoc 폴더의 auth.js에서 user정보를 가져온다.
            writer: props.user.userData._id,        
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            continents: Continent
        }
       

        Axios.post('/api/product', body)
            .then( response => {
            if(response.data.success){
                alert('상품 업로드에 성공 했습니다.')
                props.history.push('/')     //성공 -> 바로 landingpage로 보내버림 
            } else {
                alert('상품 업로드에 실패 했습니다')
            }
        })
    }

    return (
        <div style={{ maxWidth:'700px', margin: '2rem auto'}}>
            <div style={{testAlign: 'center', marginBottom:'2rem'}}>
                <h2> 중고 상품 업로드</h2>  {/*level로 글자크기 조절*/}
            </div>

            <Form onSubmit={submitHandler}>
                
                <FileUpload refreshFunction={updateImages}/>
                <br/>
                <br/>
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={Title}/>
                <br/>
                <br/>
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description}/>
                <br/>
                <br/>
                <label>가격($)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price}/>
                <br/>
                <br/>
                {/*item안에 위 Continents 의 한줄씩 들어있다. map 구조 설명 https://helicopter55.tistory.com/2*/}
                <select onChange={continentChangeHandler} value={Continent}>{/*onchange가 발생할때 continentChangeHandler 함수를 이용해 value를 바꾼다*/}
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}> {item.value} </option>
                    ))}
                    
                </select>
                <br/>
                <br/>
                <button type="submit">      {/*antd의 css 뺐다 기능상 오류때매(제출이 안됨 먹통)*/}
                    확인
                </button>

            </Form>
            
        </div>
    )
}

export default UploadProductPage
