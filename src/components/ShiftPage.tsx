import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface FadeProps {
    children: ReactNode;
}

const Fade = ({ children }: FadeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="min-h-screen flex flex-col items-center justify-center bg-background px-4"
        >
            {children}
        </motion.div>
    );
};

export default Fade;
