const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'home.html');

let newsContent = `Fall back news: <num><num1><num2><num3>日美國總統<per0>與英國<en>首相<per1>於<loc0>舉行雙<en2>邊會談，兩人會後發布聯合聲明，<per0>表示支持<org0>...`;

app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});
app.get('/demo1', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'demo1.html'));
});
app.get('/newsEditor', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'newsEditor.html'));
});

app.get('/_hidden-news-data', (req, res) => {
    res.send({ news: newsContent });
});

app.post("/post/_news-data", express.json(), function (req, res) {
    if (req.body.news) {
        newsContent = req.body.news;
    }
})

app.post("/post/_generate-fake-news", express.json(), function (req, res) {
    console.log(req.body);
    // manually delay
    let x = 13;
    for (let i = 1; i < 5000000000; i++) {
        x = i + 24;
    }
    // end
    res.send({
        content: "<num>日美國yyy總統<per0>與英國<en>首相<per1>於<loc0>舉行雙邊會談，兩人會後發布聯合聲明，<per0>表示支持<org0>..."
    })
})

app.listen(port, function () {
    console.log('App listening on port: ' + port);
});
