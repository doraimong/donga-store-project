import React from 'react'
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';

function ShowSwiper(props) {

  console.log("props pick",props.pick)//0 or 4

  const renderCards =/* props.pick==0 ? */props.products.map((product, index) => {
    
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
  /*:
  () => {console.log("들어왓다")
    for(let i=0; i<props.pick.length; i++){
      let index = props.pick[i]
      let product = props.products[index]
      console.log("군대",index,product)
      return (<Col lg={6} md={8} xs={12} key={index}>
        <Card
            cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images}/> </a>}  //ImageSlider 컴포넌트에서 사진을 받도록한다.
        >
            <Meta
                title={product.title}
                description={`${product.price} 원원`}
            />
        </Card>
    </Col>)
    }
  }*/
/*
  //pick을 인덱스로 사용 pick이 4일때 이거쓰고 0일때 map 사용
  for(let i=0; i<props.pick; i++){
    let index = props.pick[i]
    let product = props.products[index]

  }
*/
  return (
      <div>
        <Row gutter={[16, 16]}> 
          <div style={{ textAlign: 'center'}}>
            <h2>추천 상품!<Icon type="rocket"/> </h2>
          </div>
          {renderCards}
        </Row>
        <p/>
        <br/><br/>
        
      </div>
  )
}

export default ShowSwiper
