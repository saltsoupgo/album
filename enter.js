/**
 * Created by Administrator on 2019/7/4.
 */
var router=require('./album');
var express=require('express');
var app=express();
app.set('views','html');
app.set('view engine','ejs');
app.use(express.static(__dirname+'/file'));
app.use(express.static(__dirname+'/image'));
app.get('/index',(req,res)=>{
    router.showIndex(req,res);
})//主页
app.get('/index/menu/:name/del',(req,res)=>{
    router.showDelete(req,res);
})//删除相册
app.get('/index/menu/:name',(req,res)=>{
    router.showAlbum(req,res);
})//渲染相册列表
app.get('/index/:name',(req,res)=>{
    router.crea_upload(req,res);
})//页面跳转(创建和上传)
app.post('/index/upload/info',(req,res)=>{
    router.showPost(req,res);
})//上传图片
app.get('/index/create/info',(req,res)=>{
    router.showCreate(req,res);
})//添加相册
app.listen(80);