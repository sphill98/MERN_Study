const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs') 
const { MongoClient } = require('mongodb')

let db
const url = '' //
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(3000, () => {
    console.log('http://localhost:3000 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})

app.get('/', (요청, 응답) => {
  응답.send('반갑다')
}) 

app.get('/news', (요청, 응답) => {
    db.collection('post').insertOne({title : '어쩌구'})
    // 응답.send('오늘의 뉴스') // send 안에는 html 넣어도 됨.
}) 

app.get('/shop', function(요청, 응답) { // 콜백함수... 차례차례 진행할 때
    응답.send('shopping page')
}) 

app.get('/html_ex', function(요청, 응답) { // 콜백함수... 차례차례 진행할 때
    응답.sendFile(__dirname + '/index.html')
}) 

app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray()
  // 응답.send(result[0].title)
  응답.render('list.ejs', { 글목록 : result })
})
