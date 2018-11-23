/* eslint-disable */
var express = require('express')
var app = express()
var https = require('https')
// 引入cors
var cors = require('cors');
app.use(cors())

const appID = 'wx6ba8da52cc23c927'
const appSecret = 'c11fd7eca16a1c690fb8f436093182c1'

// 授权域名
let host = `http://127.0.0.1:3000`
// 授权后重定向url地址
let redirectUrl = encodeURIComponent(`${host}/get_userinfo`)
// 微信授权api,接口返回code,点击授权后跳转到重定向地址并带上code参数
let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=` +
    `${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`

// 测试静默授权 用户是否关注过公众号
app.get('/test', async function (req, res) {
    const code = req.query.code
    if(code){
        // code存在 跳转前端页面
        const result = await getAccessToken(code)
        const {  openid } = result
        // 获取公众号的access_token，此access_token不是用户授权后的access_token
        const get_token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`
        https.get(get_token_url, (res) =>{
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                const { access_token } = JSON.parse(data);
                // console.log(`data=${data}`);
                // console.log(`access_token=${access_token}`);
                // 判断用户是否关注公众号
                const get_subscribe_url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}`;
                https.get(get_subscribe_url,r=>{
                    let ret = ''
                    r.on('data', (chunk) => {
                        ret += chunk
                    })
                    r.on('end', ()=>{
                        console.log(`关注信息${ret}`);
                    })
                })
            })
        }).on('error', (err) => {
            console.log(err)
        })
    }else{
        // 进行微信授权
        let callbackUrl = 'http://127.0.0.1:3000/test'
        let getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=` +
        `${callbackUrl}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        res.writeHead(302, {
            'Location': getCodeUrl
        });
        res.end();
    }


})

app.get('/get_wxauth', function (req, res) {
    res.json({
        status: 200,
        url: authorizeUrl
    })
})
app.get('/get_userinfo', function (req, res) {
    wxLogin(req, res)
})

async function wxLogin(req, res) {
    console.log(req.query)
    // 解析querystring获取URL中的code值
    const code = req.query.code
    // 通过拿到的code和appID、appSerect获取返回信息
    const result = await getAccessToken(code)
    // 解析得到access_token和open_id
    const { access_token, openid } = result
    // 通过上一步获取的access_token和open_id获取userInfo即用户信息
    let userInfo = await getUserInfo(access_token, openid)
    console.log(openid)
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
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                let resObj = JSON.parse(data)
                resolve(resObj)
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
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                let userInfo = JSON.parse(data)
                resolve(userInfo)
            })
        }).on('error', (err) => {
            reject(err)
        })
    })
}

app.listen(3000, () => console.log('CORS-enabled web server listening is running at http://localhost:3000'))
