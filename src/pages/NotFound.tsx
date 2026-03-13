import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mx-auto mb-8"
        >
          <span className="text-[10rem] font-heading font-black leading-none bg-gradient-to-br from-primary via-accent to-secondary bg-clip-text text-transparent select-none">
            404
          </span>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Search className="h-16 w-16 text-primary/20" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button size="lg" asChild>
            <Link to="/"><Home className="h-4 w-4" /> Go Home</Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
