import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express();
const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"M200429h",
    port:5432,
});

db.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


var quiz=[];

db.query("select * from capitals",(err,res)=>{
    if(err){
        console.log("Error occured");
    }else{
        quiz=res.rows;
    }
    db.end();
});

var totalscore=0;
let randomCountry={};
let iscorrect='false';
async function nextQuestion(){
    var questionCountry=quiz[Math.floor(Math.random()*quiz.length)];
    randomCountry=questionCountry;
}


app.get('/',async (req,res)=>{

   await nextQuestion();
    res.render('index.ejs',{
       currentQuestion:randomCountry
    });
})

app.post('/submit',async(req,res)=>{
    var ans=req.body.answer.trim();
    
   if(randomCountry.capital.toLowerCase()==ans.toLowerCase()){
   totalscore++;
   iscorrect='true';
   }
   await nextQuestion();
    res.render('index.ejs',{
        currentQuestion:randomCountry,
        totalScore:totalscore,
        wasCorrect:iscorrect
    })
})

app.listen(3000,()=>{
    console.log("Server is running in port 3000");
});