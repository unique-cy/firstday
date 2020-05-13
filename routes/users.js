var express = require('express');
var router = express.Router();
var db=require('../modules/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.find('users',{},(data)=>{
    res.send(data)
  })
});

router.post('/', function(req, res, next) {
  db.find('users',{},(data)=>{
    let value=data.find(item => item.username==req.body.username)
    if(value){
      res.send("注册失败!用户名已经注册")
    }else{
      db.insert('users',{
        id:data.length+1,
        username:req.body.username,
        password:req.body.password
        },(data)=>{
        res.send(value)
      })
    }
  })
});


router.post('/insertUsers', function(req, res, next) {
  db.find('users',{},(data)=>{
    let value=data.find(item => item.username==req.body.username)
    if(value){
      res.send("注册失败!用户名已经注册")
    }else{
      let id=Number(req.body.id);
      let data={
        id:id,
        username:req.body.username,
        password:req.body.password
      }
      db.insert('users',data,(data)=>{
        res.send(value)
      })
    }
  });
});

router.post('/updateUsers', function(req, res, next) {
  let username=req.body.username
  db.find('users',{username},(data)=>{
    if(data.length!=0){
      res.send('0')
    }else{
      let id=Number(req.body.id);
      let data={
        id:id,
        username:req.body.username,
        password:req.body.password
      }
      db.update('users',{id},data,data=>{
        res.send('修改成功')
      })
    }
  })
});

router.post('/delUsers', function(req, res, next) {
  let id=Number(req.body.id);  
  db.delete('users',{id},data=>{
    if (data.result.n == 1 ) {
      res.send('删除成功')
    }  
  })
  db.find('users',{},data=>{
    function reUpdate(req,res,data) {
      let userArr = data.filter((item)=>{
        return item.id>id
      })
      if(userArr.length!=0){
        let json1={
          username:userArr[0].username
        }
        let json2={
          id:userArr[0].id-1
        }
        // 具体去修改
        db.update('users',json1,json2,result=>{
            console.log(result)
          if(result.result.n==0){
            console.log("删除失败")
          }else{
            data.shift();// 删除第一项
            reUpdate(req,res,data); // 再次执行函数
          }
        })
      }
    }
     reUpdate(req,res,data);
  })  
  
});

// 处理管理员删除后的  tokenId的递归函数
// req  请求对象
// res 响应对象
// data  处理的数据   [{}  {}  {} ]
// function reUpdate(req,res,data){
//     if(data.length==0){// 处理完成
//       res.send({success:"删除成功"})
//     }else{ // 处理  ==》 修改数据库
//       var selector =[
//         {userName:data[0].userName}, // 修改的条件
//         {
//           $inc:{ 
//             tokenId: -1 // 修改的内容
//           }
//         }
//       ];
//       // 具体去修改
//       handler("update","administors",selector,function(result){
//         if(result.result.n==0){
//           res.send({err:"删除失败"})
//         }else{
//              data.shift();// 删除第一项
//              reUpdate(req,res,data); // 再次执行函数
//         }
//       })
//     }
//   }
  
module.exports = router;
