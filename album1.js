/**
 * Created by Administrator on 2019/7/2.
 */
exports.showIndex=showIndex;
exports.showDelete=showDelete;
exports.del=del;
exports.showAlbum=showAlbum;
exports.crea_upload=crea_upload;
exports.upload=upload;
exports.showPost=showPost;
exports.showCreate=showCreate;
var express=require('express');
var app=express();
var fs=require('fs');
var ejs=require('ejs');
var url=require('url');
var path=require('path');
var querystring=require('querystring');
var formidable=require('formidable');
var silly_datetime=require('silly-datetime');
//主页
    function showIndex(req,res) {
        fs.readdir('./image',(err,files)=>{
            if(err){
                throw err;
            }else{
                var files_album={
                    sf:files
                }
                res.render('index',files_album);
            }
        })
    }
//删除相册
    function showDelete(req,res) {
        var path=req.params.name;
        fs.readdir('./image/'+path,(err,data)=>{
            if(err){
                throw err;
            }else{
                del(data,res,path);
            }
        })
    }
//删除相册内文件
   function del(data,res,path) {
      if(data.length===0){
        fs.rmdir('./image/'+path,(err)=>{
            if(err){
                throw err;
            }else{
                res.redirect('/index')
            }
        })
    }else{
        for(var i=0;i<data.length;i++){
            fs.unlink('./image/'+path+'//'+data[i],(err)=>{
                if(err){
                     throw err;
                }
            })
        }
        fs.rmdir('./image/'+path,(err)=>{
            if(err){
                throw err;
            }else{
                res.redirect('/index')
            }
        })
    }
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
                upload(req,res);
            }else{
                res.end(data);
            }
        }
    })
}
//上传相册目录渲染
function upload(req,res){
    var files_upload={}
    fs.readdir('./image',(err,files)=>{
       if(err){
            throw err;
        }else{
          files_upload.sf=files;
          res.render('upload',files_upload);
           // fs.readFile('./html/upload.ejs',(err,data)=>{
           //      if(err){
           //         throw err;
           //     }else{
           //         var template=data.toString();
           //         var html=ejs.render(template,files_upload);
           //         res.end(html);
           //     }
           // })
       }
      })
}
//上传图片
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