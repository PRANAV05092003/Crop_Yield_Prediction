"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Cloud, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-b from-primary-50/50 to-transparent dark:border-stone-800 dark:from-primary-950/30">
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-5xl md:text-6xl">
              Predict Crop Yield Using Weather &amp; NDVI Data
            </h1>
            <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">
              Combine weather parameters and Sentinel-2 NDVI time-series for
              accurate yield forecasts. Plan harvests, minimize costs, and
              maximize yields.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/predict">
                <Button size="lg" className="gap-2">
                  Get prediction
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  How it works
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/20 to-transparent dark:from-primary-900/10" />
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-16 sm:py-24"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-bold text-stone-900 dark:text-stone-50"
        >
          How it works
        </motion.h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-stone-600 dark:text-stone-400">
          Enter weather and NDVI inputs; our model returns a yield prediction
          with confidence.
        </p>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Enter data",
              desc: "Provide weather (temperature, rainfall, humidity, wind, pressure) and NDVI index.",
              icon: Cloud,
            },
            {
              step: "2",
              title: "Model runs",
              desc: "Preprocessing and RandomForest model match the research pipeline.",
              icon: BarChart3,
            },
            {
              step: "3",
              title: "Get yield",
              desc: "Receive predicted yield and a confidence score.",
              icon: Satellite,
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-stone-900 dark:text-stone-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature highlights + images */}
      <section className="border-t border-stone-200 bg-stone-100/50 dark:border-stone-800 dark:bg-stone-900/30">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-center text-3xl font-bold text-stone-900 dark:text-stone-50">
            Built for accuracy
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-stone-600 dark:text-stone-400">
            Weather + NDVI hybrid approach for regional farming, trained on
            historical data.
          </p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"
                alt="Wheat field"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                  Weather data
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Temperature, rainfall, humidity, dew point, wind, and pressure.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80"
                alt="Satellite view"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                  NDVI time-series
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Sentinel-2 derived vegetation index for the region of interest.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
            >
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80"
                alt="Agriculture data"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                  ML prediction
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  RandomForest model trained on historical yield and conditions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-primary-50 p-8 text-center dark:border-stone-800 dark:bg-primary-950/30"
        >
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
            Ready to predict yield?
          </h2>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Enter your weather and NDVI values to get a forecast.
          </p>
          <Link href="/predict" className="mt-6 inline-block">
            <Button size="lg" className="gap-2">
              Open prediction form
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
