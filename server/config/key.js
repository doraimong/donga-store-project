if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); //로컬에서 작업하고있는지 로컬이라면 dev.js 로 
} else {
    module.exports = require('./dev');  //프로덕션 모드로 작업하고있는지 분기 만약 프로덕션 모드라면 동일 폴더내 prod.js내의 변수를 읽게된다.
}