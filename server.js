const express = require('express');
const cors = require("cors");
const routes = require('./src/routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());




// Organized Routes
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
