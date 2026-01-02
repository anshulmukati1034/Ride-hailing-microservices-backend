const mangoose = require('mongoose');   


function connect() {
    mangoose.connect(process.env.MONGO_URL).then(() => {
        console.log('ride service connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });
}

module.exports = connect;
