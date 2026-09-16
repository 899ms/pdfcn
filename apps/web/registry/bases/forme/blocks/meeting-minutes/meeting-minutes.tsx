import { Document, Page, StyleSheet, View } from "@formepdf/react";

import { Badge } from "@/registry/bases/forme/components/badge/badge";
import { PdfList } from "@/registry/bases/forme/components/list/list";
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

import type {
  MeetingMinutesActionStatus,
  MeetingMinutesProps,
} from "./meeting-minutes.types";

// Sample data — replace with your own props or data source
const sampleData: MeetingMinutesProps = {
  absent: [{ name: "Casey Wu", role: "QA Lead" }],
  accentColor: "#0891b2",
  actionItems: [
    {
      dueDate: "Sep 19, 2026",
      owner: "Jordan Lee",
      status: "In Progress",
      task: "Create pdfme integration RFC",
    },
    {
      dueDate: "Sep 22, 2026",
      owner: "Sam Patel",
      status: "Not Started",
      task: "Design community page wireframes",
    },
    {
      dueDate: "Sep 26, 2026",
      owner: "Alex Kim",
      status: "Complete",
      task: "Share Q2 outcomes deck with stakeholders",
    },
  ],
  agenda: [
    "Review Q2 outcomes",
    "Q3 feature priorities",
    "Resource allocation",
    "Timeline and milestones",
  ],
  attendees: [
    { name: "Alex Kim", role: "Product Lead" },
    { name: "Jordan Lee", role: "Engineering Lead" },
    { name: "Sam Patel", role: "Design Lead" },
  ],
  date: "September 12, 2026",
  decisions: [
    {
      decision: "Proceed with pdfme as second rendering base",
      number: 1,
      rationale: "Better JSX support",
    },
    {
      decision: "Allocate 2 engineers to PDF module full-time",
      number: 2,
    },
  ],
  discussions: [
    {
      notes: [
        "Shipped 4 of 5 planned features",
        "Customer satisfaction up 12%",
      ],
      speaker: "Alex Kim",
      topic: "Q2 Outcomes",
    },
    {
      notes: [
        "PDF generation module is top priority",
        "Community page scheduled for late Q3",
      ],
      speaker: "Jordan Lee",
      topic: "Q3 Feature Priorities",
    },
  ],
  distributionList: ["product-team@acme.com", "eng-leads@acme.com"],
  guests: ["Riya Shah (Advisor)"],
  location: "Conference Room B / Zoom",
  meetingTitle: "Q3 Product Roadmap Review",
  nextMeeting: {
    agenda: ["Review action items", "pdfme RFC walkthrough"],
    date: "September 19, 2026",
    time: "2:00 PM",
  },
  organizer: "Alex Kim",
  preparedBy: "Alex Kim",
  time: "2:00 PM - 3:30 PM",
};

const STATUS_VARIANT: Record<
  MeetingMinutesActionStatus,
  "success" | "info" | "default"
> = {
  Complete: "success",
  "In Progress": "info",
  "Not Started": "default",
};

const formatAttendee = (a: { name: string; role?: string }) =>
  `${a.name}${a.role ? ` — ${a.role}` : ""}`;

