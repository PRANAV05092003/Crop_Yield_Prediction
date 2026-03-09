"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PredictForm } from "@/components/predict-form";
import { Toaster, useToast } from "@/components/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchPredict, type PredictResponse } from "@/lib/api";

export default function PredictPage() {
  const [result, setResult] = React.useState<PredictResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { toasts, setToasts, toast } = useToast();

  const handleSubmit = async (payload: Record<string, number>) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetchPredict(payload as Parameters<typeof fetchPredict>[0]);
      setResult(res);
      toast({ title: "Prediction ready", variant: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      toast({
        title: "Prediction failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster toasts={toasts} setToasts={setToasts} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          Crop yield prediction
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          Enter weather and NDVI data. Values are validated before sending.
        </p>

        <PredictForm onSubmit={handleSubmit} disabled={loading} />

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Running model…
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8"
            >
              <Card className="overflow-hidden border-primary-200 dark:border-primary-800">
                <CardHeader className="bg-primary-50/50 dark:bg-primary-950/30">
                  <CardTitle>Prediction result</CardTitle>
                  <CardDescription>
                    Model output with confidence score
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                        Predicted yield
                      </span>
                      <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {result.prediction.toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-500 dark:text-stone-400">
                          Confidence
                        </span>
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={result.confidence * 100} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
