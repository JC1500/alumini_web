import express from 'express';

const app=express();

app.use(express.json({ limit: "1mb" }));

app.get("/health",(req,res)=>{
    return res.status(200).json({
        status:"Ok",
        service:"Alumini Chat Server",
    })
})

export default app;


