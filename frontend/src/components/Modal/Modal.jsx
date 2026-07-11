import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

function Modal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    className = "",
    ...props
}) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <section
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-main-title"
            {...props}
        >
            <article
                className={`modal-container ${className}`.trim()}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="modal-header">
                    <section className="modal-header-text">
                        <h2 id="modal-main-title" className="modal-title">
                            {title}
                        </h2>

                        {subtitle && (
                            <p className="modal-subtitle">
                                {subtitle}
                            </p>
                        )}
                    </section>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Fechar modal"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </header>

                <section className="modal-body">
                    {children}
                </section>
            </article>
        </section>
    );
}

export default Modal;