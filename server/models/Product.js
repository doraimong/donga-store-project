const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {             //몇개가 팔렸는지
        Type: Number,
        default: 0
    },
    continents: {
        type: Number,
        default: 1
    },
    views: {            //조회수
        type: Number,
        default: 0
    }
}, { timestamps: true })    //등록시간 업데이트시간 관리

productSchema.index({   //검색된 단어가 DB의 어떤 항목에서 검색하면 좋겠는지
    title:'text',
    description:'text'
}, {
    weights:{
        title: 5,           //중요도를 title에 더 높게줌    docs.mongodb.com/manual/tutorial/control-results-of-text-search/
        description: 1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }