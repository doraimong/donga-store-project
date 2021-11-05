import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SECCESS_BUY
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART:
            return {
                ...state,
                userData: {
                    ...state.userData,      //원래 있던 userDate에 
                    cart: action.payload    //카트정보를 넣어줘 -> 잘모르겠으면 강의봐야한다. 무슨말인지 몰라
                }
            }
        case GET_CART_ITEMS:
            return {...state, cartDetail: action.payload }  //action 파트에서 해당 함수에서 return값을 받아서 저장
        case REMOVE_CART_ITEM:
            return {
                ...state, cartDetail: action.payload.Info,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
        case ON_SECCESS_BUY:
            return {
                ...state, cartDetail: action.payload.cartDetail,
                userData: {
                    ...state.userData, cart: action.payload.cart
                }
            }
            
        default:
            return state;
    }
}