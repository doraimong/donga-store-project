const continents = [
    {
        "_id": 1,
        "name": "도서"
    },
    {
        "_id": 2,
        "name": "전자제품"
    },
    {
        "_id": 3,
        "name": "의류"
    },
    {
        "_id": 4,
        "name": "뷰티"
    },
    {
        "_id": 5,
        "name": "생활용품"
    },
    {
        "_id": 6,
        "name": "스포츠/레저"
    },
    {
        "_id": 7,
        "name": "반려동물"
    } 
]

const price = [
    {
        "_id": 0,
        "name": "all",
        "array": []
    },
    {
        "_id": 1,
        "name": "0 ~ 4999",
        "array": [0, 4999]
    },
    {
        "_id": 2,
        "name": "4999 ~ 9999원",
        "array": [4999, 9999]
    },
    {
        "_id": 3,
        "name": "9999 ~ 49999원",
        "array": [9999, 49999]
    },
    {
        "_id": 4,
        "name": "49999 ~ 99999원",
        "array": [49999, 99999]
    },
    {
        "_id": 5,
        "name": "10만원 이상",
        "array": [100000, 10000000000]
    },

]

export {
    continents,
    price
}