const MeetingMinutesContent = ({ data }: { data: MeetingMinutesProps }) => {
  const theme = usePdfcnTheme();

  const styles = StyleSheet.create({
    columnHeading: {
      fontSize: 9,
      fontWeight: "bold",
      marginBottom: 2,
    },
    discussionTopic: {
      marginBottom: theme.primitives.spacing[2],
    },
    listItem: {
      marginBottom: theme.primitives.spacing[1],
    },
    page: {
      backgroundColor: theme.colors.background,
    },
  });

  const attendeeColumns = [
    { heading: "Attendees", names: data.attendees.map(formatAttendee) },
    ...(data.absent?.length
      ? [{ heading: "Absent", names: data.absent.map(formatAttendee) }]
      : []),
    ...(data.guests?.length ? [{ heading: "Guests", names: data.guests }] : []),
  ];

  return (
    <Document title={`Minutes — ${data.meetingTitle}`}>
      <Page size="A4" margin={{ bottom: 25, left: 56, right: 56, top: 56 }}>
        <PageFooter
          leftText={`Prepared by ${data.preparedBy}`}
          rightText={
            data.distributionList?.length
              ? `Distribution: ${data.distributionList.join(", ")}`
              : undefined
          }
          sticky
          pagePadding={25}
        />
        <View style={styles.page as never}>
          <PageHeader
            variant="simple"
            title={data.meetingTitle}
            subtitle={`${data.location} · Organized by ${data.organizer}`}
            rightText={data.date}
            rightSubText={data.time}
            style={{ marginBottom: 0 }}
          />
          <Section spacing="sm" style={{ flexDirection: "row" }}>
            {attendeeColumns.map((column) => (
              <View key={column.heading} style={{ flex: 1, paddingRight: 15 }}>
                <Text
                  style={styles.columnHeading}
                  color="mutedForeground"
                  transform="uppercase"
                  noMargin
                >
                  {column.heading}
                </Text>
                {column.names.map((name) => (
                  <Text key={name} noMargin variant="xs">
                    {name}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
          <Section spacing="sm">
            <Text
              style={styles.columnHeading}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Agenda
            </Text>
            {data.agenda.map((item, index) => (
              <Text key={item} style={styles.listItem} variant="sm" noMargin>
                {`${index + 1}. ${item}`}
              </Text>
            ))}
          </Section>
          <Section spacing="sm">
            <Text
              style={styles.columnHeading}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Discussion
            </Text>
            {data.discussions.map((discussion) => (
              <View key={discussion.topic} style={styles.discussionTopic}>
                <Text variant="sm" weight="semibold" noMargin>
                  {discussion.topic}
                </Text>
                {discussion.speaker && (
                  <Text variant="xs" color="mutedForeground" noMargin>
                    {`— ${discussion.speaker}`}
                  </Text>
                )}
                <PdfList
                  variant="bullet"
                  gap="xs"
                  items={discussion.notes.map((text) => ({ text }))}
                />
              </View>
            ))}
          </Section>
        </View>
      </Page>
      <Page size="A4" margin={{ bottom: 25, left: 56, right: 56, top: 56 }}>
        <PageFooter
          leftText={`Prepared by ${data.preparedBy}`}
          rightText={
            data.distributionList?.length
              ? `Distribution: ${data.distributionList.join(", ")}`
              : undefined
          }
          sticky
          pagePadding={25}
        />
        <View style={styles.page as never}>
          <Section spacing="sm">
            <Text
              style={styles.columnHeading}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Decisions
            </Text>
            {data.decisions.map((d) => (
              <View key={d.number} style={styles.discussionTopic}>
                <Text variant="sm" weight="semibold" noMargin>
                  {`${d.number}. ${d.decision}`}
                </Text>
                {d.rationale && (
                  <Text variant="xs" color="mutedForeground" noMargin>
                    {d.rationale}
                  </Text>
                )}
              </View>
            ))}
          </Section>
          <Section spacing="sm">
            <Text
              style={styles.columnHeading}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Action Items
            </Text>
            <Table variant="grid" zebraStripe>
              <TableHeader>
                <TableRow header>
                  <TableCell>Task</TableCell>
                  <TableCell align="center">Owner</TableCell>
                  <TableCell align="center">Due Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.actionItems.map((item) => (
                  <TableRow key={item.task}>
                    <TableCell>{item.task}</TableCell>
                    <TableCell align="center">{item.owner}</TableCell>
                    <TableCell align="center">{item.dueDate}</TableCell>
                    <TableCell align="center">
                      <Badge
                        variant={STATUS_VARIANT[item.status]}
                        size="sm"
                        label={item.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>
          {data.nextMeeting && (
            <Section
              spacing="sm"
              variant="highlight"
              accentColor={data.accentColor}
            >
              <Text
                style={styles.columnHeading}
                color="mutedForeground"
                transform="uppercase"
                noMargin
              >
                Next Meeting
              </Text>
              <Text variant="sm" weight="medium" noMargin>
                {`${data.nextMeeting.date} · ${data.nextMeeting.time}`}
              </Text>
              {data.nextMeeting.agenda && (
                <PdfList
                  variant="bullet"
                  gap="xs"
                  items={data.nextMeeting.agenda.map((text) => ({ text }))}
                />
              )}
            </Section>
          )}
        </View>
      </Page>
    </Document>
  );
};

export const MeetingMinutesDocument = ({
  theme,
  data,
  ...props
}: {
  theme?: PdfcnTheme;
  data?: MeetingMinutesProps;
} & Partial<MeetingMinutesProps>) => (
  <PdfcnThemeProvider theme={theme}>
    <MeetingMinutesContent data={{ ...sampleData, ...data, ...props }} />
  </PdfcnThemeProvider>
);
