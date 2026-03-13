import { motion } from "framer-motion";
import { Search, MessageSquare, ShieldCheck, Zap, Globe, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse thousands of listings or use our AI-powered search to find exactly what you need across local and international marketplaces.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Verified Sellers",
    description: "Every seller is verified with ratings and trade history. See phone verification badges and business credentials before you buy.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: MessageSquare,
    title: "Chat & Negotiate",
    description: "Message sellers directly through our real-time chat system. Negotiate prices, ask questions, and arrange meetups securely.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Zap,
    title: "Close the Deal",
    description: "Agree on terms, meet safely, and complete your transaction. Rate your experience to help the community.",
    color: "bg-destructive/10 text-destructive",
  },
];

const features = [
  {
    icon: Globe,
    title: "Cross-Marketplace Search",
    description: "Search across Jiji, AliExpress, HuluMarket, and more — all from one place.",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    description: "Bookmark listings you love and get back to them anytime from your favorites page.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Messaging",
    description: "Instant messaging with read receipts and notification alerts so you never miss a deal.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Controls",
    description: "Full control over who sees your phone, email, and address with granular privacy settings.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              How It Works
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight">
              Buy & sell with <span className="text-primary">confidence</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Visioner AI makes trading simple, safe, and smart. Here's how to get started in four easy steps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="container py-16 md:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={item} className="relative">
              <div className="rounded-xl border border-border bg-card p-6 h-full space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.color}`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-heading font-black text-muted-foreground/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 z-10">
                  <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
              Packed with smart features
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need for a seamless marketplace experience.
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={item}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/30 transition-colors"
              >
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-10 md:p-16 text-primary-foreground"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
            Ready to start trading?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Join thousands of buyers and sellers on Ethiopia's smartest marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/">Browse Listings</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/post/create">Post for Free</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
