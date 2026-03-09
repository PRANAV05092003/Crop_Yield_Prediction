"use client";

import Link from "next/link";
import { Github, Mail, Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100/50 dark:border-stone-800 dark:bg-stone-900/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
            <Leaf className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span className="font-medium">Crop Yield Prediction</span>
          </div>
          <p className="max-w-md text-sm text-stone-500 dark:text-stone-400">
            AI/ML-based crop yield prediction using weather data and NDVI
            time-series to support data-driven farming decisions.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/PRANAV05092003/Crop_Yield_Prediction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              aria-label="Contact"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-500">
          Built with Next.js, FastAPI &amp; scikit-learn. For research and
          educational use.
        </p>
      </div>
    </footer>
  );
}
