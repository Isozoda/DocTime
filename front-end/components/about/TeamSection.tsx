"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const TEAM_MEMBERS = [
  {
    name: "Dr. Adrian Stone",
    roleKey: "Chief Surgeon & Co-Founder",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRcpy0d8ZiyjK4H0vh_Mm5k7Cdvk9clnGWzvRXul3vQwX3rkn3N_T2nxlxo6JqzKKbEe8t7Ucwf6sHDmcOifcuvzayQ5dFeaZoaliim4KKFmhaV1KiOf5PYzS7Z4HULl8Sbl45zWD3eGd2ZFh6Xn4kJS4LENSIltN95tNic_-iRC9Vnjdm8LHPXWITxuCNX3j3CU-o4xtCmreW6PrNECWLQE7xVmA2O_F0LUa0Z5hNN2iiFJBcxvEHQpdxenqSwujmKxYB5hlFxMB5",
    bio: "Leading the surgical innovation department with over 20 years of experience in robotic-assisted procedures and digital health infrastructure.",
  },
  {
    name: "Dr. Sarah Chen",
    roleKey: "Head of Telemedicine",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp3GxxOS8SJEEJgC-20rdWvT0e6wYrKXahNfj953aQQGPb5Yx7qYCwHMarMC7BNKIw7jlG8sT7CJhmyUhn4tHli9etpPeN_0iY_zQXw7tRHv6CaAeShu6C_J2zI4qPkgvUWsFPQArcCdOBgVsDjPHH0h0plBIpqxLLqYjtHCHWbu-uDZPMp0yIypGTrRmEyN_KIWBbkZhaYd5gNPe7s_dWcr-hEq_i3op4DcW-TabT-WE2fwrrLVen8ksYPzzaovk_c_nDJHIKJGA6",
    bio: "Specializing in remote patient monitoring systems and developing the world's most intuitive virtual consultation interface.",
  },
  {
    name: "Marcus Vane",
    roleKey: "Chief Technical Officer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDccMsf-gtG4qcsBmAiYBnfHfQavhpst8xEWXbPS9keKhAn9bXR_rASOQMgRjTQ5_Ola6plpzrFSFop7F3EbS-enTsQpzjuEIaq21BvPnOSYLZMBG5ezJoMcrPP08jNrWuPAEM3PgLNuaiVetiV7081VsWAIPp0z9PmSaZv3oLgjMpNEgYxex9Qu-thYvJ_jgKBSwF9a_obXn73wgg7mcGRzzDCc5_ip4gPTVn6Axn9gSdGBaj8iyO6vDN1OQxxHb6hO3dI4AmNFpiT",
    bio: "Architect of the DocTime secure data backbone, formerly a lead security engineer at global tech giants.",
  },
];

export function TeamSection() {
  const t = useTranslations("about");

  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            {t("teamTitle")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl"
          >
            {t("teamSubtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-6 group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h5 className="text-2xl font-bold text-foreground mb-1">{member.name}</h5>
              <p className="text-primary font-bold text-sm mb-4 uppercase tracking-wider">{member.roleKey}</p>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
