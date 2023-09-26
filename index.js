const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://zafir5370:zafir5370@cluster0.k6lwsfn.mongodb.net/APP?retryWrites=true&w=majority');

mongoose.connection.on("connected", (connected) => {
  console.log("connected with database.....");
});
//user routes 

const user_route = require('./routes/userRoute');
app.use('/api', user_route);

app.get('/getapi', (req, res) => {
  res.send('server is runnimng at render');

});
//store route 
const store_route = require("./routes/storerRoute");
app.use("/api", store_route);


app.listen(3000, function () {
  console.log("Server is running");
})