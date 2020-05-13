var express = require('express');
var router = express.Router();
var db=require('../modules/db')
var multer = require('multer')
var fs =require('fs')
var formidable = require('formidable');
var multiparty=require('multiparty')

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.find("detail",{},data=>{
    res.json(data)
  })
});

router.post('/', function(req, res, next) {
  let id=Number(req.body.id)
  db.find("detail",{id},data=>{
    res.json(data)
  })
});

router.post('/addProduct', function(req, res, next) {
  let form=new multiparty.Form();
    //设置文件上传存放地址
    form.uploadDir = "uploads";
    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function(err, fields, files) {
        console.log(files.file) 
        console.log(files.img) 
        console.log(fields) 
        let oldPath=files.img[0].path;
        let newPath='uploads/'+files.img[0].originalFilename;
        fs.rename(oldPath,newPath,err=>{
            if(!err)console.log('上传成功');
        })

        let lunboArr=files.file;
        let bannerimg=[]
        for(let i=0;i<lunboArr.length;i++){
            let arr='details/'+lunboArr[i].originalFilename;
            let oldPath=lunboArr[i].path;
            let newPath='uploads/details/'+lunboArr[i].originalFilename;
            fs.rename(oldPath,newPath,err=>{
                if(!err)console.log('上传成功');
            })
            bannerimg.push(arr);
        }
        db.find("detail",{},data=>{
            let id=data.length+1
            let img =files.img[0].originalFilename;
            let name=fields.name[0]
            let Science=fields.Science[0]
            let ScienceAll=fields.ScienceAll[0]
            let flowerLanguage=fields.flowerLanguage[0]
            let promo=fields.promo[0]
            let newPrice=fields.newPrice[0]
            let oldPrice=fields.oldPrice[0]
            let num=fields.num[0]
            let thisNum=fields.thisNum[0]
            let reduceFlag=fields.reduceFlag[0]
            let dataitem=fields.dataitem[0]
            let json={id,img,name,Science,ScienceAll,flowerLanguage,promo,newPrice,oldPrice,num,thisNum,reduceFlag,dataitem,bannerimg}
              db.insert('detail',json,data=>{
                if(data.result.n==1){
                    console.log("--------上传图片成功---------");
                }
             })
            res.send('ll')
        })
    })
});

router.post('/updateProduct',function (req,res,next) {
  let form=new multiparty.Form();
  //设置文件上传存放地址
  form.uploadDir = "uploads";
  //执行里面的回调函数的时候，表单已经全部接收完毕了。
  form.parse(req, function(err, fields, files) {
    console.log(files.file) 
    console.log(files.img) 
    console.log(fields)
    let oldPath=files.img[0].path;
    let newPath='uploads/'+files.img[0].originalFilename;
    fs.rename(oldPath,newPath,err=>{
        if(!err)console.log('上传成功');
    })

    let lunboArr=files.file;
    let bannerimg=[]
    for(let i=0;i<lunboArr.length;i++){
      let arr='details/'+lunboArr[i].originalFilename;
      let oldPath=lunboArr[i].path;
      let newPath='uploads/details/'+lunboArr[i].originalFilename;
      fs.rename(oldPath,newPath,err=>{
          if(!err)console.log('上传成功');
      })
      bannerimg.push(arr);
    }
    let id=Number(fields.id[0])
    let img =files.img[0].originalFilename;
    let name=fields.name[0]
    let Science=fields.Science[0]
    let ScienceAll=fields.ScienceAll[0]
    let flowerLanguage=fields.flowerLanguage[0]
    let promo=fields.promo[0]
    let newPrice=fields.newPrice[0]
    let oldPrice=fields.oldPrice[0]
    let num=fields.num[0]
    let thisNum=fields.thisNum[0]
    let reduceFlag=fields.reduceFlag[0]
    let dataitem=fields.dataitem[0]
    let json={id,img,name,Science,ScienceAll,flowerLanguage,promo,newPrice,oldPrice,num,thisNum,reduceFlag,dataitem,bannerimg}
      db.update('detail',{"id":id},json,data=>{
        if(data.result.n==1){
            console.log("--------修改图片成功---------");
        }
      })
    res.send('ll')
  })
})

router.post('/deleteProduct',function(req,res,next){
    let id=Number(req.body.id)
    db.find('detail',{id},data=>{
      let img=data[0].img;
      fs.unlink('uploads/'+img,(err)=>{
        if (!err) {
            console.log('-------------老图片缓存删除成功！--------------');
        }
      });
      let bannerimg=data[0].bannerimg
        for (let i = 0; i < bannerimg.length; i++) {
          fs.unlink('uploads/'+bannerimg[i],(err)=>{
            if (!err) {
              console.log('-------------老图片缓存删除成功！--------------');
             }
          })       
        }
        db.delete('detail',{id},data=>{
          if (data.result.n == 1 ) {
              console.log('-------------删除广告成功！--------------');
          }  
       })
       db.find('detail',{},data=>{
        function reUpdate(req,res,data) {
          let userArr = data.filter((item)=>{
            return item.id>id
          })
          if(userArr.length!=0){
            let json1={
              name:userArr[0].name
            }
            let json2={
              id:userArr[0].id-1
            }
            // 具体去修改
            db.update('detail',json1,json2,result=>{
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
    })
    res.send('11')
})

module.exports = router;
