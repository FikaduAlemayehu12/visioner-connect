import { motion } from "framer-motion";
import { Target, Users, Sparkles, Shield, Globe2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Verified sellers, secure messaging, and privacy controls make every transaction safe.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart search, cross-marketplace aggregation, and intelligent recommendations powered by AI.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built for the Ethiopian market — supporting local commerce and empowering small businesses.",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description: "Search across international platforms like AliExpress while shopping locally on Jiji and HuluMarket.",
  },
];

const stats = [
  { value: "10K+", label: "Active Listings" },
  { value: "5K+", label: "Verified Users" },
  { value: "50K+", label: "Deals Closed" },
  { value: "4.8★", label: "User Rating" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-primary/5" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-secondary uppercase tracking-wider"
            >
              About Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight"
            >
              Reimagining commerce in{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ethiopia
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto"
            >
              Visioner AI is Ethiopia's intelligent marketplace — combining local listings, global search, and AI-powered tools to make buying and selling effortless.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container py-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={item} className="space-y-1">
                <p className="text-3xl md:text-4xl font-heading font-black text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="container py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Mission</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Empowering every Ethiopian to trade smarter
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe everyone deserves access to a safe, transparent, and intelligent marketplace. Whether you're a student selling textbooks, a small business owner expanding reach, or someone looking for the best deal — Visioner AI is built for you.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our AI searches across multiple platforms — Jiji, AliExpress, Facebook Marketplace, and HuluMarket — giving you the best prices and options, all in one place.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                <v.icon className="h-7 w-7 text-primary" />
                <h3 className="font-heading font-semibold text-sm text-foreground">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
              </div>
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
          className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 p-10 md:p-16 text-secondary-foreground"
        >
          <Heart className="h-10 w-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
            Join our growing community
          </h2>
          <p className="text-secondary-foreground/80 mb-6 max-w-md mx-auto">
            Start buying and selling today — it's free, fast, and powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
              <Link to="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
