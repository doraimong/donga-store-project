import React from 'react'
import { Button, Descriptions } from 'antd';
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../../_actions/user_actions';  //리덕스 액션 이름도 import

function ProductInfo(props) {
    const dispatch = useDispatch();

    const clickHandler = () => {
        //필요한 정보를 Cart 필드에다가 넣어준다. -> user 정보는 리덕스를 사용했기 때문에 cart 도 user 스키마 정보이기에 리덕스 사용 / 리덕스 안썻으면 걍 axios 하면되는데
        dispatch(addToCart(props.detail._id))   //액션name은 addtoCart 안에 상품 id
        
        
    }

    return (
        <div>
            <Descriptions title="Product Info">
                <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
            </Descriptions>

            <br/>
            <br/>
            <br/>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                    장바구니
                </Button>
            </div>

        </div>
    )
}

export default ProductInfo
