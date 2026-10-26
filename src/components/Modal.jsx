import { forwardRef, useId, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ className = "", modalTitle, modalSubtitle, children, onClose }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const titleId = useId();

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        onClose?.();
    }, [onClose]);

    useImperativeHandle(ref, () => ({
        open,
        close,
        isOpen,
    }), [open, close, isOpen]);

    // Cerrar con tecla Escape y bloquear el scroll del fondo
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                close();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, close]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={modalTitle ? titleId : undefined}
                    aria-label={modalTitle ? undefined : "Modal dialog"}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={close}
                >
                    <motion.div
                        className={`w-11/12 max-w-lg max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)] p-0 flex flex-col rounded-3xl border border-base-300/60 bg-base-100/95 shadow-2xl backdrop-blur my-auto overflow-hidden ${className}`}
                        initial={{ opacity: 0, scale: 0.9, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 12 }}
                        transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 26,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header fijo en la parte superior del modal */}
                        <div className="flex justify-between items-start w-full px-6 pt-5 pb-3 shrink-0 border-b border-base-200/50 bg-base-100/95 backdrop-blur z-10">   
                            <div className="flex flex-col gap-0.5 pr-3 flex-1 min-w-0">
                                {modalTitle && (
                                    <h4 id={titleId} className="text-xl font-bold text-primary leading-tight wrap-break-word">
                                        {modalTitle}
                                    </h4>
                                )}
                                {modalSubtitle && (
                                    <p className="text-xs text-base-content/70 leading-normal mt-0.5">
                                        {modalSubtitle}
                                    </p>
                                )}
                            </div>
                            <div className="shrink-0 -mr-1 -mt-0.5">
                                <motion.button
                                    type="button"
                                    onClick={close}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                    className="btn btn-sm btn-circle btn-soft btn-error cursor-pointer"
                                    aria-label="Cerrar modal"
                                >
                                    ✕
                                </motion.button>
                            </div>
                        </div>

                        {/* Contenido con scroll independiente */}
                        <div className="px-6 py-5 overflow-y-auto overscroll-contain flex-1 scrollbar-thin">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
});

export default Modal;

