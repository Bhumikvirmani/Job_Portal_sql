import express from "express";
import userRoute from "./routes/user.route.js";
// import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import comapnyRoute from "./routes/company.route.js";

const app = express();
app.use(express.json());

app.use('/user',userRoute);
app.use('/application',applicationRoute);
app.use('/company',comapnyRoute);


app.listen(5000,()=>{
    console.log(`Server running at port 5000`);
})