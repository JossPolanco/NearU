import { forwardRef, useId, useImperativeHandle, useRef } from 'react';

const Modal = forwardRef(function Modal({ className = "", modalTitle, modalSubtitle, children }, ref) {
    const dialogRef = useRef(null);
    const titleId = useId();

    useImperativeHandle(ref, () => ({
        open: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
    }));

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={modalTitle ? titleId : undefined}
            aria-label={modalTitle ? undefined : "Modal dialog"}
            className="modal modal-middle p-3 sm:p-4"
        >
            <div
                className={`modal-box w-11/12 max-w-lg max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)] p-0 flex flex-col rounded-3xl border border-base-300/60 bg-base-100/95 shadow-2xl backdrop-blur my-auto overflow-hidden ${className}`}
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
                    <form method="dialog" className="shrink-0 -mr-1 -mt-0.5">
                        <button
                            type="submit"
                            className="btn btn-sm btn-circle btn-soft btn-error animate-pulse"
                            aria-label="Cerrar modal"
                        >
                            ✕
                        </button>
                    </form>
                </div>

                {/* Contenido con scroll independiente */}
                <div className="px-6 py-5 overflow-y-auto overscroll-contain flex-1 scrollbar-thin">
                    {children}
                </div>
            </div>
        </dialog>
    );
});

export default Modal;
