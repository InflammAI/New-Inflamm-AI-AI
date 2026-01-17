const fs = require('fs');
const content = fs.readFileSync('app/inflamm-ai/modules/chat/ChatScreen.tsx', 'utf8');
let open = 0;
let close = 0;
for (let char of content) {
  if (char === '{') open++;
  if (char === '}') close++;
}
console.log('Open braces:', open, 'Close braces:', close, 'Difference:', open - close);
