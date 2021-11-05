import React,{useEffect, useState} from 'react'
import axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col } from 'antd';

function DetailProductPage(props) {

    const productId = props.match.params.productId  //제품을 특정할 수 있는 값

    const [Product, setProduct] = useState({})  // 받을 내용이 Object이기때문에 {}

    useEffect(() => {
       axios.get(`/api/product/products_by_id?id=${productId}&type=single`) //쿼리로 각 제품별 주소연결 / type=single 은 여러개의 물건이 아닌 단일품목으로 가져옴을 의미
            .then(response => {
                setProduct(response.data[0])
            })
            .catch(err => alert(err))
    }, [])

    return (
        <div style={{ width: '100%', padding:'3rem 4rem' }}>
            <div style={{ display:'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>
            <br/>

            <Row gutter={[16, 16]}> {/*16,16 여백 주기*/}
                <Col lg={12} sm={24}>
                    <ProductImage detail={Product}/>
                </Col>
                <Col lg={12} sm={24}>
                    <ProductInfo detail={Product}/>
                </Col>
            </Row>

    
            
        </div>
    )
}

export default DetailProductPage
