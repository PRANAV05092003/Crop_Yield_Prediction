"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PredictRequest } from "@/lib/api";

const defaultValues: PredictRequest = {
  year: 2020,
  precipitation: 650,
  maxtemp: 32.5,
  mintemp: 19.2,
  avgtemp: 13.5,
  specifichumidity: 0.0115,
  relativehumidity: 54,
  surfacepressure: 94.0,
  dewpoints: 14.0,
  minwindspeed: 2.5,
  maxwindspeed: 6.0,
  cloudcoverage: 0.55,
  nitrogen: 0,
  phosphorus: 1,
  pottasium: 1,
  ph: 2,
  ndvi: 0.45,
};

const fields: { key: keyof PredictRequest; label: string; type?: string; hint?: string }[] = [
  { key: "year", label: "Year", hint: "1990–2030" },
  { key: "precipitation", label: "Precipitation (mm)" },
  { key: "maxtemp", label: "Max temperature (°C)" },
  { key: "mintemp", label: "Min temperature (°C)" },
  { key: "avgtemp", label: "Average temperature (°C)" },
  { key: "specifichumidity", label: "Specific humidity", hint: "e.g. 0.0115" },
  { key: "relativehumidity", label: "Relative humidity (%)" },
  { key: "surfacepressure", label: "Surface pressure (kPa)" },
  { key: "dewpoints", label: "Dew point (°C)" },
  { key: "minwindspeed", label: "Min wind speed (m/s)" },
  { key: "maxwindspeed", label: "Max wind speed (m/s)" },
  { key: "cloudcoverage", label: "Cloud coverage (0–1)" },
  { key: "nitrogen", label: "Nitrogen level (-2 to 2)" },
  { key: "phosphorus", label: "Phosphorus level (-2 to 2)" },
  { key: "pottasium", label: "Potassium level (0–2)" },
  { key: "ph", label: "Soil pH category (1–4)" },
  { key: "ndvi", label: "NDVI (-1 to 1)" },
];

export function PredictForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (payload: PredictRequest) => void;
  disabled?: boolean;
}) {
  const [form, setForm] = React.useState<PredictRequest>(defaultValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof PredictRequest, string>>>({});
  const intKeys = React.useMemo(
    () =>
      new Set<keyof PredictRequest>([
        "year",
        "nitrogen",
        "phosphorus",
        "pottasium",
        "ph",
      ]),
    []
  );

  const validate = (): boolean => {
    const e: Partial<Record<keyof PredictRequest, string>> = {};
    // If user left a field empty (NaN), show required errors
    for (const k of Object.keys(form) as (keyof PredictRequest)[]) {
      const v = form[k] as unknown as number;
      if (!Number.isFinite(v)) e[k] = "Required";
    }
    if (form.year < 1990 || form.year > 2030) e.year = "Year must be 1990–2030";
    if (form.precipitation < 0 || form.precipitation > 2000) e.precipitation = "0–2000";
    if (form.maxtemp < 20 || form.maxtemp > 45) e.maxtemp = "20–45 °C";
    if (form.mintemp < 10 || form.mintemp > 30) e.mintemp = "10–30 °C";
    if (form.avgtemp < 10 || form.avgtemp > 25) e.avgtemp = "10–25 °C";
    if (form.specifichumidity < 0.008 || form.specifichumidity > 0.02) e.specifichumidity = "0.008–0.02";
    if (form.relativehumidity < 30 || form.relativehumidity > 90) e.relativehumidity = "30–90%";
    if (form.surfacepressure < 90 || form.surfacepressure > 100) e.surfacepressure = "90–100 kPa";
    if (form.dewpoints < 5 || form.dewpoints > 25) e.dewpoints = "5–25 °C";
    if (form.minwindspeed < 0 || form.minwindspeed > 10) e.minwindspeed = "0–10 m/s";
    if (form.maxwindspeed < 0 || form.maxwindspeed > 15) e.maxwindspeed = "0–15 m/s";
    if (form.cloudcoverage < 0 || form.cloudcoverage > 1) e.cloudcoverage = "0–1";
    if (form.nitrogen < -2 || form.nitrogen > 2) e.nitrogen = "-2 to 2";
    if (form.phosphorus < -2 || form.phosphorus > 2) e.phosphorus = "-2 to 2";
    if (form.pottasium < 0 || form.pottasium > 2) e.pottasium = "0–2";
    if (form.ph < 1 || form.ph > 4) e.ph = "1–4";
    if (form.ndvi < -1 || form.ndvi > 1) e.ndvi = "-1 to 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const update = (key: keyof PredictRequest, value: string) => {
    if (value === "") {
      // Allow clearing the field while typing
      setForm((prev) => ({ ...prev, [key]: Number.NaN as unknown as number }));
      return;
    }
    const n = intKeys.has(key) ? parseInt(value, 10) : parseFloat(value);
    if (!Number.isNaN(n)) setForm((prev) => ({ ...prev, [key]: n }));
  };

  const displayValue = (key: keyof PredictRequest) => {
    const v = form[key] as unknown as number;
    return Number.isFinite(v) ? v : "";
  };

  const stepFor = (key: keyof PredictRequest) => {
    if (intKeys.has(key)) return 1;
    if (key === "specifichumidity") return 0.0001;
    if (key === "ndvi" || key === "cloudcoverage") return 0.01;
    return 0.1;
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="mt-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Input data</CardTitle>
          <CardDescription>
            Weather and NDVI parameters. Ranges are validated before submit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ key, label, hint }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                  {label}
                  {hint && (
                    <span className="ml-1 text-xs text-stone-400">({hint})</span>
                  )}
                </Label>
                <Input
                  id={key}
                  type="number"
                  step={stepFor(key)}
                  value={displayValue(key)}
                  onChange={(e) => update(key, e.target.value)}
                  className={errors[key] ? "border-red-500" : ""}
                  disabled={disabled}
                />
                {errors[key] && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
          <Button type="submit" disabled={disabled} size="lg" className="w-full sm:w-auto">
            {disabled ? "Predicting…" : "Predict yield"}
          </Button>
        </CardContent>
      </Card>
    </motion.form>
  );
}
