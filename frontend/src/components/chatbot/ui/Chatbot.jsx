import { MessagesSquare, X } from 'lucide-react';
import { useChatbotLogic } from '../controllers/useChatbotLogic';


const SUGGESTIONS = [
    { label: 'Nearby restaurants', msg: 'Show nearby restaurants' },
    { label: 'Take me home', msg: 'Take me home' },
    { label: 'Show transit', msg: 'Toggle transit layer' },
];

const Chatbot = () => {
    const {
        messages,
        input,
        loading,
        isOpen,
        chatRef,
        setInput,
        toggleChat,
        sendMessage
    } = useChatbotLogic();


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-5 right-5 z-[9999] bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition active:scale-95"
                >
                    <MessagesSquare className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600' />
                </button>
            )}

            {/* IMPLEMENT ANIMATE SLIDE-DOWN */}

            <div
                ref={chatRef}
                className={`chatbot z-[9999] transform transition-all duration-300 ease-in-out ${isOpen
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : 'translate-y-full opacity-0 pointer-events-none'
                    }`}
            >
                <div className='chat-header flex justify-between items-center'>
                    <span className='ml-3'>Smart Assistant</span>

                    <button
                        onClick={toggleChat}
                        className="text-white hover:text-gray-300 slide-down transition"
                    >
                        <X className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' />
                    </button>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                    {loading && <div className="message assistant">Thinking...</div>}
                </div>
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className={`p-2 text-sm font-normal outline-none border-t-[1px] border-t-slate-300 ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                />
            </div>
        </>

    );
};

export default Chatbot;
