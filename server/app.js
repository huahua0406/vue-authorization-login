/* eslint-disable */
var express = require('express')
var app = express()
var https = require('https')
// 引入cors 解决跨域
var cors = require('cors');
app.use(cors())

const appID = 'wx6ba8da52cc23c927'
const appSecret = 'c11fd7eca16a1c690fb8f436093182c1'

// 授权回调域名
let host = `http://127.0.0.1:3000`
// 授权后重定向url地址
let redirectUrl = encodeURIComponent(`${host}/wechat_login`)
// 微信授权url地址,点击授权后跳转到重定向地址并带上code参数
let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=` +
    `${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`

// 前端请求该接口返回微信授权的地址
app.get('/get_wxauth', function (req, res) {
    res.json({
        status: 200,
        url: authorizeUrl
    })
})

// 微信授权回调的接口
app.get('/wechat_login', function (req, res) {
    wxLogin(req, res)
})

async function wxLogin(req, res) {
    // 解析querystring获取URL中的code值
    const code = req.query.code
    // 通过拿到的code和appID、appSerect获取返回信息
    const result = await getAccessToken(code)
    // 解析得到access_token和openid
    const { access_token, openid } = result
    // 通过上一步获取的access_token和open_id获取userInfo即用户信息
    let userInfo = await getUserInfo(access_token, openid)
    console.log(userInfo)
    const token = openid
    const msg = 200
    const redirectUrl = `http://127.0.0.1:8080/author?token=${token}&msg=${msg}`
    res.writeHead(302, {
        'Location': redirectUrl
    });
    res.end();
}

// 通过拿到的code和appID、app_serect获取access_token和open_id
function getAccessToken(code) {
    return new Promise((resolve, reject) => {
        const getAccessUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appID}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
        https.get(getAccessUrl, (res) => {
            res.setEncoding('utf8'); // 设置编码为 utf8
            let rawData = ''; // 原始数据
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                let result = JSON.parse(rawData)
                resolve(result)
            })
        }).on('error', (err) => {
            reject(err)
        })
    })
}

// 通过上一步获取的access_token和open_id获取userInfo即用户信息
function getUserInfo(access_token, openid) {
    return new Promise((resolve, reject) => {
        const getUserUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
        https.get(getUserUrl, (res) => {
            let rawData = ''
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                let userInfo = JSON.parse(rawData)
                resolve(userInfo)
            })
        }).on('error', (err) => {
            reject(err)
        })
    })
}

// 获取基础token，注意：获取公众号的access_token，此access_token不是用户授权后的access_token
// 文档：
function getToken(appid,appsecret){
    return new Promise((resolve, reject) => {
        // 获取公众号的access_token，此access_token不是用户授权后的access_token
        const get_token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`
        https.get(get_token_url, (res) => {
            res.setEncoding('utf8'); // 设置编码为 utf8
            let rawData = ''; // 原始数据
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                let jsonData = JSON.parse(rawData)
                resolve(jsonData)
            })
        }).on('error', (err) => {
            reject(err)
        })
    })
}
// 获取用户是否关注该公众号
function getSubscribeMsg(access_token,openid){
    return new Promise((resolve, reject) => {
        // todo:
        // 文档：
        const get_subscribe_url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}`;
        https.get(get_subscribe_url, (res) => {
            res.setEncoding('utf8'); // 设置编码为 utf8
            let rawData = ''; // 原始数据
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                let jsonData = JSON.parse(rawData)
                resolve(jsonData)
            })
        }).on('error', (err) => {
            reject(err)
        })
    })
}

// 测试 静默授权下用户是否关注过公众号
app.get('/test', async function (req, res) {
    const code = req.query.code
    if(code){
        // code存在 直接验证
        const result = await getAccessToken(code)
        const {  openid } = result
        // 获取公众号的access_token，此access_token不是用户授权后的access_token
        const retToken = await getToken(appID,appSecret)
        const { access_token } = retToken
        const subscribeInfo = await getSubscribeMsg(access_token,openid)
        console.log(subscribeInfo)
    }else{
        // 进行微信授权
        let callbackUrl = encodeURIComponent('http://127.0.0.1:3000/test')
        let getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=` +
        `${callbackUrl}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        res.redirect(getCodeUrl);
    }
})


app.listen(3000, () => console.log('server listening is running at http://localhost:3000'))
