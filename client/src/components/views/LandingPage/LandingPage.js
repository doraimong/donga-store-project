import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';   //검색 기능 컴포넌트
import Recommendation from '../Recommendation/Recommendation';
import { continents, price } from './Sections/Datas'
import { useSelector } from "react-redux";
import './LandingPage.css';


function LandingPage() {
    
    const user = useSelector(state => state.user)   //redux store에 접근 가능하게 해준다.

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)    
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })                       
    const [SearchTerm, setSearchTerm] = useState("")                  
    
    useEffect(() => {
        //처음에 페이지 들어왔을떄 트리거
        let body = {    //상품 노출 갯수 관리
            skip: Skip,
            limit: Limit 
        }
        getProducts(body)
        
        
    }, [])

    const getProducts = (body) => {
        //console.log("순서1",body)
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success){
                    console.log(body)
                    if(body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])    // 기존의 state인 Products를 그대로 가져와 더보기 개수 만큼 붙여준다.
                    } else {
                        setProducts(response.data.productInfo)
                        //console.log("원조가져오기",response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert("DB에서 상품 가져오기 실패했습니다")
                }
            })
        //console.log("순서1.2",body)
    }
    
    //'더보기 버튼' 누를때
    const loadMoreHandler = () => {
        let skip = Skip + Limit
        let body = {    //상품 노출 갯수 관리
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters
        }
        
        getProducts(body)
        setSkip(skip)
        console.log("순서2", Products)
    }

    //출력
    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={12} key={index}>
            <Card
                cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images}/> </a>}  //ImageSlider 컴포넌트에서 사진을 받도록한다.
            >
                <Meta
                    title={product.title}
                    description={`${product.price} 원`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {
        let body = {    
            skip: 0,
            limit: Limit ,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price; // datas.js의 price 정보가 다 담겨있다
        let array =[];

        for(let key in data){
            if (data[key]._id === parseInt(value, 10)){ // datas.js의 _id 와 들어온 값 value와 같다면 
                array = data[key].array;                //datas.js의 array정보를 가져옴
            }
        }
        return array;
    }

    //카테고리, 가격을 필터로 만듦
    const handleFilters = (filters, category) => {  
        const newFilters = { ...Filters }
        newFilters[category] = filters
        
        if(category === "price"){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    //검색
    const updateSearchTerm = (newSearchTerm) => {   //newSearchTerm이 searchFeature.js에서 받아온 값을 state에 실제로 넣음(상위(현)컴포넌트 state업데이트)
        
        let body = {
            skip: 0, //DB의 첫부분부터 검색해서 들고오기때문
            limit: Limit,   //8
            filters: Filters,   //기존의 체크 라디오 박스의 선택 유지 위함
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    

    //console.log("유저",user)
    //user.userData ? console.log("있다.") : console.log("없다")
    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            
            {/*캐러셀 */}
            <Carousel autoplay className="contentStyle">
                <div>
                    <img style={{ width: '100%', maxHeight: '100%', justifyContent: 'center'}} src={'http://localhost:5000/uploads/mainImage.JPG'}/>
                </div>
                <div>
                    <img style={{ width: '100%', maxHeight: '100%', justifyContent: 'center'}} src={'http://localhost:5000/uploads/subImage1.JPG'}/>
                </div>
                
            </Carousel>
            <p/>

            {/*추천*/}
            <div>
                {user.userData && user.userData.isAuth && user.userData.cart.length>0? <Recommendation /> : false}    {/* 로그인 한 상태 && 인증된상태 && 카트에 상품이 있을때 */}
                {/*console.log("여기",user.userData)*/}
            </div>

            <div style={{ textAlign: 'center'}}>
                <h2>중고 상품 거래로 환경을 지키세요!<Icon type="rocket"/> </h2>
            </div>

            


            <Row gutter={[16, 16]}> 
                <Col lg={12} xs={24}>
                    <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
                </Col>
                <Col lg={12} xs={24}>
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")}/> {/*handleFilters가 하위 컴포넌트의 값을 현재의 컴포넌트로 가져온다*/}
                </Col>
                
            </Row>
            

            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature
                    refreshFunction={updateSearchTerm} 
                />  {/*하위 컴포넌트에서 값 가져와서 state에 넣어준다.*/}
            </div>




            <Row gutter={[16, 16]}> {/*gutter 여백*/}
                {renderCards}
            </Row>
            
            <br/>
            {PostSize >= Limit &&   
                <div style={{  display: 'flex', justifyContent: 'center'}}>
                <button onClick={loadMoreHandler}>더보기</button>
            </div>
            }
        </div>
    )
}

export default LandingPage
//test