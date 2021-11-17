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
*/
function Recommendation() {
    
    const user = useSelector(state => state.user)   //redux store에 접근 가능하게 해준다.
    //console.log("!!!여기는 추천",user.userData)

    const [Products, setProducts] = useState([])
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

        if(theMostCategoryIndex.length > 0){  //추천 할 카테고리가 있다, 없다. 
            //해당 카테고리 물건 가져오기 
            let body={
                filters:{continents: theMostCategoryIndex}
            }
            getProducts(body)
            Products && console.log("body", Products)
            //!!!여기서 할게 아니라 저 위에서 해야한다.getProducts 에서 다루자
            
            
            //가져온 물건을 어떻게 정리하지?
        }else {
            
        }

         // 추천 상품 목록을 만드는데 -> 해당 카테고리(하나든 두개든) 상품 모아 -> 그 중 장바구니에 상품은 삭제 -> 그 중 랜덤하게 노출
    }

    const organizeProducts = (products) => {
        //물건 제거 
        console.log("organize",products)
        console.log("organize2",user.userData.cart)
        let test = products.length
        for(let i=0; i<products.length; i++){
            for(let ii=0; ii<user.userData.cart.length; ii++){
                /*console.log("organize",products[i]._id)
                console.log("organize2",user.userData.cart[ii].id)*/
                if(products[i]._id == user.userData.cart[ii].id){
                    console.log("같은 아이디",products[i]._id)
                    products.splice(i,1)
                }
            }
            /*if(test-1 == i){
                console.log("확인", products[i])
                for(let i=0; i<products.length; i++){
                    console.log("확인", products[i])
                }
            }*/
        }
        setProducts(products)
        console.log("확인",products)

        

        //물건 선정

    }
  
    

    return (
        <div>
            
            {/*<ProductSwiper detail={products} />*/}
            {/* console.log("Tlqkf",Products)*/}
            {<ShowSwiper products={Products} />}
            


        </div>
    )
}

export default Recommendation
