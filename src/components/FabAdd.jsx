import { touchHover, tapFeedback, mobileSpring } from "@/utils/motion";
import { motion } from "motion/react";

export default function FabAdd({ onClick, ...props }) {
    return (
        <div className="fixed bottom-16 right-4 z-50">
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={touchHover({ scale: 1.08 })}
                whileTap={tapFeedback.button}
                transition={mobileSpring}
                className="btn btn-lg btn-circle btn-primary shadow-lg cursor-pointer select-none"
                type="button"
                onClick={onClick}
                {...props}
            >
                <svg aria-label="New" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </motion.button>
        </div>
    )
}
