require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SPECIALIZATIONS = [
  { name: 'Стоматология',      slug: 'Dentist',            description: 'Лечение зубов, дёсен и ротовой полости. Профилактика кариеса, протезирование, хирургия.', icon: 'smile',        color: '#3B82F6' },
  { name: 'Кардиология',       slug: 'Cardiologist',       description: 'Диагностика и лечение заболеваний сердца и сосудов. ЭКГ, эхокардиография, ведение гипертонии.', icon: 'heart',    color: '#EF4444' },
  { name: 'Неврология',        slug: 'Neurologist',        description: 'Заболевания нервной системы: головные боли, инсульт, эпилепсия, остеохондроз.', icon: 'brain',        color: '#8B5CF6' },
  { name: 'Педиатрия',         slug: 'Pediatrician',       description: 'Медицинская помощь детям от рождения до 18 лет. Прививки, рост и развитие, детские болезни.', icon: 'baby',      color: '#10B981' },
  { name: 'Офтальмология',     slug: 'Ophthalmologist',    description: 'Диагностика и коррекция зрения. Лечение глаукомы, катаракты, воспалительных заболеваний глаз.', icon: 'eye',    color: '#06B6D4' },
  { name: 'Гинекология',       slug: 'Gynecologist',       description: 'Женское репродуктивное здоровье. Ведение беременности, планирование семьи, лечение болезней.', icon: 'activity', color: '#EC4899' },
  { name: 'Урология',          slug: 'Urologist',          description: 'Лечение мочеполовой системы у мужчин и женщин. Простатит, цистит, мочекаменная болезнь.', icon: 'droplets',  color: '#F59E0B' },
  { name: 'Дерматология',      slug: 'Dermatologist',      description: 'Кожные заболевания: дерматит, псориаз, акне, грибковые инфекции, аллергии.', icon: 'scan',        color: '#F97316' },
  { name: 'Отоларингология',   slug: 'ENT',                description: 'Лечение уха, горла и носа. Отит, тонзиллит, синусит, снижение слуха.', icon: 'ear',             color: '#14B8A6' },
  { name: 'Терапия',           slug: 'Therapist',          description: 'Общая медицина и первичная медицинская помощь. Грипп, ОРВИ, хронические болезни.', icon: 'stethoscope', color: '#6366F1' },
  { name: 'Ортопедия',         slug: 'Orthopedist',        description: 'Заболевания костей, суставов и позвоночника. Артроз, переломы, сколиоз, плоскостопие.', icon: 'bone',      color: '#84CC16' },
  { name: 'Эндокринология',    slug: 'Endocrinologist',    description: 'Гормональные расстройства, сахарный диабет, заболевания щитовидной железы.', icon: 'activity',    color: '#A855F7' },
  { name: 'Психиатрия',        slug: 'Psychiatrist',       description: 'Диагностика и лечение психических расстройств: депрессия, тревога, шизофрения.', icon: 'brain',       color: '#64748B' },
  { name: 'Гастроэнтерология', slug: 'Gastroenterologist', description: 'Заболевания желудка, кишечника, печени и поджелудочной железы.', icon: 'stethoscope',           color: '#D97706' },
];

const HOSPITALS = [
  { name: 'Национальный медицинский центр Таджикистана', address: 'пр. Рудаки, 59, Душанбе',    city: 'Dushanbe', phone: '+992 37 221-00-01', instagram: 'nmc_tajikistan',      googleMapUrl: 'https://maps.google.com/?q=38.5598,68.7736', imageUrl: null, rating: 4.7, slugs: ['Cardiologist', 'Neurologist', 'Orthopedist', 'Endocrinologist'] },
  { name: 'Клиника «Авиценна»',                          address: 'ул. Айни, 47, Душанбе',       city: 'Dushanbe', phone: '+992 37 227-15-15', instagram: 'avicenna_clinic_tj',  googleMapUrl: 'https://maps.google.com/?q=38.5580,68.7800', imageUrl: null, rating: 4.5, slugs: ['Dentist', 'Gynecologist', 'Pediatrician', 'Dermatologist'] },
  { name: 'Городская клиническая больница №1',           address: 'ул. Бохтар, 12, Душанбе',     city: 'Dushanbe', phone: '+992 37 224-33-00', instagram: null,                  googleMapUrl: 'https://maps.google.com/?q=38.5620,68.7690', imageUrl: null, rating: 4.1, slugs: ['Therapist', 'Urologist', 'ENT', 'Gastroenterologist'] },
  { name: 'МЦ «Шифо»',                                  address: 'ул. Назарова, 8, Худжанд',    city: 'Khujand',  phone: '+992 92 777-11-11', instagram: 'shifo_khujand',       googleMapUrl: 'https://maps.google.com/?q=40.2806,69.6223', imageUrl: null, rating: 4.4, slugs: ['Cardiologist', 'Ophthalmologist', 'ENT', 'Therapist'] },
  { name: 'Медицинский центр «Саломатлик»',              address: 'ул. Гагарина, 5, Бохтар',     city: 'Bokhtar',  phone: '+992 90 888-22-22', instagram: 'salomatlik_medical',  googleMapUrl: 'https://maps.google.com/?q=37.8340,68.7790', imageUrl: null, rating: 4.2, slugs: ['Pediatrician', 'Gynecologist', 'Dermatologist', 'Orthopedist'] },
  { name: 'Стоматологическая клиника «Дент Плюс»',      address: 'пр. Сино, 22, Душанбе',       city: 'Dushanbe', phone: '+992 37 233-99-00', instagram: 'dentplus_dushanbe',   googleMapUrl: 'https://maps.google.com/?q=38.5560,68.7750', imageUrl: null, rating: 4.8, slugs: ['Dentist'] },
];

