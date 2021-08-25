require('dotenv').config()
const db = require("./db");
const express = require('express');
const morgan = require('morgan');
const app = express();


// app.use((req,res,next)=>{
//     console.log("I am in middleware");
//     next();
// });

// app.use((req,res,next)=>{
//     console.log("I am in 2nd midd");
//     res.status(404).json({
//         status:"fail"
//     });
// });

//3rd party middleware --> morgam
// app.use(morgan('short'));

//retrieve data from body---> post method
app.use(express.json());

app.get('/about',async(req,res)=>{
    try {
        const result = await db.query("SELECT * FROM restaurants");
        //console.log(result);
        console.log(result.rows);
        res.status(200).json({
            "status":"success",
            count: result.rows.length,
            data:{
                "restaurant":result.rows,
            }
        });
    } catch (err) {
        console.log(err);
    }
});

app.get('/about/:id',async(req,res)=>{
    // console.log(req.params);  ---> it will return object of id which we enter into the header
    try {
        //const result = await db.query("SELECT * FROM restaurants where id = "+req.params.id);
        const result = await db.query("SELECT * FROM restaurants where id = $1",[req.params.id]);
        //console.log(result);
        console.log(result.rows);
        res.status(200).json({
            "status":"success",
            count: result.rows.length,
            data:{
                "restaurant":result.rows,
            }
        });
    } catch (err) {
        console.log(err);
    }
});

app.post('/about',async(req,res)=>{
    // if we dont use express.json middleware and body don't works
    // console.log(req.body);
    try {
        const result = await db.query("INSERT INTO restaurants (id,name,location,price_range) VALUES ($1,$2,$3,$4)",[req.body.id,req.body.name,req.body.location,req.body.price_range]);
        res.status(200).json({
            status:"success",
            values:"Inserted"
        });
    } catch (error) {
        console.log(error);
    }
});

//update
app.put('/about/:id',async(req,res)=>{
    // console.log(req.params.id);
    // console.log(req.body);
    try {
        const result = await db.query("UPDATE restaurants SET name=$1,location=$2,price_range=$3 where id=$4",[req.body.name,req.body.location,req.body.price_range,req.body.id]);
        res.status(300).json({
            status:"Updated"
        });
    } catch (error) {
        console.log(error);
    }
});

//delete
app.delete('/about/:id',async(req,res)=>{
    try {
        const result = await db.query("DELETE FROM restaurants where id = $1",[req.params.id]);
        res.status(205).json({
            status:"Deleted"
        });
    } catch (error) {
        console.log(error);
    }


});

app.listen(process.env.PORT,()=>{
    console.log("Server is running in "+process.env.PORT);
});