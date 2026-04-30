"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { safaris } from "@/data/safaris";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SafariQuizModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState({
    type: "",
    country: "",
    duration: "",
    people: "",
    date: "",
    budget: "",
    });

  const [results, setResults] = useState<any[]>([]);

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);

  const handleSelect = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
    next();
  };

  const handleSearch = () => {
  const filtered = safaris.filter((safari) => {
    return (
      (!answers.type ||
        safari.type.toLowerCase().includes(answers.type.toLowerCase())) &&
      (!answers.country ||
        safari.country.toLowerCase() === answers.country.toLowerCase()) &&
      (!answers.duration ||
        safari.duration <= Number(answers.duration)) &&
      (!answers.budget ||
        safari.price <= Number(answers.budget))
    );
  });

  console.log("ANSWERS:", answers);
  console.log("RESULTS:", filtered);

  setResults(filtered);
  next();
};

  const totalSteps = 7; // increased because of budget + results
    const progress = ((step + 1) / totalSteps) * 100;
//     const steps = [
//   stepType,
//   stepCountry,
//   stepDuration,
//   stepPeople,
//   stepDate,
//   stepBudget,   
//   stepResults,
// ];

    const resetQuiz = () => {
    setStep(0);
    setAnswers({
        type: "",
        country: "",
        duration: "",
        people: "",
        date: "",
        budget: "",
    });
    setResults([]);
    };

  const steps = [
    // STEP 1
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">What type of safari?</h2>
      <div className="grid grid-cols-2 gap-3 text-gray-700">
        {["beach", "park", "island", "cultural"].map((type) => (
          <button
            key={type}
            onClick={() => handleSelect("type", type)}
            className="p-3 border rounded-lg hover:bg-orange-100 cursor-pointer"
          >
            {type}
          </button>
        ))}
      </div>
      {/* ✅ Skip */}
        <button
            onClick={next}
            className="mt-4 text-sm text-gray-500 underline"
        >
            Skip
        </button>
    </div>,

    // STEP 2
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Which country?</h2>
      {["kenya", "uganda", "tanzania"].map((c) => (
        <button
          key={c}
          onClick={() => handleSelect("country", c)}
          className="block w-full p-3 mb-2 border rounded-lg hover:bg-orange-100 text-gray-700 cursor-pointer"
        >
          {c}
        </button>
      ))}
      {/* ✅ Skip */}
        <button
            onClick={next}
            className="mt-4 text-sm text-gray-500 underline"
        >
            Skip
        </button>
    </div>,

    // STEP 3
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Duration (days)</h2>
      <input
        type="number"
        placeholder="e.g. 5"
        className="w-full border p-3 rounded text-gray-700"
        onChange={(e) =>
          setAnswers({ ...answers, duration: e.target.value })
        }
      />
      <button onClick={next} className="mt-4 btn-primary text-gray-700 cursor-pointer">
        Next
      </button>
      {/* ✅ Skip */}
        <button
            onClick={next}
            className="mt-4 text-sm text-gray-500 underline"
        >
            Skip
        </button>
    </div>,

    // STEP 4
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Number of people</h2>
      <input
        type="number"
        placeholder="e.g 5"
        className="w-full border p-3 rounded text-gray-700"
        onChange={(e) =>
          setAnswers({ ...answers, people: e.target.value })
        }
      />
      <button onClick={next} className="mt-4 btn-primary text-gray-700 cursor-pointer">
        Next
      </button>
      {/* ✅ Skip */}
        <button
            onClick={next}
            className="mt-4 text-sm text-gray-500 underline"
        >
            Skip
        </button>
    </div>,

    // STEP 5
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Travel Date</h2>
      <input
        type="date"
        className="w-full border p-3 rounded text-gray-700"
        onChange={(e) =>
          setAnswers({ ...answers, date: e.target.value })
        }
      />
      <button onClick={next} className="mt-4 btn-primary text-gray-700 cursor-pointer">
        Next
      </button>
      {/* ✅ Skip */}
        <button
            onClick={next}
            className="mt-4 text-sm text-gray-500 underline"
        >
            Skip
        </button>
    </div>,

    // STEP: BUDGET
    <div>
  <h2 className="text-xl font-bold mb-4 text-gray-800">
    What's your budget per person?
  </h2>

  <div className="grid gap-3 text-gray-700">
    {[
      { label: "Under $800", value: 800 },
      { label: "Under $1500", value: 1500 },
      { label: "Under $3000", value: 3000 },
      { label: "Luxury ($3000+)", value: 999999 },
    ].map((c) => (
      <button
        key={c.value}
        onClick={() => {
          const updated = { ...answers, budget: String(c.value) };
          setAnswers(updated);

          const filtered = safaris.filter((safari) => {
            return (
              (!updated.type || safari.type === updated.type) &&
              (!updated.country || safari.country === updated.country) &&
              (!updated.duration || safari.duration <= Number(updated.duration)) &&
              (!updated.budget || safari.price <= Number(updated.budget))
            );
          });

          setResults(filtered);
          next();
        }}
        className="p-3 border rounded-lg hover:bg-orange-100 text-left"
      >
        {c.label}
      </button>
    ))}
  </div>
</div>,

    // STEP 6
    <div>
        <h2 className="text-xl font-bold mb-4">Your Matches</h2>
        <button
        onClick={resetQuiz}
        className="mt-4 w-full bg-gray-500 text-white hover:bg-gray-300 p-3 rounded-lg cursor-pointer"
        >
        Start Over
        </button>

        {results.length === 0 ? (
            <p>No safaris found. Try adjusting your filters.</p>
        ) : (
            <div className="grid gap-4">
            {results.map((s) => (
                <div
                key={s.id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-40 object-cover"
                />

                <div className="p-3">
                    <h3 className="font-semibold text-lg">{s.name}</h3>

                    <p className="text-sm text-gray-500">
                    {s.country} • {s.duration} days
                    </p>

                    <p className="mt-2 font-bold text-orange-500">
                    ${s.price}
                    </p>

                    <button className="mt-3 w-full bg-orange-500 text-white p-2 rounded-lg">
                    View Safari
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>,

    // STEP 6 (RESULTS)
    // <div>
    //   <h2 className="text-xl font-bold mb-4 text-gray-800">Your Matches</h2>

    //   {results.length === 0 ? (
    //     <p>No safaris found</p>
    //   ) : (
    //     results.map((s) => (
    //       <div key={s.id} className="border p-3 rounded mb-2">
    //         <h3 className="font-semibold">{s.name}</h3>
    //         <p>{s.country} • {s.duration} days</p>
    //       </div>
    //     ))
    //   )}
    //   <button
    //     onClick={resetQuiz}
    //     className="mt-4 w-full bg-gray-500 text-white hover:bg-gray-300 p-3 rounded-lg cursor-pointer"
    //     >
    //     Start Over
    //     </button>
    // </div>,
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md p-6 rounded-xl relative"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            {/* Progress Bar */}
            {step > 0 && (
                <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                    <span>Step {step + 1} of {totalSteps}</span>
                    <span>{Math.round(progress)}%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                    className="bg-orange-500 h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    />
                </div>
                </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                {steps[step]}
              </motion.div>
            </AnimatePresence>

            {step > 0 && step < steps.length - 1 && (
              <button
                onClick={prev}
                className="mt-4 text-sm text-gray-500"
              >
                Back
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
      {/* <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
            className="bg-orange-500 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
            />
        </div>
        </div> */}
    </AnimatePresence>
  );
}