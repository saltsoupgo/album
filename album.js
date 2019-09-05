/**
 * Created by Administrator on 2019/7/2.
 */
exports.showIndex=showIndex;
exports.showDelete=showDelete;
exports.showAlbum=showAlbum;
exports.crea_upload=crea_upload;
exports.showPost=showPost;
exports.showCreate=showCreate;
exports.deleteFolderRecursive=deleteFolderRecursive;
var express=require('express');
var app=express();
var fs=require('fs');
var ejs=require('ejs');
var url=require('url');
var path=require('path');
var querystring=require('querystring');
var formidable=require('formidable');
var silly_datetime=require('silly-datetime');
var events=require('events');
var emitter=new events.EventEmitter();
//主页
emitter.on('readalbum',(req,res,page)=>{
    readalbum(req,res,page)
})
function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
function readalbum(req,res,page) {
    fs.readdir('./image',(err,files)=>{
        var listarr=[];
        if(err){
            throw err;
        }else{
            for(var i=0;i<files.length;i++){
                var data=fs.statSync('./image/'+files[i]);
                if(data.isDirectory()){
                    listarr.push(files[i]);
                }
            }
            var files_album={
                sf:listarr
            }
            res.render(page,files_album);
            // fs.readFile('./html/index.ejs',(err,data)=>{
            //     if(err){
            //           throw err;
            //     }else{
            //           var template=data.toString();
            //           var html=ejs.render(template,files_album);
            //           res.end(html);
            //     }
            //   })
        }
    })
}
    function showIndex(req,res) {
         emitter.emit('readalbum',req,res,'index');
    }
//删除相册
    function showDelete(req,res) {
        var path=req.params.name;
        fs.readdir('./image/'+path,(err,data)=>{
            if(err){
                throw err;
            }else{
                deleteFolderRecursive('./image/'+path);
                res.redirect('/index')
            }
        })
    }
//渲染相册列表
function showAlbum(req,res) {
    var path=req.params.name;
    var menu={};
    fs.readdir('./image/'+path,(err,file)=>{
        if(err){
            throw err;
        }else{
            menu.pa=path;
            menu.sf=file;
            res.render('menu',menu);
            // fs.readFile('./html/menu.ejs',(err,data)=>{
            //     if(err){
            //         throw err;
            //     }else{
            //          var template=data.toString();
            //          var html=ejs.render(template,menu);
            //          res.end(html);
            //     }
            // })
        }
    })
}
//页面跳转(创建和上传)
function crea_upload(req,res) {
    var path=req.params.name;
    fs.readFile('./html/'+path,(err,data)=>{
        if(err){
            throw err;
        }else{
            if(req.url=='/index/upload.ejs'){
                emitter.emit('readalbum',req,res,'upload');
            }else{
                res.end(data);
            }
        }
    })
}
function showPost(req,res) {
    var form=new formidable.IncomingForm();
    form.uploadDir='./image/';
    form.parse(req,(err,fild,file)=>{
        if(err){
            throw err;
        }else{
            var oldpath=__dirname+'\\'+file.file.path;
            var extname=path.extname(file.file.name);
            var name=silly_datetime.format(new Date(),'YYYYMMDDHHmmss');
            var random=Math.floor(Math.random()*10000);
            var newpath=__dirname+'\\image'+'\\'+fild.upload+'\\'+name+random+extname;
            fs.rename(oldpath,newpath,(err)=>{
                if(err){
                    throw err;
                }else{
                    res.redirect('/index');
                }
            })
        }
    })
}
//添加相册
function showCreate(req,res) {
    var set=new Set();
    var urlparse=url.parse(req.url,true);
    var album_name=urlparse.query.name;
    set.add(album_name);
    if(set.has(album_name)){
        fs.mkdir('./image/'+album_name,(err)=>{
            if(err){
                res.send('相册已存在')
            }else{
                res.redirect('/index');
            }
        })
    }
}