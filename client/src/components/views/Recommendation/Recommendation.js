import React, {useState, useEffect} from 'react'
import { useSelector } from "react-redux";
import axios from "axios";
/*
[대전제 : 카트에 없는 상품을 추천한다.]

-카트의 물건 흐름 -> 카트 물건의 카테고리를 추출 최다 항목카테고리의 상품(카트에 없는) 을 추천 
                -> 최다 항목을 추출할 수 없다(전자 = 도서의 경우) 는 추천 안하거나 보류 !

- 리덕스에 추천할 물건 정보 넣어서 다양한 페이지에서 사용가능하게하기 vs props로 쉽게 받아서 하기 landingpage에만 추천받기 -> 후자를 하고 후자 성공시 전자 시도 ㄱㄱ!!
*/
function Recommendation() {
    
    //console.log("ㅡㅡㅡㅡ정리ㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
    const user = useSelector(state => state.user)   //redux store에 접근 가능하게 해준다.
    console.log("!!!여기는 추천",user.userData)
    let products = []
    const renderRecommendtaion = () => {
        //카트의 상품이 있을때 제일 많은 종류의 카테고리 선별
        let theMostCategory=Array.from({length: 20}, () => 0);//배열20개 0으로 초기화
        
        user.userData.cart.map(item => {   //카트에 최고 카테고리 위해 
        theMostCategory[item.category]++
        })
        
        let best = Math.max(...theMostCategory);
        let theMostCategoryIndex=[];
        //console.log('best',best)
        for(let i=0; i<theMostCategory.length; i++){    //최빈값이 몇개인지 -> 1개 이상이면 최대 카테고리 중복
            if(theMostCategory[i] == best)theMostCategoryIndex.push(i)
        }
        //console.log("index",theMostCategoryIndex)
        
        if(theMostCategoryIndex.length > 0){  //추천 할 카테고리가 있다, 없다. 
            //해당 카테고리 물건 가져오기 
            let body={
                filters: {continents: theMostCategoryIndex}
            }
            
            axios.post('/api/product/products', body)
                .then(response=> {
                    if(response.data.success){
                        products = response.data.productInfo
                        console.log("어디한번 응답을 볼까?",products)
                        
                    } else {
                        alert("추천 상품 가져오기 실패")
                    }
                })
            
            //가져온 물건을 어떻게 정리하지?
            
        

            

        }else {
            
        }
        
        // 추천 상품 목록을 만드는데 -> 해당 카테고리(하나든 두개든) 상품 모아 -> 그 중 장바구니에 상품은 삭제 -> 그 중 랜덤하게 노출
    
    }
    
    

    return (
        <div>
            이런 상품 강추!!
            {renderRecommendtaion()}
            {console.log("벗어나도 되는가",products)}
            {/*<ProductSwiper detail={products} />*/}
        </div>
    )
}

export default Recommendation
