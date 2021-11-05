import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SECCESS_BUY
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(id){

    let body = {
        productId: id
    }
    const request = axios.post(`${USER_SERVER}/addToCart`, body)
    .then(response => response.data);
    

    return {
        type: ADD_TO_CART,
        payload: request    
    }
}

export function getCartItems(cartItems, userCart){  //매개변수는 redux store의 cart정보를 담고있다.

    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
    .then(response => { //response에 여러가지 상품의 정보들이 들어있다
        // CartItem들에 해당하는 정보들을
        // Product Collection에서 가져온후에 
        // Quantity 정보를 넣어준다 
        
        userCart.forEach(cartItem => {  //redux store속의 카트정보 
            response.data.forEach((productDetail, index) => {    //response에 DB에서 카트의 상품id로 검색해서 카트 해당 id의 상품 정보를 가져와 비교해서  redux store cart의 id의 quantity -> redux store cart의 id의 DB product 스키마 정보에 합해준다
                if(cartItem.id === productDetail._id) {
                    response.data[index].quantity = cartItem.quantity
                }
            })
        })
        return response.data;       //redux store에 cartDetail에 들어갈 예정

    });
    

    return {
        type: GET_CART_ITEMS,
        payload: request    
    }
}

export function removeCartItem(productId){  //매개변수는 redux store의 cart정보를 담고있다.

    const request = axios.get(`/api/users/removeFromCart?id=${productId}`)
    .then(response => { 
        
        //productInfo, cart 정보를 조합해서 cartDetail을 만든다.

        response.data.cart.forEach(item => {
            response.data.productInfo.forEach((product, index) => {
                if(item.id === product._id){
                    response.data.productInfo[index].quantity = item.quantity
                }
            })
        })
        return response.data;      
    });
    
    return {
        type: REMOVE_CART_ITEM,
        payload: request    
    }
}

export function onSuccessBuy(data){  //

    const request = axios.post(`/api/users/successBuy`, data)
    .then(response => response.data)
    
    return {
        type: ON_SECCESS_BUY,
        payload: request    
    }
}

