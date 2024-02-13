import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app=express();
const port= 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/",async(req,res)=>{
    try{
        const response=await axios.get("https://v2.jokeapi.dev/joke/Any");
        res.render("index.ejs",{setup: response.data.setup, delivery: response.data.delivery});
    }catch(error){
        console.log("Internal Server Error");
        res.status(500);
    }
});

app.post("/getjoke",async(req,res)=>{
    var amount=req.body.amount;
    var langcode=req.body.language;
    var type= req.body.type;
    var category= req.body.category;
    try{
        const result= await axios.get("https://v2.jokeapi.dev/joke/"+category+"?amount="+amount+"&lang="+langcode+"&type="+type);
        var jokegen=[];
        if(result.data.error===true){
            jokegen[0]="No matching joke found";
            res.render("index.ejs",{jokeres:jokegen});
        }
        else{
        if(amount>1){
            var jokearray=result.data.jokes;
            if(type==="twopart"){
            for(var i=0;i<jokearray.length;i++){
               jokegen[i]=jokearray[i].setup+jokearray[i].delivery;
            }
            }
            else{
                for(var i=0;i<jokearray.length;i++){
                    jokegen[i]=jokearray[i].joke;
                }
            }
            res.render("index.ejs",{jokeres:jokegen});
        }
        else{
        if(result.data.type==="twopart"){
            jokegen[0]=result.data.setup+" "+result.data.delivery;
        }
        else{
            jokegen[0]=result.data.joke;
        }
        res.render("index.ejs",{jokeres:jokegen});
        } 
    }
    }catch(error){
        console.log(error);
        res.status(500);
    }
    
});
app.listen(port,()=>{
    console.log(`Listening to the port ${port}`);
});