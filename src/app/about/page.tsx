"use client";

import { Navbar } from "@/components/navbar";
import { DELIGHTS, getDelightConfig } from "@/lib/constants";
import { motion } from "framer-motion";

const DELIGHT_DESCRIPTIONS: Record<string, string> = {
  "walking around": "self explanatory",
  fellowship: "human connection, socializing, and solidarity",
  deliciousness: "good food/drink",
  transcendence:
    "feeling that i have reached a different level of some sort",
  goofing: "having a good laugh",
  amelioration: "self-improvement, helping others",
  decadence: "pleasure, luxury, or leisure",
  enthrallment: "becoming incredibly engaged with or focused on something",
  wildcard: "something delightful that doesn't fit in the above categories",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="space-y-6"
        >
          <h1
            className="text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            what is this?
          </h1>
          <div className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            the &quot;nine delights&quot; is a concept created by{" "}
            <a
              href="https://x.com/i_zzzzzz/status/1408546824970031126"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-foreground/30 underline-offset-2 transition-colors duration-200 ease hover:decoration-foreground/60"
            >
              @i_zzzzzz on twitter
            </a>
            . 
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            i&apos;m on a mission to fill my days with more of what i love! this website
            is a tool to document my progress and stay mindful of the 
            little things that make life delightful :)
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            below are the delights:
          </p>
          </div>

          <ul className="space-y-3">
            {DELIGHTS.map((d, i) => {
              const config = getDelightConfig(d.type);
              return (
                <motion.li
                  key={d.type}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    delay: i * 0.04,
                  }}
                  className="flex items-start gap-3 text-sm"
                >
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <div>
                    <span className="font-medium text-foreground">
                      {d.label.toLowerCase()}
                    </span>
                    <span className="text-muted-foreground">
                      : {DELIGHT_DESCRIPTIONS[d.type]}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