// 22 doctors covering all specializations across all cities
const DOCTORS = [
  // Existing (preserved)
  { email: 'doctor1@easydoc.tj', name: 'Dr. Farida Karimova',   spec: 'Cardiologist',       city: 'Dushanbe',     rating: 4.8, exp: 12, instagram: 'dr_karimova',      phone: '+992 900 22-22-22', bio: 'Кардиолог с 12-летним опытом. Специализируется на ишемической болезни сердца, аритмиях и артериальной гипертензии. Проводит ЭКГ и эхокардиографию.' },
  { email: 'doctor2@easydoc.tj', name: 'Dr. Rustam Toshmatov',  spec: 'Neurologist',        city: 'Khujand',      rating: 4.6, exp: 8,  instagram: 'dr_toshmatov',     phone: '+992 900 33-33-33', bio: 'Невролог, специализирующийся на головных болях и эпилепсии. Лечит инсульты, нарушения сна и остеохондроз.' },
  // New doctors
  { email: 'doc3@easydoc.tj',  name: 'Dr. Malika Umarova',     spec: 'Dentist',            city: 'Dushanbe',     rating: 4.9, exp: 10, instagram: 'dr_malika_dent',   phone: '+992 900 44-44-44', bio: 'Стоматолог-терапевт и ортопед. Специализируется на эстетической стоматологии, имплантации и протезировании зубов без боли.' },
  { email: 'doc4@easydoc.tj',  name: 'Dr. Shohruh Rakhimov',   spec: 'Cardiologist',       city: 'Dushanbe',     rating: 4.7, exp: 15, instagram: 'dr_shohruh_card',  phone: '+992 900 55-55-55', bio: 'Старший кардиолог НМЦ. Эксперт по сердечной недостаточности, ведению гипертонии и интервенционной кардиологии.' },
  { email: 'doc5@easydoc.tj',  name: 'Dr. Nasiba Yusupova',    spec: 'Neurologist',        city: 'Dushanbe',     rating: 4.8, exp: 9,  instagram: 'dr_nasiba_neuro',  phone: '+992 900 66-66-66', bio: 'Невролог высшей категории. Лечит мигрень, болезнь Паркинсона, рассеянный склероз и сосудистые заболевания мозга.' },
  { email: 'doc6@easydoc.tj',  name: 'Dr. Behruz Rahimov',     spec: 'Pediatrician',       city: 'Dushanbe',     rating: 4.6, exp: 7,  instagram: 'dr_behruz_ped',    phone: '+992 900 77-77-77', bio: 'Педиатр с опытом работы в неонатологии. Ведёт детей от рождения до 18 лет, проводит плановые осмотры и вакцинацию.' },
  { email: 'doc7@easydoc.tj',  name: 'Dr. Zulfiya Nazarova',   spec: 'Ophthalmologist',    city: 'Dushanbe',     rating: 4.5, exp: 12, instagram: 'dr_zulfiya_eye',   phone: '+992 900 88-88-88', bio: 'Офтальмолог-хирург. Проводит лечение глаукомы, катаракты, коррекцию зрения и лазерные операции на сетчатке.' },
  { email: 'doc8@easydoc.tj',  name: 'Dr. Maftuna Tursunova',  spec: 'Gynecologist',       city: 'Bokhtar',      rating: 4.7, exp: 11, instagram: 'dr_maftuna_gyn',   phone: '+992 900 99-99-99', bio: 'Акушер-гинеколог. Ведёт беременность, занимается лечением эндометриоза, миомы матки и СПКЯ.' },
  { email: 'doc9@easydoc.tj',  name: 'Dr. Rustam Mirzoyev',    spec: 'Urologist',          city: 'Khujand',      rating: 4.4, exp: 8,  instagram: 'dr_mirzoyev_uro',  phone: '+992 901 10-10-10', bio: 'Уролог-андролог. Лечит простатит, мочекаменную болезнь, цистит и мужское бесплодие.' },
  { email: 'doc10@easydoc.tj', name: 'Dr. Dilnoza Khasanova',  spec: 'Dermatologist',      city: 'Dushanbe',     rating: 4.8, exp: 6,  instagram: 'dr_dilnoza_skin',  phone: '+992 901 11-11-11', bio: 'Дерматолог-косметолог. Специализируется на акне, псориазе, атопическом дерматите и лазерном лечении.' },
  { email: 'doc11@easydoc.tj', name: 'Dr. Akbar Qodirov',      spec: 'ENT',                city: 'Dushanbe',     rating: 4.5, exp: 14, instagram: 'dr_akbar_ent',     phone: '+992 901 22-22-22', bio: 'Отоларинголог высшей категории. Лечит хронический синусит, тонзиллит, снижение слуха, проводит эндоскопические операции.' },
  { email: 'doc12@easydoc.tj', name: 'Dr. Sabina Ergasheva',   spec: 'Therapist',          city: 'Kulob',        rating: 4.3, exp: 5,  instagram: 'dr_sabina_ther',   phone: '+992 901 33-33-33', bio: 'Врач-терапевт первичной помощи. Лечит ОРВИ, бронхит, пневмонию, ведёт пациентов с хроническими заболеваниями.' },
  { email: 'doc13@easydoc.tj', name: 'Dr. Firdavs Nazarov',    spec: 'Orthopedist',        city: 'Dushanbe',     rating: 4.6, exp: 13, instagram: 'dr_firdavs_ortho', phone: '+992 901 44-44-44', bio: 'Ортопед-травматолог. Лечит артроз, грыжи позвоночника, сколиоз, переломы. Проводит операции на суставах.' },
  { email: 'doc14@easydoc.tj', name: 'Dr. Muhabbat Soliyeva',  spec: 'Endocrinologist',    city: 'Dushanbe',     rating: 4.7, exp: 10, instagram: 'dr_muhabbat_endo', phone: '+992 901 55-55-55', bio: 'Эндокринолог. Специализируется на сахарном диабете, гипотиреозе, заболеваниях надпочечников и ожирении.' },
  { email: 'doc15@easydoc.tj', name: 'Dr. Jahongir Toshev',    spec: 'Psychiatrist',       city: 'Khujand',      rating: 4.2, exp: 9,  instagram: 'dr_jahongir_psy',  phone: '+992 901 66-66-66', bio: 'Психиатр. Диагностирует и лечит депрессию, тревожные расстройства, ОКР, шизофрению. Конфиденциальный приём.' },
  { email: 'doc16@easydoc.tj', name: 'Dr. Barno Rahimova',     spec: 'Gastroenterologist', city: 'Dushanbe',     rating: 4.5, exp: 7,  instagram: 'dr_barno_gastro',  phone: '+992 901 77-77-77', bio: 'Гастроэнтеролог. Лечит гастрит, язвенную болезнь, колит, жировую болезнь печени. Проводит ФГДС и колоноскопию.' },
  { email: 'doc17@easydoc.tj', name: 'Dr. Sardor Karimov',     spec: 'Cardiologist',       city: 'Bokhtar',      rating: 4.6, exp: 11, instagram: 'dr_sardor_card',   phone: '+992 901 88-88-88', bio: 'Кардиолог-реаниматолог. Опыт в лечении инфаркта миокарда, хронической сердечной недостаточности и аритмий.' },
  { email: 'doc18@easydoc.tj', name: 'Dr. Nilufar Davlatova',  spec: 'Gynecologist',       city: 'Dushanbe',     rating: 4.9, exp: 16, instagram: 'dr_nilufar_gyn',   phone: '+992 901 99-99-99', bio: 'Главный гинеколог клиники «Авиценна». Специализируется на бесплодии, ЭКО, ведении беременности высокого риска.' },
  { email: 'doc19@easydoc.tj', name: 'Dr. Umid Jurayev',       spec: 'Dermatologist',      city: 'Kulob',        rating: 4.3, exp: 4,  instagram: 'dr_umid_derm',     phone: '+992 902 11-11-11', bio: 'Молодой дерматолог с современным подходом. Лечит кожные инфекции, грибок, аллергические дерматозы.' },
  { email: 'doc20@easydoc.tj', name: 'Dr. Dildora Sharipova',  spec: 'Pediatrician',       city: 'Khujand',      rating: 4.7, exp: 8,  instagram: 'dr_dildora_ped',   phone: '+992 902 22-22-22', bio: 'Педиатр-инфекционист. Занимается детскими инфекциями, аллергией, нарушениями питания у детей.' },
  { email: 'doc21@easydoc.tj', name: 'Dr. Komiljon Rustamov',  spec: 'Dentist',            city: 'Dushanbe',     rating: 4.8, exp: 12, instagram: 'dr_komil_dent',    phone: '+992 902 33-33-33', bio: 'Стоматолог-хирург. Специализируется на удалении зубов мудрости, имплантации и хирургическом лечении десён.' },
  { email: 'doc22@easydoc.tj', name: 'Dr. Aziza Boymurodova',  spec: 'Neurologist',        city: 'Dushanbe',     rating: 4.5, exp: 6,  instagram: 'dr_aziza_neuro',   phone: '+992 902 44-44-44', bio: 'Невролог, специализирующийся на детской неврологии и нарушениях развития у детей и подростков.' },
  { email: 'doc23@easydoc.tj', name: 'Dr. Otabek Yuldashev',   spec: 'Orthopedist',        city: 'Khujand',      rating: 4.4, exp: 9,  instagram: 'dr_otabek_ortho',  phone: '+992 902 55-55-55', bio: 'Ортопед. Лечит плоскостопие, сколиоз, артрит. Применяет ПРП-терапию и ударно-волновое лечение.' },
  { email: 'doc24@easydoc.tj', name: 'Dr. Gulnora Tursunova',  spec: 'Therapist',          city: 'Dushanbe',     rating: 4.5, exp: 7,  instagram: 'dr_gulnora_ther',  phone: '+992 902 66-66-66', bio: 'Терапевт-кардиолог. Ведёт пациентов с гипертонией, диабетом и комплексными хроническими заболеваниями.' },
  { email: 'doc25@easydoc.tj', name: 'Dr. Jamoliddin Nazarov', spec: 'ENT',                city: 'Bokhtar',      rating: 4.6, exp: 11, instagram: 'dr_jamol_ent',     phone: '+992 902 77-77-77', bio: 'ЛОР-врач. Лечит хронические и острые заболевания уха, горла, носа. Проводит эндоскопическую диагностику.' },
  { email: 'doc26@easydoc.tj', name: 'Dr. Shahnoza Urinova',   spec: 'Ophthalmologist',    city: 'Khujand',      rating: 4.6, exp: 10, instagram: 'dr_shahnoza_eye',  phone: '+992 902 88-88-88', bio: 'Офтальмолог. Лечит близорукость, дальнозоркость, астигматизм, подбирает линзы и очки.' },
  { email: 'doc27@easydoc.tj', name: 'Dr. Parviz Askarov',     spec: 'Urologist',          city: 'Dushanbe',     rating: 4.7, exp: 13, instagram: 'dr_parviz_uro',    phone: '+992 902 99-99-99', bio: 'Уролог-хирург. Специализируется на эндоскопической хирургии почек, лечении рака мочевого пузыря и простаты.' },
  { email: 'doc28@easydoc.tj', name: 'Dr. Lola Komilov',       spec: 'Endocrinologist',    city: 'Khujand',      rating: 4.5, exp: 8,  instagram: 'dr_lola_endo',     phone: '+992 903 11-11-11', bio: 'Эндокринолог. Специализируется на заболеваниях щитовидной железы, диабете и нарушениях обмена веществ.' },
  { email: 'doc29@easydoc.tj', name: 'Dr. Husan Mirzayev',     spec: 'Gastroenterologist', city: 'Khujand',      rating: 4.4, exp: 6,  instagram: 'dr_husan_gastro',  phone: '+992 903 22-22-22', bio: 'Гастроэнтеролог. Диагностирует и лечит заболевания пищевода, желудка, кишечника и поджелудочной железы.' },
  { email: 'doc30@easydoc.tj', name: 'Dr. Mohinur Sobirov',    spec: 'Psychiatrist',       city: 'Dushanbe',     rating: 4.3, exp: 7,  instagram: 'dr_mohinur_psy',   phone: '+992 903 33-33-33', bio: 'Психиатр-психотерапевт. Помогает при депрессии, панических атаках, ПТСР и расстройствах пищевого поведения.' },
];

