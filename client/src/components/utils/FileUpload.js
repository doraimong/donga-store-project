import React, {useState} from 'react'
import Dropzone from 'react-dropzone'
import {Icon} from 'antd';
import axios from 'axios';
/*
    여기는 자식 컴포넌트이기때문에 부모 컴포넌트인 UploadProductPage.js의 state로 현재의 이미지 정보를 보내줘야한다. 
*/

function FileUpload(props) {

    const [Images, setImages] = useState([])    //여러개의 이미지를 받기위해 배열로/ 파일의 경로를 들고있다.


    const dropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/fomr-data'} //어떤 파일인지 정의해서 백엔드에서 받을 때 문제없게한다.
        }
        formData.append("file", files[0])   //append를 이용해서 파일을 더한다.

        axios.post('/api/product/image', formData, config)  //파일 전송시 뒤에 두개인자같이 안보내면 에러가 난다. formData :올릴 파일의 정보, 
            .then(response=>{                               //response : 파일 정보를 담고있다.
                if(response.data.success){
                    setImages([...Images, response.data.filePath])    //...Images를 함으로써 배열에 들어간 여러개의 이미지를 다 받아옴
                    props.refreshFunction([...Images, response.data.filePath])      //상위 컴포넌트로 보냄 /현위치의 state인 Images와 상위 컴포넌트의 state인 Images를 같게 만들어준다.
                } else {
                    alert('파일 저장에 실패했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {

        const currentIndex = Images.indexOf(image);
        let newImages = [...Images] //현재 이미지 모두 복사.
        console.log("eeeee" + newImages)
        newImages.splice(currentIndex, 1)   //모든 이미지 array에서 현재 선택 인덱스에 해당 사진 하나를 지워준다./ currentIndex에서 1개 삭제
        setImages(newImages)

        props.refreshFunction(newImages)                                              //상위 컴포넌트로 보냄 /현위치의 state인 Images와 상위 컴포넌트의 state인 Images를 같게 만들어준다.
    }

    return (
    <div style={{ display:'flex', justifyContent: 'space-between'}}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div 
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem'}}/>
                    </div>
                    </section>
                )}
            </Dropzone>
            
            <div style={{ display:'flex', width: '350px', height: '240px', overflowX: 'scroll'}}>
                        {Images.map((image, index) => (
                            <div onClick={() => {deleteHandler(image)}} key={index}>   {/*맵 함수 요소 각각에 독립적인 값부여가 필요하다*/}
                                <img style={{ minWidth: '300px', width:'300px', height:'240px'}}
                                    src={`http://localhost:5000/${image}`}
                                />
                            </div>
                        ))}

            </div>

        </div>
    )
}           

export default FileUpload
       