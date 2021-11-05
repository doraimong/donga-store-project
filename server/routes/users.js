const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product")
const { Payment } = require("../models/Payment")
const { auth } = require("../middleware/auth");
const async = require('async');
let nodemailer = require('nodemailer');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,            //상세보기 페이지에서 카트에 물건넣기버튼 누르면 리덕스 스토어에 저장되어있는데 -> 페이지를 이동하면 스토어에서 없어져버린다 -> auth.js에서 매 패이지 이동시 동작을 하는데(인증관련) 옳바른 사람이면 이부분을 한번더 거친다 -> 그때 여기에서 카트정보 갱신을 안해주면 정보유지가 안됨 모르면 강의봐
        history: req.user.history       //결제 내역 
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    
    //먼저 User Collection에 해당 유저의 한명의 정보를 가져오기
    User.findOne({ _id: req.user._id },     //auth 미들웨어에서 쿠키속에 토큰을 이용해 유저의 정보를 가져온다.
        (err, userInfo) => {                //userInfo에는 User스키마속 정보가 들어있다.(+카트정보)
                                            // 가져온 정보에서 카트에다 넣으려하는 상품이 있는지 확인
            let duplicate = false;
            userInfo.cart.forEach((item) => {           //item 은 User 스키마속 cart 속 하나하나의 상품
                console.log("test");
                if(item.id === req.body.productId) {     //req.body.productId는 현재 장바구니에 넣으려는 상품
                    duplicate = true;
                }        
            })
            
            //상품이 있는 경우 quantity 만 올린다. 
            if(duplicate){
                User.findOneAndUpdate(
                    { _id: req.user._id, "cart.id": req.body.productId },   //사람 찾고 / 사람의 카트정보 내 해당상품 찾아 cart.id에 "" 해도 안해도 상관없대
                    { $inc: { "cart.$.quantity": 1 }},                      // inc : increament 특정 파트에 1증가            
                    { new: true },                                          //해줌으로써 쿼리문으로 업데이트된 결과 err, userInfo 정보를 받는다.
                    (err, userInfo) => {
                        if(err) return res.status(200).json({success: false, err})
                        res.status(200).send(userInfo.cart)                 //  카트 데이터를 보내주면 -> user_action.js에서 request타고 user_reducer.js의 ADD_TO_CART에서 만들어준다.
                    }
                )
            } else {                                                        //상품이 없는 경우 신규 카트에 추가
                User.findOneAndUpdate(
                    { _id: req.user._id },                                  //유저검색
                    {
                        $push: {                                            //카트에 담길 물건 정보 
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                date: Date.now()
                            }
                        }
                    },
                    { new: true },                                          //업데이트 된 정보를 받기위해
                    (err, userInfo) => {
                        if(err) return res.status(400).json({success: false, err})
                        res.status(200).send(userInfo.cart)
                    }
                ) 
            }
        })
});

router.get('/removeFromCart', auth, (req,res) => {
    //먼저 cart안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        {_id: req.user._id}, //req.user._id는 auth 미들웨어로 부터 비롯됨
        {
            "$pull":
            { "cart": { "id": req.query.id }}   //카트에서 삭제할 물건 id로 삭제
        },
        { new: true},
        (err, userInfo) => {    //userInfo는 카트의 선택된 상품이 삭제된 후의 DB의 user정보를 갖고있다.
            let cart = userInfo.cart;
            let array = cart.map(item => {  //남은 카트의 정보들을 모아줌(이전상태 : array = '1', '2'  ==>> array=['1','2'] 형식으로 변경)
                return item.id
            })

            Product.find({ _id: { $in: array } })   //array에 든 id 의 상품정보를 product 스키마 정보를 들고있다.
            .populate('writer') // writer의 정보를 가져와
            .exec((err, productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart                                        
                })
            })


        }
    )

})

router.post('/successBuy', auth, (req,res) => {
    //1. User Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //2. Payment Collection 안에 자세한 결제 정보들 넣어주기
    transactionData.user = {
        id: req.user._id,
        name:req.user.name,
        email: req.user.email   //req.user.~ 는 이 함수 시작줄은 auth에서 비롯된거
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history

    User.findOneAndUpdate(
        { _id: req.user._id},
        { $push: { history: history}, $set: { cart: [] } }, //$set : 변화하는 정보 -> 카트 정보 지우기
        { new: true},
        (err, user) => {    //업데이트된 정보 => user
            if (err) return res.json({success: false, err })

            //payment에다가 transactionData 정보 저장
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {    //doc : 안에 넣은 정보
                if(err) return res.json({success: false, err})

                //3. Product Collection 안에 sold 필드 정보 업데이트 시켜주기

                //상품 당 몇개의 quantity를 샀는지
                let products = [] ;
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                async.eachSeries(products, (item, callback) => {    //products: 여러개의 상품정보 담고있다 / item은 각각을 다룬다.
                    
                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },  //true는 업데이트된 다큐먼트들을 프론트에 보내야하니까 하지만 이번엔 안보내도 되니까 false
                            callback
                    )
                }, (err) => {
                    if(err) return res.status(400).json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []  //결제 성공후 카트 비워준다
                    })
                }
                )
            })
        }
    )
})

router.post('/sendEmail', (req, res) => {
    console.log(req.body.Email)
    let targetEmail = req.body.Email
    let transporter = nodemailer.createTransport({
        service: 'gmail'              //사용하고자 하는 서비스
        , prot: 587
        , host: 'smtp.gmlail.com'
        , secure: false
        , requireTLS: true
        , auth: {
            user: 'dstore1139@gmail.com'           //gmail주소입력
            , pass: 'testing1139'                 //gmail패스워드 입력
        }
    });

    let randNum = Math.random();
    randNum= parseInt(randNum*10000)

    let info = transporter.sendMail({   
        from: '동아장터',             //보내는 주소 입력
        to: targetEmail,                        //위에서 선언해준 받는사람 이메일
        subject: '안녕하세요 동아장터 인증메일입니다3',                  //메일 제목
        text: '인증번호는 '+randNum +" 입니다.",                       //내용
    });

    
    console.log("전송", randNum)
    return res.status(200).json({randNum})
    
})
module.exports = router;
