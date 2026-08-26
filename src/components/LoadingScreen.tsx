import { AnimatePresence, motion } from "framer-motion"

interface LoadingScreenProps {
  isLoaded: boolean
}

export function LoadingScreen({ isLoaded }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="loader"
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: "center" }}
          >
            <div className="loading-name">SUSHANT KUMAR</div>
            <div className="loading-sub" style={{ marginTop: 8 }}>Loading Portfolio</div>
          </motion.div>
          <div className="loading-bar-track">
            <div className="loading-bar" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
