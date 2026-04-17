import fs from 'fs';
const originalHtml = fs.readFileSync('index.html', 'utf8');
const headEnd = originalHtml.indexOf('</head>');

let newHtml = originalHtml.substring(0, headEnd + 7);
newHtml += `\n<body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>`;

fs.writeFileSync('index.html', newHtml);