const SCHEDULE_FULL  = JSON.stringify({ monday: { start: '09:00', end: '17:00' }, tuesday: { start: '09:00', end: '17:00' }, wednesday: { start: '09:00', end: '17:00' }, thursday: { start: '09:00', end: '17:00' }, friday: { start: '09:00', end: '14:00' }, saturday: null, sunday: null });
const SCHEDULE_SHIFT = JSON.stringify({ monday: { start: '10:00', end: '18:00' }, tuesday: { start: '10:00', end: '18:00' }, wednesday: null, thursday: { start: '10:00', end: '18:00' }, friday: { start: '10:00', end: '18:00' }, saturday: { start: '10:00', end: '13:00' }, sunday: null });
const SCHEDULE_SAT   = JSON.stringify({ monday: { start: '08:00', end: '16:00' }, tuesday: { start: '08:00', end: '16:00' }, wednesday: { start: '08:00', end: '16:00' }, thursday: { start: '08:00', end: '16:00' }, friday: { start: '08:00', end: '16:00' }, saturday: { start: '09:00', end: '14:00' }, sunday: null });

async function main() {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.user.upsert({ where: { email: 'admin@easydoc.tj' },   update: {}, create: { name: 'Admin EasyDoc', email: 'admin@easydoc.tj',   password: passwordHash, role: 'admin',   phone: '+992900000000' } });
  await prisma.user.upsert({ where: { email: 'patient@easydoc.tj' }, update: {}, create: { name: 'Ali Nazarov',   email: 'patient@easydoc.tj', password: passwordHash, role: 'patient', phone: '+992900111111' } });

  // Seed doctors
  console.log('\nSeeding doctors...');
  const schedules = [SCHEDULE_FULL, SCHEDULE_SHIFT, SCHEDULE_SAT];
  for (let i = 0; i < DOCTORS.length; i++) {
    const d = DOCTORS[i];
    const userRecord = await prisma.user.upsert({
      where: { email: d.email },
      update: { name: d.name, phone: d.phone },
      create: { name: d.name, email: d.email, password: passwordHash, role: 'doctor', phone: d.phone },
    });
    const docData = {
      specialization: d.spec,
      city: d.city,
      rating: d.rating,
      experience: d.exp,
      bio: d.bio,
      instagram: d.instagram,
      phone: d.phone,
      schedule: schedules[i % 3],
    };
    await prisma.doctor.upsert({
      where: { userId: userRecord.id },
      update: docData,
      create: { userId: userRecord.id, ...docData },
    });
    console.log(`  ✓ ${d.name} — ${d.spec} (${d.city})`);
  }

  // Seed specializations
  console.log('\nSeeding specializations...');
  const specIds = {};
  for (const spec of SPECIALIZATIONS) {
    const s = await prisma.specialization.upsert({
      where: { slug: spec.slug },
      update: { name: spec.name, description: spec.description, icon: spec.icon, color: spec.color },
      create: spec,
    });
    specIds[spec.slug] = s.id;
    console.log(`  ✓ ${spec.name}`);
  }

  // Seed hospitals
  console.log('\nSeeding hospitals...');
  for (const hosp of HOSPITALS) {
    const { slugs, ...hospitalData } = hosp;
    const existing = await prisma.hospital.findFirst({ where: { name: hosp.name } });
    const hospital = existing
      ? await prisma.hospital.update({ where: { id: existing.id }, data: hospitalData })
      : await prisma.hospital.create({ data: hospitalData });

    for (const slug of slugs) {
      const specId = specIds[slug];
      if (!specId) continue;
      await prisma.hospitalSpecialization.upsert({
        where: { hospitalId_specializationId: { hospitalId: hospital.id, specializationId: specId } },
        update: {},
        create: { hospitalId: hospital.id, specializationId: specId },
      });
    }
    console.log(`  ✓ ${hosp.name}`);
  }

  console.log('\nSeed complete! 30 doctors seeded across 14 specializations.');
  console.log('Test credentials (password: Password123!)');
  console.log('  admin@easydoc.tj | patient@easydoc.tj | doctor1@easydoc.tj');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
