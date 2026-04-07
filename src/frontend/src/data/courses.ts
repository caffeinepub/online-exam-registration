export interface CourseItem {
  id: bigint;
  title: string;
  category: string;
  examDate: string;
}

export const CATEGORIES = [
  "All",
  "Professional & Technology",
  "Management & Commerce",
  "Humanities, Arts & Education",
  "SWAYAM Plus",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export const COURSES: CourseItem[] = [
  // Professional & Technology
  {
    id: 1n,
    title: "Python for Data Science",
    category: "Professional & Technology",
    examDate: "15 Jun 2026",
  },
  {
    id: 2n,
    title: "Introduction to Machine Learning",
    category: "Professional & Technology",
    examDate: "20 Jun 2026",
  },
  {
    id: 3n,
    title: "Ethical Hacking",
    category: "Professional & Technology",
    examDate: "25 Jun 2026",
  },
  {
    id: 4n,
    title: "Data Structures and Algorithms",
    category: "Professional & Technology",
    examDate: "30 Jun 2026",
  },
  {
    id: 5n,
    title: "Android Mobile Application Development",
    category: "Professional & Technology",
    examDate: "5 Jul 2026",
  },
  {
    id: 6n,
    title: "Advanced C++",
    category: "Professional & Technology",
    examDate: "10 Jul 2026",
  },
  // Management & Commerce
  {
    id: 7n,
    title: "Financial Accounting and Analysis",
    category: "Management & Commerce",
    examDate: "15 Jul 2026",
  },
  {
    id: 8n,
    title: "Supply Chain Management",
    category: "Management & Commerce",
    examDate: "20 Jul 2026",
  },
  {
    id: 9n,
    title: "Digital Marketing",
    category: "Management & Commerce",
    examDate: "25 Jul 2026",
  },
  {
    id: 10n,
    title: "Direct Tax – Laws and Practice",
    category: "Management & Commerce",
    examDate: "30 Jul 2026",
  },
  {
    id: 11n,
    title: "Organisation Behaviour",
    category: "Management & Commerce",
    examDate: "5 Aug 2026",
  },
  // Humanities, Arts & Education
  {
    id: 12n,
    title: "Academic Writing",
    category: "Humanities, Arts & Education",
    examDate: "10 Aug 2026",
  },
  {
    id: 13n,
    title: "Animation",
    category: "Humanities, Arts & Education",
    examDate: "15 Aug 2026",
  },
  {
    id: 14n,
    title: "Society and Media",
    category: "Humanities, Arts & Education",
    examDate: "20 Aug 2026",
  },
  {
    id: 15n,
    title: "Introduction to Cyber Security",
    category: "Humanities, Arts & Education",
    examDate: "25 Aug 2026",
  },
  {
    id: 16n,
    title: "Early Childhood Care and Education",
    category: "Humanities, Arts & Education",
    examDate: "30 Aug 2026",
  },
  // SWAYAM Plus
  {
    id: 17n,
    title: "AI Engineer",
    category: "SWAYAM Plus",
    examDate: "5 Sep 2026",
  },
  {
    id: 18n,
    title: "Applied Database System Engineering",
    category: "SWAYAM Plus",
    examDate: "10 Sep 2026",
  },
  {
    id: 19n,
    title: "3D Printing and Design",
    category: "SWAYAM Plus",
    examDate: "15 Sep 2026",
  },
  {
    id: 20n,
    title: "Soft Skills and Employability",
    category: "SWAYAM Plus",
    examDate: "20 Sep 2026",
  },
  {
    id: 21n,
    title: "Science of Yoga",
    category: "SWAYAM Plus",
    examDate: "25 Sep 2026",
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Professional & Technology": "bg-blue-100 text-blue-700",
  "Management & Commerce": "bg-orange-100 text-orange-700",
  "Humanities, Arts & Education": "bg-purple-100 text-purple-700",
  "SWAYAM Plus": "bg-green-100 text-green-700",
};
