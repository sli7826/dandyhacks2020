const express = require('express');
const app = express();
const port = 3006;

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})