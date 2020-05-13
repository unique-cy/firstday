var express = require('express');
var router = express.Router();
var db=require('../modules/db')
var fs =require('fs')
var formidable = require('formidable');
var multiparty=require('multiparty')

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.find("detail",{},data=>{
    res.json(data)
  })
});

router.post('/updateOrder', function(req, res, next) {
  let id=Number(req.body.id);
    let data={
      id:id,
      name: req.body.name,
      newPrice: req.body.newPrice,
      num: req.body.num,
      thisNum: req.body.thisNum
    }
    db.update('detail',{id},data,data=>{
      res.send('修改成功')
    })
});



module.exports = router