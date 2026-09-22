import { Document, Page, StyleSheet, View } from "@formepdf/react";

import { PageFooter } from "@/registry/bases/forme/components/page-footer/page-footer";
import { PageHeader } from "@/registry/bases/forme/components/page-header/page-header";
import { Section } from "@/registry/bases/forme/components/section/section";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/registry/bases/forme/components/table/table";
import { Text } from "@/registry/bases/forme/components/text/text";
import {
  PdfcnThemeProvider,
  usePdfcnTheme,
} from "@/registry/bases/forme/components/theme-provider";
import type { PdfcnTheme } from "@/registry/types/pdf-themes";

import type { LessonPlanProps } from "./lesson-plan.types";

// Sample data — replace with your own props or data source
const sampleData: LessonPlanProps = {
  accentColor: "#7c3aed",
  assessment: {
    formative: ["Exit ticket", "Observation during guided practice"],
    summative: ["Chapter quiz"],
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

const REFLECTION_LINE_KEYS = Array.from(
  { length: 8 },
  (_, line) => `reflection-line-${line}`
);

const COLUMN_WIDTHS = { activity: 104, notes: 140, time: 56 };

const LessonPlanContent = ({ data }: { data: LessonPlanProps }) => {
  const theme = usePdfcnTheme();
  const rule = {
    borderBottomColor: theme.colors.border,
    borderBottomStyle: "solid" as const,
    borderBottomWidth: 1,
  };

  const styles = StyleSheet.create({
    block: {
      marginBottom: 16,
    },
    colHalf: {
      flex: 2,
      paddingRight: 20,
    },
    colQuarter: {
      flex: 1,
      paddingRight: 10,
    },
    infoRow: {
      ...rule,
      flexDirection: "row",
      marginBottom: 16,
      paddingBottom: 12,
    },
    intro: {
      marginBottom: 3,
    },
    label: {
      fontSize: 9,
      fontWeight: "bold",
      marginBottom: 4,
    },
    listMarker: {
      width: 12,
    },
    listRow: {
      flexDirection: "row",
      marginBottom: 3,
    },
    listText: {
      flex: 1,
    },
    page: {
      backgroundColor: theme.colors.background,
    },
    reflectionLine: {
      ...rule,
      height: 24,
    },
    row: {
      flexDirection: "row",
    },
  });

  const pageMargin = {
    bottom: theme.spacing.page.marginBottom,
    left: theme.spacing.page.marginLeft,
    right: theme.spacing.page.marginRight,
    top: theme.spacing.page.marginTop,
  };

  const renderLabel = (label: string) => (
    <Text
      style={styles.label}
      color="mutedForeground"
      transform="uppercase"
      noMargin
    >
      {label}
    </Text>
  );

  const renderList = (items: string[] = [], numbered = false) =>
    items.length > 0 ? (
      items.map((item, index) => (
        <View key={item} style={styles.listRow}>
          <View style={styles.listMarker}>
            <Text variant="xs" color="mutedForeground" noMargin>
              {numbered ? `${index + 1}.` : "•"}
            </Text>
          </View>
          <View style={styles.listText}>
            <Text variant="xs" noMargin>
              {item}
            </Text>
          </View>
        </View>
      ))
    ) : (
      <Text variant="xs" color="mutedForeground" noMargin>
        —
      </Text>
    );

  const info = [
    { label: "Subject", value: data.subject },
    { label: "Grade Level", value: data.gradeLevel },
    { label: "Teacher", value: data.teacherName },
    { label: "Duration", value: data.duration },
  ];

  const footerText = `${data.subject} · ${data.gradeLevel} · ${data.lessonTitle}`;

  return (
    <Document title={`Lesson Plan — ${data.lessonTitle}`}>
      <Page margin={pageMargin} size="A4">
        <PageFooter
          leftText={footerText}
          rightText="Page 1 of 2"
          sticky
          pagePadding={25}
        />
        <View style={styles.page as never}>
          <PageHeader
            variant="simple"
            title={data.lessonTitle}
            subtitle={
              data.topic ? `Lesson Plan · ${data.topic}` : "Lesson Plan"
            }
            rightText={data.date}
            marginBottom={16}
          />

          <View style={styles.infoRow}>
            {info.map((item) => (
              <View key={item.label} style={styles.colQuarter}>
                {renderLabel(item.label)}
                <Text variant="xs" weight="medium" noMargin>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {data.essentialQuestion ? (
            <Section
              variant="highlight"
              accentColor={data.accentColor}
              spacing="none"
              padding="sm"
              style={styles.block}
            >
              {renderLabel("Essential Question")}
              <Text variant="sm" weight="medium" noMargin>
                {data.essentialQuestion}
              </Text>
            </Section>
          ) : null}

          <View style={{ ...styles.row, ...styles.block }}>
            <View style={styles.colHalf}>
              {renderLabel("Objectives")}
              <Text
                variant="xs"
                color="mutedForeground"
                style={styles.intro}
                noMargin
              >
                Students will be able to (SWBAT):
              </Text>
              {renderList(data.objectives, true)}
            </View>
            {data.standards?.length ? (
              <View style={styles.colQuarter}>
                {renderLabel("Standards")}
                {renderList(data.standards)}
              </View>
            ) : null}
            <View style={styles.colQuarter}>
              {renderLabel("Materials")}
              {renderList(data.materials)}
            </View>
          </View>

          <View>
            {renderLabel("Lesson Sequence")}
            <Table variant="grid" zebraStripe>
              <TableHeader>
                <TableRow header>
                  <TableCell width={COLUMN_WIDTHS.time}>Time</TableCell>
                  <TableCell width={COLUMN_WIDTHS.activity}>Activity</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell width={COLUMN_WIDTHS.notes}>Notes</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sequence.map((item) => (
                  <TableRow key={`${item.time}-${item.activity}`}>
                    <TableCell width={COLUMN_WIDTHS.time}>
                      {item.time}
                    </TableCell>
                    <TableCell width={COLUMN_WIDTHS.activity}>
                      {item.activity}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell width={COLUMN_WIDTHS.notes}>
                      {item.notes ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </View>
        </View>
      </Page>

      <Page margin={pageMargin} size="A4">
        <PageFooter
          leftText={footerText}
          rightText="Page 2 of 2"
          sticky
          pagePadding={25}
        />
        <View style={styles.page as never}>
          {data.differentiation?.length ? (
            <View style={styles.block}>
              {renderLabel("Differentiation")}
              {renderList(data.differentiation)}
            </View>
          ) : null}

          <View style={{ ...styles.row, ...styles.block }}>
            <View style={styles.colHalf}>
              {renderLabel("Formative Assessment")}
              {renderList(data.assessment.formative)}
            </View>
            <View style={styles.colHalf}>
              {renderLabel("Summative Assessment")}
              {renderList(data.assessment.summative)}
            </View>
          </View>

          {data.homework ? (
            <View style={styles.block}>
              {renderLabel("Homework")}
              <Text variant="xs" noMargin>
                {data.homework}
              </Text>
            </View>
          ) : null}

          <View>
            {renderLabel("Teacher Reflection")}
            {data.reflection ? (
              <Text variant="xs" noMargin>
                {data.reflection}
              </Text>
            ) : null}
            {REFLECTION_LINE_KEYS.map((key) => (
              <View key={key} style={styles.reflectionLine} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const LessonPlanDocument = ({
  theme,
  data,
  ...props
}: {
  theme?: PdfcnTheme;
  data?: LessonPlanProps;
} & Partial<LessonPlanProps>) => (
  <PdfcnThemeProvider theme={theme}>
    <LessonPlanContent data={{ ...sampleData, ...data, ...props }} />
  </PdfcnThemeProvider>
);
