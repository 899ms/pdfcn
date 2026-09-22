import { PdfList } from "@/registry/bases/takumi/components/list/list";
import { PageFooter } from "@/registry/bases/takumi/components/page-footer/page-footer";
import { PageHeader } from "@/registry/bases/takumi/components/page-header/page-header";
import { Section } from "@/registry/bases/takumi/components/section/section";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/registry/bases/takumi/components/table/table";
import { Text } from "@/registry/bases/takumi/components/text/text";
import {
  PdfcnThemeProvider,
  usePdfcnTheme,
} from "@/registry/bases/takumi/components/theme-provider";
import {
  Document,
  Page,
  StyleSheet,
  View,
} from "@/registry/bases/takumi/lib/pdf-primitives";
import type { PdfcnTheme } from "@/registry/types/pdf-themes";

import type { LessonPlanData } from "./lesson-plan.types";

// Sample data — replace with your own props or data source
const sampleData: LessonPlanData = {
  accentColor: "#7c3aed",
  assessment: {
    formative: ["Exit ticket", "Observation", "Guided practice responses"],
    summative: ["Chapter quiz", "Unit assessment"],
  },
  date: "September 15, 2026",
  differentiation: [
    "Provide equation mats for visual learners",
    "Allow calculator use for students with processing difficulties",
    "Offer extension problems for advanced learners",
  ],
  duration: "50 minutes",
  essentialQuestion:
    "How can we represent real-world relationships using linear equations?",
  gradeLevel: "8th Grade",
  homework: "Complete worksheet problems 11-20",
  lessonTitle: "Introduction to Linear Equations",
  materials: ["Graph paper", "Rulers", "Calculator", "Whiteboard markers"],
  objectives: [
    "Define linear equations",
    "Graph linear equations on a coordinate plane",
    "Solve simple linear equations",
  ],
  reflection:
    "Note student misconceptions during independent practice and adjust the warm-up for the next lesson.",
  sequence: [
    {
      activity: "Warm-up",
      description: "Review solving one-step equations",
      notes: "5 problems on the board",
      time: "5 min",
    },
    {
      activity: "Introduction",
      description: "Define linear equations, show examples",
      notes: "Use real-world context",
      time: "10 min",
    },
    {
      activity: "Guided Practice",
      description: "Work through 3 examples together",
      notes: "Check for understanding",
      time: "15 min",
    },
    {
      activity: "Independent Practice",
      description: "Complete worksheet problems 1-10",
      notes: "Circulate and support",
      time: "15 min",
    },
    {
      activity: "Closure",
      description: "Exit ticket: solve one linear equation",
      notes: "Collect before dismissal",
      time: "5 min",
    },
  ],
  standards: ["CCSS.MATH.8.EE.B.6", "CCSS.MATH.8.EE.C.7"],
  subject: "Mathematics",
  teacherName: "Ms. Johnson",
  topic: "Linear Equations",
};

