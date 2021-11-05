import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock';
import { Empty, Result } from 'antd';
import Paypal from '../../utils/Paypal';

function CartPage(props) {
    const dispatch = useDispatch(); 
    const [Total, setTotal] = useState(0) 
    const [ShowTotal, setShowTotal] = useState(false)  
    const [ShowSuccess, setShowSuccess] = useState(false)
    
    useEffect(() => {

        let cartItems=[]

        //리덕스 User state안에 카트 상품이 들어있는지 확인
        if(props.user.userData && props.user.userData.cart){
            if(props.user.userData.cart.length > 0){
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id) //redux store의 cart에 있는 상품 id와 product id 비교해서 같은 id의 product정보를 가져오기 위함
                })
                
                dispatch(getCartItems(cartItems, props.user.userData.cart))  //axios역활할 자리 / 서버에 user의 quantity 정보와 product 정보를 통합할 예정 
                    .then(response => { calculateTotal(response.payload) })        //response.payload에는 reudx cart의 cartDetail정보가 담겨있다
    
            }
        }
        
    }, [props.user.userData])

    let calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })
        setTotal(total)
        setShowTotal(true)
    }

    let removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(response => {
                if(response.payload.productInfo.length <= 0){
                    setShowTotal(false)
                }
            })

    }

    const transactionSuccess = (data) => {      //Paypal.js에서 결정 성공후 받은 정보
        dispatch(onSuccessBuy({
            paymentData: data,                  //
            cartDetail: props.user.cartDetail   //와 카트정보를 보낸다.
        }))
            .then(response => {
                if(response.payload.success) {
                    setShowTotal(false)
                    setShowSuccess(true)
                }
            })
    }
    
    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            
            <div>
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart}/>   {/* */}
            </div>

            

            {/* 전체금액이 계산이 되어있으면 보여주는 내용 / 만약 반대라면 보여줄게 없는 것으로 대처  */}
            {ShowTotal ?                                    
                <div style={{ marginTop: '3rem'}}>
                    <h2>Total Amount : {Total} 원</h2>
                </div>
                : ShowSuccess ? 
                    <Result
                        status="success"
                        title="Successfully Purchased Items"
                    />
                    :
                    <>
                        <br/>
                        <Empty description={false}/>
                    </>
            }

            {ShowTotal &&
                <Paypal
                    total={Total}
                    onSuccess={transactionSuccess}
                />
            }

        </div>
    )
}

export default CartPage
