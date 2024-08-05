const mongoose = require('mongoose');
const mongooseURL = "mongodb+srv://Sudhanshu:lenskartCloneDatabase@cluster2.qmd4ggx.mongodb.net/?retryWrites=true&w=majority";

const connectedToMongodb = async () => {
    try {
        const connection = await mongoose.connect(mongooseURL);
        console.log("connected to mongodb");
    } catch (error) {
        console.log(error.message); 
    }
}
// process.env._MONGO_URL

module.exports = connectedToMongodb;