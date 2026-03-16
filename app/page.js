const data = await res.json();
const jarvisText = data.reply;  // ← Must use data.reply
setMessages(prev => [...prev, { role: 'jarvis', text: jarvisText }]);
const data = await res.json();
const jarvisText = data.reply;  // ← Must use data.reply
setMessages(prev => [...prev, { role: 'jarvis', text: jarvisText }]);
