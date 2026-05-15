"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Alisher Karimov",
    role: "CEO & Co-Founder",
    bio: "Former healthcare administrator with 12 years experience. Built DocTime to bridge the gap between patients and quality doctors across Tajikistan.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    skills: ["Strategy", "Healthcare", "Leadership"],
    color: "#6366F1",
    city: "Dushanbe",
  },
  {
    name: "Dilnoza Rakhimova",
    role: "Medical Director",
    bio: "Board-certified physician with 15 years clinical experience. Oversees doctor verification, quality standards, and medical content.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    skills: ["Clinical", "Quality", "Standards"],
    color: "#8B5CF6",
    city: "Dushanbe",
  },
  {
    name: "Ravshan Toshmatov",
    role: "Chief Technology Officer",
    bio: "Full-stack engineer and system architect. Built the secure, HIPAA-aligned data infrastructure that powers DocTime at scale.",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    skills: ["Backend", "Security", "AI/ML"],
    color: "#10B981",
    city: "Khujand",
  },
  {
    name: "Nilufar Nazarova",
    role: "Head of Partnerships",
    bio: "Relationship builder who signed DocTime's first 50 hospital partnerships. Growing our network city by city across Central Asia.",
    image: "https://randomuser.me/api/portraits/women/62.jpg",
    skills: ["Partnerships", "Growth", "Operations"],
    color: "#F59E0B",
    city: "Dushanbe",
  },
];

const SOCIAL_ICONS = [Linkedin, Twitter, Github];

export function TeamSection() {
  return (
    <section
      id="team"
      className="py-24 px-4 relative overflow-hidden bg-muted/20 border-y border-border/50"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 100%, color-mix(in oklch, var(--secondary), transparent 95%) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4">OUR TEAM</div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The People{" "}
            <span className="gradient-text-indigo">Behind DocTime</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A diverse group of doctors, engineers, and operators united by one
            goal: better healthcare for every person in Tajikistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group glass-card rounded-3xl overflow-hidden transition-all duration-500"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 30px 60px rgba(0,0,0,0.2), 0 0 40px ${member.color}12`;
                e.currentTarget.style.borderColor = `${member.color}25`;
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.transform = "";
              }}
            >
              {/* Photo */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366F1&color=fff&size=200&bold=true`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                {/* Color accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px]"
                  style={{
                    background: `linear-gradient(90deg, ${member.color}, ${member.color}60)`,
                  }}
                />
                {/* City badge */}
                <div className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-bold bg-black/40 backdrop-blur-sm border border-white/10 text-white/80">
                  {member.city}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h5 className="text-lg font-bold text-foreground mb-0.5">{member.name}</h5>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ color: member.color }}
                >
                  {member.role}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                  {member.bio}
                </p>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${member.color}12`,
                        border: `1px solid ${member.color}25`,
                        color: member.color,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social links */}
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  {SOCIAL_ICONS.map((Icon, i) => (
                    <button
                      key={i}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all border border-transparent bg-muted/50 hover:bg-primary/10 hover:border-primary/20"
                    >
                      <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
