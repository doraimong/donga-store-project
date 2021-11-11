import React from 'react'

/*
[대전제 : 카트에 없는 상품을 추천한다.]

-카트의 물건 흐름 -> 카트 물건의 카테고리를 추출 최다 항목카테고리의 상품(카트에 없는) 을 추천 
                -> 최다 항목을 추출할 수 없다(전자 = 도서의 경우) 는 추천 안하거나 보류 !

- 리덕스에 추천할 물건 정보 넣어서 다양한 페이지에서 사용가능하게하기 vs props로 쉽게 받아서 하기 landingpage에만 추천받기 -> 후자를 하고 후자 성공시 전자 시도 ㄱㄱ!!
*/
function Recommendation() {
    return (
        <div>
            이런 상품 강추!!
            
        </div>
    )
}

export default Recommendation
