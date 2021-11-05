import React,{ useState, useEffect } from 'react'
import ImageGallery from 'react-image-gallery'

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){  //이미지가 있고 한개 이상 일 때 
            let images = [] // react-image-gallery기능 사용을 위한 이미지 담는 틀

            props.detail.images.map(item => {
                images.push({
                    original:`http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }


    }, [props.detail])  //렌더링 될때는 위 if(props.detail.images ~ 가 실행을 않는데 props.detail.images가 없기때문이다(처음엔 없는데 두번째 받아옴). 거기에 넣어주는 역할  / props.detail 이 바뀔때마다 useEffect실행 @@@잘 몰라


    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
