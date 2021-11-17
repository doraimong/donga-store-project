import React, {useState, useEffect} from 'react'
import { useSelector } from "react-redux";
import axios from "axios";
import ShowSwiper from './ShowSwiper';
import { Icon, Col, Card, Row, Carousel } from 'antd';


/*
[대전제 : 카트에 없는 상품을 추천한다.]
-카트의 물건 흐름 -> 카트 물건의 카테고리를 추출 최다 항목카테고리의 상품(카트에 없는) 을 추천 
                -> 최다 항목을 추출할 수 없다(전자 = 도서의 경우) 는 추천 안하거나 보류 !
- 리덕스에 추천할 물건 정보 넣어서 다양한 페이지에서 사용가능하게하기 vs props로 쉽게 받아서 하기 landingpage에만 추천받기 -> 후자를 하고 후자 성공시 전자 시도 ㄱㄱ!!

현재 만든거 동작 
getCategorties()에서 장바구니속 최빈 카테고리(몇개든) 골라서 getProducts()에서 물건을 가져온다.
organizeProducts에서 뺄물건 빼고 organizeProducts()에서 범위 내 랜덤값 4개(보다 작으면 전부 출력)  
*/
function Recommendation() {
    
    const user = useSelector(state => state.user)   //redux store에 접근 가능하게 해준다.
    //console.log("!!!여기는 추천",user.userData)

    const [Products, setProducts] = useState([])
    //const [Pick, setPick] = useState([])

    useEffect(() => {
        getCategories();
        console.log("어디한번 응답을 볼까?2",Products)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response=> {
                if(response.data.success){
                    //setProducts(response.data.productInfo)
                    organizeProducts(response.data.productInfo)
                    console.log("어디한번 응답을 볼까?",response.data.productInfo)
                    
                } else {
                    alert("추천 상품 가져오기 실패")
                }
            })
    } 
    

    const getCategories = () => {
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
        
        //추천 할 카테고리가 있다, 없다. 
        if(theMostCategoryIndex.length > 0){  
            //해당 카테고리 물건 가져오기 
            let body={
                filters:{continents: theMostCategoryIndex}
            }
            getProducts(body)
            Products && console.log("body", Products)           
            
            //가져온 물건을 어떻게 정리하지?
        }else {
            
        }

         // 추천 상품 목록을 만드는데 -> 해당 카테고리(하나든 두개든) 상품 모아 -> 그 중 장바구니에 상품은 삭제 -> 그 중 랜덤하게 노출
    }


    const organizeProducts = (products) => {
        //추천할 물건에서 장바구니 물건 제거 
        console.log("organize",products)
        console.log("organize2",user.userData.cart)
        
        let test = products.length
        for(let i=0; i<products.length; i++){
            for(let ii=0; ii<user.userData.cart.length; ii++){
                /*console.log("organize",products[i]._id)
                console.log("organize2",user.userData.cart[ii].id)*/
                if(products[i]._id == user.userData.cart[ii].id){
                    products.splice(i,1)
                }
            }
        }
        
        setProducts(products)
        console.log("확인",products)

        //추천할 필요 없는 장바구니 속 물건뺴고 나머지 물건 중 4개pick  -> showSwiper는 출력
        if(products.length > 4){
            let pick = [], pickProducts = [];
            pick = selectIndex(products.length-1, 4)
            for(let i=0; i<pick.length; i++){
                let index = pick[i];
                pickProducts.push(products[index])
            }
            console.log("픽한 물건모음",pickProducts)
            setProducts(pickProducts)
        }
    }


    //특정 범위내, 특정 개수만큼 랜덤 값 뽑기
    const selectIndex = (totalIndex, selectingNumber) => {  //인자 : 범위, 뽑을 숫자 갯수
        let randomIndexArray = []
        for (let i=0; i<selectingNumber; i++) {   //check if there is any duplicate index
          let randomNum = Math.floor(Math.random() * totalIndex)
          if (randomIndexArray.indexOf(randomNum) === -1) {
            randomIndexArray.push(randomNum)
          } else { //if the randomNum is already in the array retry
            i--
          }
        }
        return randomIndexArray
      }
  
    

    return (
        <div>
            {/* 추천 물건 총리스트 - 장바구니속 물건 - 4개 pick => 뺄거 다 빼고 추천 물건 총리스트에서 남은 물건이 있으면 추천화면 보여줘 */}
            {Products.length ? <ShowSwiper products={Products} /> : false}
        </div>
    )
}

export default Recommendation