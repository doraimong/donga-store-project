import React from 'react'
import "./UserCardBlock.css"
function UserCardBlock(props) {

    const renderCartImage = (images) => {       //다중 이미지 첫번째만 사용
        if(images.length > 0){
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                <td>
                    <img style={{ width: '70px' }} alt="product"
                    src={renderCartImage(product.images)} />    {/* renderCartImage(product.images) 이유는 한개의 이미지만 넣기위해 함수로 처리해줌 */}
                </td>
                <td>
                    {product.quantity} 개
                </td>
                <td>
                    {product.price} 원
                </td>
                <td>
                    <button onClick={() => props.removeItem(product._id)}>
                        삭제
                    </button>
                </td>
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>상품 사진</th>
                        <th>상품 수량</th>
                        <th>상품 가격</th>
                        <th>카트에서 삭제</th>
                    </tr>
                </thead>
                
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
