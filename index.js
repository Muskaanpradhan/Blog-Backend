import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect("mongodb+srv://muskanpradhan7feb:7febMeera@cluster0.tyqgw9n.mongodb.net/firstDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() =>
    app.listen(port, () => console.log("Server started at port " + port))
  );

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const messageModel = mongoose.model("message", messageSchema, "messages");

app.post("/saveData", (req, res) => {
  const dataToSave = new messageModel(req.body);
  dataToSave.save().then(() => res.json("Data Submitted"));
});

app.get("/showData", async (req, res) => {
  const savedData = await messageModel.find();
  if (savedData) res.json(savedData);
});

app.delete("/deleteData", async (req, res) => {
  const deletedData = await messageModel.findByIdAndDelete(req.body.idToDelete);
  if (deletedData._id) res.json("Data Deleted");
});

app.get("/getDataById/:idToEdit", async (req, res) => {
  // console.log(req.params);
  const dataToUpdate = await messageModel.findById(req.params.idToEdit);
  if (dataToUpdate._id) res.json(dataToUpdate);
});



app.put("/updateData", async (req, res) => {
  const { name, email, message, id } = req.body;
  const updatedData = await messageModel.findByIdAndUpdate(id, {
    name,
    email,
    message,
  });
  if(updatedData._id) res.json("Data Updated")
});

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  blogContent: {
    type: String,
    required: true,
  }
});

const blogModel=mongoose.model('blog',blogSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/sendBlog", async(req, res) => {
  console.log(req.body);

  const blogToSave= new blogModel(req.body);
  await blogToSave.save();
  res.json("Blog Posted Successfully...");
});

// app.get("/Data", async (req, res) => {
//   try {
//     const blogss = await blogModel.find();
//     res.json(blogss);
//   }
//   catch {
//     res.status(500).json({message:err.message})
//   }
// })

app.get("/Data", async (req, res) => {

  const saved = await blogModel.find();
  if (saved) res.json(saved);
  // res.json('hello')
});

app.get('/search',async(req,res)=>{

  const search=req.query.q;  
const data=await blogModel.find({
  $or:[{title:search},{name:search}]
})

  res.json(data);

}) 
