const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/work-delay'));

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname + '/dist/work-delay/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, (error) => {
  if (error) {
    return console.log('Something bad happened', error)
  }
  console.log(`Server is listening on port: ${port}`);
});
