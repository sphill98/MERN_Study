const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs') 
const { MongoClient } = require('mongodb')

let db
const url = '' //당신은 제 DB에 접속할 수 없습니다 휴먼. 뭘 기대하신거죠?
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(3000, () => {
    console.log('http://localhost:3000 에서 서버 실행중') //8080에서 다른 거 하고 있어서 3000만큼 사랑해
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

app.get('/time', (요청, 응답) => {
  var time = new Date()
  응답.render('time.ejs', {newTime : time})
}) 

app.get('/write', (요청, 응답) => {
  응답.render('write.ejs')
}) 

app.post('/add', async (요청, 응답) => {
  console.log(요청.body)
  try {
    if (요청.body.title == '') {
      응답.send('제목 없음!')
    } else {
      await db.collection('collection').insertOne({title : 요청.body.title, content : 요청.body.content})
      //collection에 파일 하나 만들고 거기에 데이터를 입력한다
      응답.redirect('/list')
    }
  } catch(e) {
    console.log(e)//에러메시지 출력해줌
    응답.status(500).send('서버 에러!')
  }
}) 

app.get('/detail/:id', async (요청, 응답) => {
  //'detail/'뒤에 아무 문자나 입력하면 안에 있는 코드가 실행됨

  try {
    let result = await db.collection('collection').findOne({_id : new ObjectId(요청.params.id)})
  console.log(요청.params)
  응답.render('detail.ejs', {result : result}) 
  } catch(e){
    console.log(e)
    응답.status(404).send('url error')
  }
}) 

app.get('/edit/:id', async (요청, 응답) => {
  db.collection('collection').updateOne()

  let result = await db.collection('collection').findOne({_id : new ObjectId(요청.params.id)})
  console.log(요청.params)
  응답.render('edit.ejs', {result : result}) 
}) 
