"use client";

import { useEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ScrollVideoRefs {
  section: RefObject<HTMLElement | null>;
  video: RefObject<HTMLVideoElement | null>;
  videoWrap: RefObject<HTMLDivElement | null>;
  badge: RefObject<HTMLDivElement | null>;
  title: RefObject<HTMLHeadingElement | null>;
  subtitle: RefObject<HTMLParagraphElement | null>;
  search: RefObject<HTMLDivElement | null>;
  cta: RefObject<HTMLDivElement | null>;
  card: RefObject<HTMLDivElement | null>;
  progressBar: RefObject<HTMLDivElement | null>;
  scrollIndicator: RefObject<HTMLDivElement | null>;
}

/**
 * Drives scroll-video scrubbing via GSAP ScrollTrigger.
 *
 * Uses a stable-ref pattern: `refsRef.current` is always up-to-date
 * without adding the refs object to the effect's dependency array,
 * which would cause teardown/re-setup on every render.
 *
 * Animation timeline:
 *   0–38%  scroll → text elements reveal (staggered, spring-like)
 *  38–76%  scroll → hold (video plays, content visible)
 *  76–100% scroll → text exits upward, card slides right
 */
export function useScrollVideo(refs: ScrollVideoRefs, enabled: boolean): void {
  const refsRef = useRef(refs);
  useEffect(() => {
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);

    const r = refsRef.current;
    const sectionEl = r.section.current;
    const videoEl = r.video.current;
    if (!sectionEl || !videoEl) return;

    const triggers: ScrollTrigger[] = [];

    const setup = () => {
      triggers.forEach(t => t.kill());
      triggers.length = 0;

      /* ── 1. Video currentTime scrub ─────────────────────── */
      // scrub: 1 = 1-second ease-in catch-up (feels native, no snap)
      const videoTween = gsap.to(videoEl, {
        currentTime: videoEl.duration || 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            // These DOM writes don't need scrub lag — update raw
            const pb = refsRef.current.progressBar.current;
            if (pb) pb.style.width = `${self.progress * 100}%`;
            const si = refsRef.current.scrollIndicator.current;
            if (si) si.style.opacity = self.progress < 0.04 ? "1" : "0";
          },
        },
      });
      if (videoTween.scrollTrigger) triggers.push(videoTween.scrollTrigger);

      /* ── 2. Video wrap scale (parallax pull-back) ───────── */
      // Starts at 1.07×, ends at 1.0 — gives a subtle zoom-out feel
      const videoWrapEl = refsRef.current.videoWrap.current;
      if (videoWrapEl) {
        const scaleTween = gsap.fromTo(
          videoWrapEl,
          { scale: 1.07 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
        if (scaleTween.scrollTrigger) triggers.push(scaleTween.scrollTrigger);
      }

      /* ── 3. Text overlay timeline ───────────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

      const { badge, title, subtitle, search, cta, card } = refsRef.current;

      // Reveal — staggered entry (maps to 0→38% of total scroll)
      if (badge.current)
        tl.fromTo(badge.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0);
      if (title.current)
        tl.fromTo(title.current, { opacity: 0, y: 50, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: "power2.out" }, 0.07);
      if (subtitle.current)
        tl.fromTo(subtitle.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.16);
      if (search.current)
        tl.fromTo(search.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.24);
      if (cta.current)
        tl.fromTo(cta.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.31);
      if (card.current)
        tl.fromTo(card.current, { opacity: 0, x: 52, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.22, ease: "power2.out" }, 0.36);

      // Exit — elements fly up and fade (maps to 76→100% of scroll)
      const exitTargets = [badge.current, title.current, subtitle.current, search.current, cta.current].filter(Boolean);
      if (exitTargets.length)
        tl.to(exitTargets, { opacity: 0, y: -30, stagger: 0.012, duration: 0.22, ease: "power2.in" }, 0.76);
      if (card.current)
        tl.to(card.current, { opacity: 0, x: 32, scale: 0.95, duration: 0.22, ease: "power2.in" }, 0.78);
    };

    // Wait for video metadata so we have a valid duration
    if (videoEl.readyState >= 1) {
      setup();
    } else {
      videoEl.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      videoEl.removeEventListener("loadedmetadata", setup);
      triggers.forEach(t => t.kill());
    };
  }, [enabled]); // Refs are stable objects — no need to list them
}
