const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {     //어디에 파일이 저장되는지 
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })

  var upload = multer({storage: storage}).single("file")

router.post('/image', (req, res)=>{ // router의 /api/porduct를 타고 여기 /image를 탄다. 결과적인 주소 /api/product/image
    //가져온 이미지 저장
    upload(req, res, err => {
        if(err){
            return req.json({ success: false, err})
        }
        console.log(res.req.file.path)
        return res.json({ success: true, filePath: res.req.file.path , fileName: res.req.file.filename})    // 4줄위 upload 의 인자 res에서 비롯된 res.req.file.path 파일명도 동일 
    })
})   

router.post('/', (req, res)=>{ // router의 /api/porduct를 타고 여기로 온다. 결과적인 주소 /api/product
  
  const product = new Product(req.body) //UploadProductPage.js의 body 정보를 DB에 저장
  product.save((err) => {
    if(err) return res.status(400).json({success: false, err})
    return res.status(200).json({success: true})
  })

})   

router.post('/products', (req, res)=>{ // router의 /api/porduct를 타고 여기로 온다. 결과적인 주소 /api/product
  //product DB에 들어있는 모든 상품 정보 가져옴

  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm

  let findArgs = {};

  for(let key in req.body.filters){ //key는 continents또는 price / req.body.filters는 landingpage.js의 filter state
    if(req.body.filters[key].length > 0){ //ex> req.body.filters["price"]
      if(key === "price"){
          findArgs[key] = {
            $gte: req.body.filters[key][0], //greater than equal : mongodb에서 사용 가격 이상 미만을 적용하기 위함
            $lte: req.body.filters[key][1]
          }
      } else {
          findArgs[key] = req.body.filters[key];
      }
      
    }
  }

  console.log('findArgs', findArgs)

  if(term){
    Product.find(findArgs)
        .find({ $text: { $search: term} })  //mongo db 기능 - DB내 검색
        .populate("writer") // id뿐 아니라 유저의 이름 등의 모든 정보를 가져온다.
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => { //productInfo에 모든 정보있다.
          //console.log("포스트 사이즈1",productInfo.length)
          if(err) return res.status(400).json({success: false, err})
          return res.status(200).json({
            success: true, productInfo, 
            postSize :productInfo.length
          })
        })

  } else {
      Product.find(findArgs)
        .populate("writer") // id뿐 아니라 유저의 이름 등의 모든 정보를 가져온다.
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => { //productInfo에 모든 정보있다.
          //console.log("포스트 사이즈2",productInfo.length)
          if(err) return res.status(400).json({success: false, err})
          return res.status(200).json({
            success: true, productInfo, 
            postSize :productInfo.length
          })
        })

  }
})

//한개의 상품 정보 가져올떄 DetailProductPage.js
router.get('/products_by_id', (req, res)=>{ // router의 /api/porduct를 타고 여기로 온다. 결과적인 주소 /api/product
  
  let type = req.query.type //링크를 쿼리형태로 이용 주의!
  let productIds = req.query.id

  //productIds를 이용해서 DB에서 productIds와 같은 상품의 정보를 가져온다.
  //배열이면 여러개의 id가 들어오는데 이것을(id = 12, 165, 1561) productIds = ['12', '165', '1561']과 같은 구조로 만들고있다.
  if(type === "array") {
    let ids = req.query.id.split(',')
    productIds = ids.map(item => {
      return item
    })
  }

  Product.find({ _id: { $in: productIds } }) //약 6줄 위 배열로 만든 구조를 이용해서 검색
        .populate('writer')         //writer의 모든 정보 가져오기 
        .exec((err, product) => {   //쿼리를 돌려준다.                            =>!!!!!!!!!!잘몰라
          if(err) return res.status(400).send(err)
          return res.status(200).send(product)
        })

})  

module.exports = router;
