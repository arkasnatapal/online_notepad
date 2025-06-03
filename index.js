const express=require('express');
const app = express();
const port =process.env.PORT || 3000;
const path = require('path');
const fs=require('fs');
let c=1;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
   res.render("index",{files:files});
    })
})
app.post('/create',(req,res)=>{   // post -> brings the request from the user to server usually used in forms and login pages
    if(req.body.details==''){
      res.render("caution");
    }
    else if(req.body.title==''){
        fs.writeFile(`./files/Untitled ${c}.txt`,req.body.details,(err)=>{
        if(err) console.log(err);
        else res.redirect('/');
        })
        c++;
    }
    else{
        fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,(err)=>{
        if(err) console.log(err);
        else res.redirect('/');
    })
}
})
app.get('/edit/:filename',(req,res)=>{
    res.render("edit",{filename:req.params.filename});
})

app.get('/files/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{
        res.render("show",{filename:req.params.filename, filedata:filedata})
    })
})

app.post('/edit',(req,res)=>{
    fs.rename(`./files/${req.body.old}`,`./files/${req.body.new}.txt`,(err)=>{
        res.redirect('/');
    })
})

app.listen(port,()=>{
    console.log(`Server open in port ${port}`);
})