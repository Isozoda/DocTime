const express = require('express');
const router = express.Router();

const DEMO_SCROLL_DOCTORS = [
  { id: "d1", name: "Dr. Sarah Mitchell", spec: "Cardiologist", rating: 4.9, reviews: 312, price: "120", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", city: "Dushanbe", slots: ["09:00","11:30","14:30"] },
  { id: "d2", name: "Dr. Kamol Nazarov", spec: "Neurologist", rating: 4.8, reviews: 217, price: "100", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80", city: "Khujand", slots: ["10:00","13:00","16:00"] },
  { id: "d3", name: "Dr. Lena Rakhimova", spec: "Pediatrician", rating: 5.0, reviews: 489, price: "90", photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80", city: "Dushanbe", slots: ["08:30","12:00","15:30"] },
  { id: "d4", name: "Dr. Aleksei Petrov", spec: "Orthopedist", rating: 4.7, reviews: 156, price: "110", photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80", city: "Bokhtar", slots: ["11:00","14:00","17:00"] },
  { id: "d5", name: "Dr. Nilufar Odinaeva", spec: "Gynecologist", rating: 4.9, reviews: 344, price: "95", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80", city: "Dushanbe", slots: ["09:30","12:30","16:30"] },
  { id: "d6", name: "Dr. Timur Rashidov", spec: "Dermatologist", rating: 4.8, reviews: 201, price: "85", photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80", city: "Khujand", slots: ["10:30","13:30","17:30"] },
  { id: "d7", name: "Dr. Elena Koroleva", spec: "Ophthalmologist", rating: 4.9, reviews: 278, price: "105", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", city: "Dushanbe", slots: ["09:00","14:00","16:00"] },
  { id: "d8", name: "Dr. Bahodir Yusupov", spec: "ENT", rating: 4.7, reviews: 132, price: "80", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80", city: "Bokhtar", slots: ["10:00","13:00","15:00"] },
];

const DEMO_CLINICS = [
  { id: "c1", name: "Central Medical Center", city: "Dushanbe", specs: ["Cardiology","Neurology","Orthopedics"], rating: 4.8, doctors: 32, color: "#6366F1" },
  { id: "c2", name: "Khujand Health Hub", city: "Khujand", specs: ["Pediatrics","Gynecology","Dentistry"], rating: 4.7, doctors: 18, color: "#8B5CF6" },
  { id: "c3", name: "MedCenter Plus", city: "Dushanbe", specs: ["Dermatology","Ophthalmology","ENT"], rating: 4.9, doctors: 24, color: "#22D3EE" },
  { id: "c4", name: "Bokhtar Clinic", city: "Bokhtar", specs: ["Therapy","Urology","Endocrinology"], rating: 4.6, doctors: 14, color: "#10B981" },
  { id: "c5", name: "Avicenna Medical", city: "Dushanbe", specs: ["Psychiatry","Gastro","Oncology"], rating: 4.8, doctors: 28, color: "#F59E0B" },
  { id: "c6", name: "Ibn Sino Clinic", city: "Khujand", specs: ["Cardiology","Pediatrics","Surgery"], rating: 4.7, doctors: 21, color: "#EC4899" },
  { id: "c7", name: "Shifo Clinic", city: "Dushanbe", specs: ["Dentistry","Orthopedics","Therapy"], rating: 4.5, doctors: 12, color: "#06B6D4" },
  { id: "c8", name: "Kulob City Hospital", city: "Kulob", specs: ["Surgery","Traumatology","Neurology"], rating: 4.4, doctors: 45, color: "#EF4444" },
  { id: "c9", name: "Sino Medical Center", city: "Dushanbe", specs: ["Gynecology","Pediatrics","ENT"], rating: 4.9, doctors: 19, color: "#F97316" },
  { id: "c10", name: "Hisor Family Health", city: "Hisor", specs: ["Therapy","Pediatrics","Cardiology"], rating: 4.6, doctors: 8, color: "#84CC16" },
];

const DEMO_REVIEWS = [
  { id: "r1", name: "Zulfiya Rahimova", city: "Dushanbe", text: "Found an excellent cardiologist in minutes. The booking process was incredibly simple and fast. Highly recommend DocTime!", rating: 5, doctor: "Dr. Sarah Mitchell", avatar: "ZR" },
  { id: "r2", name: "Behruz Nazarov", city: "Khujand", text: "Booked a pediatrician for my daughter same day. The doctor was amazing and the whole experience was seamless.", rating: 5, doctor: "Dr. Lena Rakhimova", avatar: "BN" },
  { id: "r3", name: "Malika Toshmatova", city: "Bokhtar", text: "Very convenient to compare doctors and read reviews before making a decision. Great platform!", rating: 4, doctor: "Dr. Aleksei Petrov", avatar: "MT" },
  { id: "r4", name: "Dilnoza Yusupova", city: "Dushanbe", text: "The best healthcare platform in Tajikistan. I use DocTime for all my medical appointments now.", rating: 5, doctor: "Dr. Nilufar Odinaeva", avatar: "DY" },
  { id: "r5", name: "Sardor Mirzaev", city: "Khujand", text: "Fast, reliable and easy to use. Found the perfect neurologist within minutes. 10/10 experience!", rating: 5, doctor: "Dr. Kamol Nazarov", avatar: "SM" },
  { id: "r6", name: "Feruza Karimova", city: "Dushanbe", text: "DocTime saved me so much time! No more waiting on phone calls. Just click and book!", rating: 5, doctor: "Dr. Elena Koroleva", avatar: "FK" },
];

router.get('/doctors', (req, res) => {
  res.json({ success: true, data: DEMO_SCROLL_DOCTORS });
});

router.get('/clinics', (req, res) => {
  res.json({ success: true, data: DEMO_CLINICS });
});

router.get('/reviews', (req, res) => {
  res.json({ success: true, data: DEMO_REVIEWS });
});

module.exports = router;
