export interface LessonPlanSequenceItem {
  time: string;
  activity: string;
  description: string;
  notes?: string;
}

export interface LessonPlanAssessment {
  formative?: string[];
  summative?: string[];
}

export interface LessonPlanProps {
  subject: string;
  gradeLevel: string;
  lessonTitle: string;
  date: string;
  teacherName: string;
  duration: string;
  topic?: string;
  essentialQuestion?: string;
  objectives: string[];
  standards?: string[];
  materials: string[];
  sequence: LessonPlanSequenceItem[];
  differentiation?: string[];
  assessment: LessonPlanAssessment;
  homework?: string;
  reflection?: string;
  accentColor?: string;
  renderingBase?: "takumi" | "forme";
}
