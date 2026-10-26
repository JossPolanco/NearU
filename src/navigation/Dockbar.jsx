import { Settings, House, PenLine, MessageCircleMore } from 'lucide-react';
import { tapFeedback } from '@/utils/motion';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Dockbar({ children }) {
    const navigate = useNavigate();
    const [active, setActive] = useState('');

    const setDockActive = (section, endpoint) => {
        setActive(section);
        navigate(endpoint);
    };

    return (
        <>
            {children}

            <div className="dock z-40 bg-base-100/95 dark:bg-base-900/95 backdrop-blur border-t border-base-200/60 dark:border-base-800/60 shadow-lg">
                <motion.button 
                    whileTap={tapFeedback.icon}
                    type="button" 
                    className={active === 'drawing' ? 'dock-active' : ''} 
                    onClick={() => setDockActive('drawing', '/drawing')}
                >
                    <PenLine size={18} />
                    <span className="dock-label">Dibujo</span>
                </motion.button>

                <motion.button 
                    whileTap={tapFeedback.icon}
                    type="button" 
                    className={active === 'chat' ? 'dock-active' : ''} 
                    onClick={() => setDockActive('chat', '/chat')}
                >
                    <MessageCircleMore size={18} />
                    <span className="dock-label">Chat</span>
                </motion.button>

                <motion.button 
                    whileTap={tapFeedback.icon}
                    type="button" 
                    className={active === 'home' ? 'dock-active' : ''} 
                    onClick={() => setDockActive('home', '/home')} 
                >
                    <House size={18} />
                    <span className="dock-label">Hogar</span>
                </motion.button>

                <motion.button 
                    whileTap={tapFeedback.icon}
                    type="button" 
                    className={active === 'config' ? 'dock-active' : ''} 
                    onClick={() => setDockActive('config', '/config')}
                >
                    <Settings size={18} />
                    <span className="dock-label">Configuración</span>
                </motion.button>
            </div>
        </>
    );
}