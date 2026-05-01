"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Зулфия Рахимова",
    city: "Душанбе",
    role: "Teacher",
    rating: 5,
    text: "Нашла отличного кардиолога всего за несколько минут. Процесс записи был невероятно простым, а Dr. Рустамов очень внимателен и профессионален. Рекомендую всем!",
    avatar: "ZR",
  },
  {
    name: "Бехруз Назаров",
    city: "Худжанд",
    role: "Engineer",
    rating: 5,
    text: "Отличная платформа! Записался на приём к кардиологу в тот же день. Онлайн-консультация прошла быстро и качественно. Врач дал чёткие рекомендации.",
    avatar: "BN",
  },
  {
    name: "Малика Тошматова",
    city: "Бохтар",
    role: "Pharmacist",
    rating: 5,
    text: "Очень удобно сравнивать врачей и читать отзывы перед принятием решения. Интерфейс интуитивный. Записалась и прошла обследование без очередей.",
    avatar: "MT",
  },
  {
    name: "Рустам Каримов",
    city: "Куляб",
    role: "Businessman",
    rating: 5,
    text: "Благодаря DocTime нашёл специалиста для своей мамы. Быстро, удобно и надёжно. Теперь вся семья пользуется этой платформой для медицинских консультаций.",
    avatar: "RK",
  },
  {
    name: "Нилуфар Эшматова",
    city: "Душанбе",
    role: "Accountant",
    rating: 5,
    text: "Профессиональный подход, современные технологии и внимательное отношение к пациентам. Именно то, чего не хватало в нашей медицине. 10/10!",
    avatar: "NE",
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="h-3.5 w-3.5"
          style={{
            fill: s <= rating ? "#00d4ff" : "transparent",
            color: s <= rating ? "#00d4ff" : "rgba(255,255,255,0.2)",
          }}
          aria-hidden
        />
      ))}
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((prev) => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
    },
    []
  );

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => paginate(1), 5000);
    return () => clearInterval(id);
  }, [isPaused, paginate]);

  const visible = [
    TESTIMONIALS[current],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ];

  return (
    <section
      id="testimonials"
      className="relative py-28 px-6 lg:px-16 overflow-hidden"
      style={{ background: "#080820" }}
      aria-labelledby="testimonials-heading"
    >
      {/* Orbs */}
      <div
        className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,238,0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                background: "rgba(0,255,238,0.08)",
                border: "1px solid rgba(0,255,238,0.25)",
                color: "#00ffee",
              }}
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Patient Stories
            </motion.div>

            <motion.h2
              id="testimonials-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-4xl lg:text-5xl font-black text-white font-orbitron"
            >
              Trusted by{" "}
              <span className="gradient-text-space">Thousands</span>
            </motion.h2>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => paginate(-1)}
              className="h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "#00d4ff",
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visible.map((review, idx) => (
            <motion.div
              key={`${current}-${idx}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="testimonial-card relative rounded-2xl p-7 overflow-hidden flex flex-col"
            >
              {/* Accent top */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
                style={{
                  background: idx === 0
                    ? "linear-gradient(90deg, transparent, #00d4ff, transparent)"
                    : idx === 1
                    ? "linear-gradient(90deg, transparent, #00ffee, transparent)"
                    : "linear-gradient(90deg, transparent, #00ff88, transparent)",
                }}
              />

              {/* Quote mark */}
              <div
                className="absolute -top-1 -right-1 text-[7rem] font-serif leading-none pointer-events-none select-none"
                style={{ color: "rgba(0,212,255,0.06)" }}
                aria-hidden
              >
                &ldquo;
              </div>

              <StarRow rating={review.rating} />

              <blockquote
                className="text-sm leading-relaxed mt-4 mb-6 flex-1"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                &ldquo;{review.text}&rdquo;
              </blockquote>

              <div
                className="flex items-center gap-3 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="h-11 w-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,212,255,0.3), rgba(0,255,136,0.2))",
                    border: "2px solid rgba(0,212,255,0.3)",
                    color: "#00d4ff",
                  }}
                  aria-hidden
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{review.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {review.role} · {review.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dot indicators */}
        <div
          className="flex justify-center gap-2 mt-10"
          role="tablist"
          aria-label="Testimonial navigation"
        >
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? "24px" : "6px",
                height: "6px",
                background: i === current
                  ? "linear-gradient(90deg, #00d4ff, #00ffee)"
                  : "rgba(255,255,255,0.2)",
              }}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