const LessonPlanContent = ({ data }: { data: LessonPlanData }) => {
  const theme = usePdfcnTheme();

  const styles = StyleSheet.create({
    col: {
      flex: 1,
      paddingRight: 10,
    },
    label: {
      fontSize: 9,
      fontWeight: "bold",
      marginBottom: 2,
    },
    page: {
      backgroundColor: theme.colors.background,
      boxSizing: "border-box",
      minHeight: 841,
      padding: theme.spacing.page.marginTop,
      paddingBottom: theme.spacing.page.marginBottom,
      position: "relative",
    },
    row: {
      flexDirection: "row",
    },
    section: {
      marginBottom: theme.spacing.componentGap,
    },
  });

  return (
    <Document title={`${data.lessonTitle} — Lesson Plan`}>
      <Page size="A4" style={styles.page}>
        <PageHeader
          title={data.lessonTitle}
          subtitle={`${data.subject} \u2022 ${data.gradeLevel}`}
          rightText={`Teacher: ${data.teacherName}`}
          rightSubText={`Date: ${data.date}`}
          style={styles.section}
        />

        <Section spacing="none" style={{ ...styles.row, ...styles.section }}>
          <View style={styles.col}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Duration
            </Text>
            <Text noMargin variant="xs">
              {data.duration}
            </Text>
          </View>
          <View style={styles.col}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Topic
            </Text>
            <Text noMargin variant="xs">
              {data.topic}
            </Text>
          </View>
          {data.essentialQuestion ? (
            <View style={{ flex: 2 }}>
              <Section
                variant="highlight"
                accentColor={data.accentColor}
                spacing="sm"
                style={{ margin: 0 }}
              >
                <Text
                  style={styles.label}
                  color="mutedForeground"
                  transform="uppercase"
                  noMargin
                >
                  Essential Question
                </Text>
                <Text noMargin variant="xs">
                  {data.essentialQuestion}
                </Text>
              </Section>
            </View>
          ) : null}
        </Section>

        <Section spacing="none" style={styles.section}>
          <Text
            style={styles.label}
            color="mutedForeground"
            transform="uppercase"
            noMargin
          >
            Objectives
          </Text>
          <PdfList
            variant="bullet"
            gap="xs"
            items={data.objectives.map((o) => ({ text: `SWBAT ${o}` }))}
          />
        </Section>

        {data.standards ? (
          <Section spacing="none" style={styles.section}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Standards
            </Text>
            <PdfList
              variant="bullet"
              gap="xs"
              items={data.standards.map((s) => ({ text: s }))}
            />
          </Section>
        ) : null}

        <Section spacing="none" style={styles.section}>
          <Text
            style={styles.label}
            color="mutedForeground"
            transform="uppercase"
            noMargin
          >
            Materials
          </Text>
          <PdfList
            variant="bullet"
            gap="xs"
            items={data.materials.map((m) => ({ text: m }))}
          />
        </Section>

        <PageFooter
          leftText={`${data.subject} — ${data.lessonTitle}`}
          rightText="Page 1 of 2"
          sticky
          pagePadding={25}
        />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section spacing="none" style={styles.section}>
          <Text
            style={styles.label}
            color="mutedForeground"
            transform="uppercase"
            noMargin
          >
            Lesson Sequence
          </Text>
          <Table variant="grid" zebraStripe>
            <TableHeader>
              <TableRow header>
                <TableCell>Time</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.sequence.map((item, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: sequence items have no stable id
                <TableRow key={index}>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.activity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.notes ?? ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {data.differentiation ? (
          <Section spacing="none" style={styles.section}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Differentiation
            </Text>
            <PdfList
              variant="bullet"
              gap="xs"
              items={data.differentiation.map((d) => ({ text: d }))}
            />
          </Section>
        ) : null}

        <Section
          noWrap
          spacing="none"
          style={{ ...styles.row, ...styles.section }}
        >
          <View style={styles.col}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Formative Assessment
            </Text>
            {data.assessment.formative ? (
              <PdfList
                variant="bullet"
                gap="xs"
                items={data.assessment.formative.map((a) => ({ text: a }))}
              />
            ) : (
              <Text noMargin variant="xs" color="mutedForeground">
                None
              </Text>
            )}
          </View>
          <View style={styles.col}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Summative Assessment
            </Text>
            {data.assessment.summative ? (
              <PdfList
                variant="bullet"
                gap="xs"
                items={data.assessment.summative.map((a) => ({ text: a }))}
              />
            ) : (
              <Text noMargin variant="xs" color="mutedForeground">
                None
              </Text>
            )}
          </View>
        </Section>

        {data.homework ? (
          <Section spacing="none" style={styles.section}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Homework
            </Text>
            <Text noMargin variant="xs">
              {data.homework}
            </Text>
          </Section>
        ) : null}

        {data.reflection ? (
          <Section spacing="none" style={styles.section}>
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Reflection Notes
            </Text>
            <Text noMargin variant="xs">
              {data.reflection}
            </Text>
          </Section>
        ) : null}

        <PageFooter
          leftText={`${data.teacherName}`}
          rightText="Page 2 of 2"
          sticky
          pagePadding={25}
        />
      </Page>
    </Document>
  );
};

export const LessonPlanDocument = ({
  theme,
  data = sampleData,
}: {
  theme?: PdfcnTheme;
  data?: LessonPlanData;
}) => (
  <PdfcnThemeProvider theme={theme}>
    <LessonPlanContent data={data} />
  </PdfcnThemeProvider>
);
