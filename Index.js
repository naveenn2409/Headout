const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8000;

app.get('/data', (req, res) => {
  const fileName = req.query.n;
  const lineNumber = parseInt(req.query.m);

  if (fileName) {
    const filePath = path.join('', `${fileName}.txt`);

    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (err) => {
      res.status(500).send('Internal Server Error');
    });

    if (!isNaN(lineNumber) && lineNumber >= 0) {
      let currentLine = 1;

      const rl = require('readline').createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      rl.on('line', (line) => {
        if (currentLine === lineNumber) {
            res.status(200).send(line);
          rl.close();
        }
        currentLine++;
      });
      
      rl.on('close', () => {
        if (currentLine < lineNumber) {
            res.status(500).send('Invalid line number'); 
        }
      });
    } else {
      res.status(200);
      fileStream.pipe(res);
    }
  } else {
    res.status(400).send('Missing or invalid query parameters');
  }
});

app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
