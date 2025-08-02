"use client";

import { useState } from 'react';
import { Header } from "@/components/header";
import { InternshipList } from "@/components/internship-list";
import type { Internship } from '@/lib/types';

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    company: 'InnovateTech',
    deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    requirements: 'Familiarity with React and Node.js. Enrolled in a CS program.',
    platform: 'LinkedIn',
    postContent: 'We are looking for a talented SWE intern to join our dynamic team. This is a great opportunity to work on cutting-edge projects and learn from experienced engineers.',
    isSaved: true,
    createdAt: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'DataDriven Co.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    requirements: 'Experience with Python, Pandas, and Scikit-learn. Strong statistics background.',
    platform: 'YouTube',
    postContent: 'Check out this amazing opportunity for data science students in my latest video! We are hiring interns for a 3-month paid program. Apply now!',
    isSaved: false,
    createdAt: new Date('2024-07-18T14:30:00Z'),
  },
   {
    id: '3',
    title: 'UX/UI Design Intern',
    company: 'Creative Solutions',
    deadline: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    requirements: 'Portfolio showcasing design projects. Proficiency in Figma and Adobe XD.',
    platform: 'Instagram',
    postContent: 'Swipe up to apply for our UX/UI internship! #design #internship #hiring #uidesign',
    isSaved: false,
    createdAt: new Date('2024-07-21T09:00:00Z'),
  },
  {
    id: '4',
    title: 'Marketing Intern',
    company: 'GrowthHackers Inc.',
    deadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    requirements: 'Excellent communication skills, understanding of social media marketing, basic knowledge of SEO.',
    platform: 'Telegram',
    postContent: 'Join our marketing team as an intern! Learn the ropes of digital marketing and help us grow our brand. Send your CV to careers@growthhackers.com.',
    isSaved: true,
    createdAt: new Date('2024-07-22T11:00:00Z'),
  },
];


export default function Home() {
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  
  const handleAddInternship = (newInternship: Internship) => {
    setInternships(prev => [newInternship, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header onInternshipAdded={handleAddInternship} />
      <main>
        <InternshipList internships={internships} setInternships={setInternships} />
      </main>
    </div>
  );
}
