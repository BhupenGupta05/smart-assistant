import { useState } from 'react'
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! Ask me anything 🚀' },
    ]);

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendmessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post(`/api/chat`, { messages: newMessages })
            const reply = data.reply;
            setMessages([...newMessages, { role: 'assistant', content: reply }]);

        } catch (error) {
            console.error(error);
            setMessages([...newMessages, {
                role: 'assistant',
                content: '⚠️ Something went wrong.',
            }]);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendmessage();
    }
    return (
        <div className="chatbot">
            <div className="chat-header">🤖 Smart Assistant</div>
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {loading && <div className="message assistant">...</div>}
            </div>
            <input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}

export default Chatbot
