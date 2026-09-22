import { PageFooter } from "@/registry/bases/takumi/components/page-footer/page-footer";
import { PageHeader } from "@/registry/bases/takumi/components/page-header/page-header";
import { PdfImage } from "@/registry/bases/takumi/components/pdf-image/pdf-image";
import { Section } from "@/registry/bases/takumi/components/section/section";
import { Text } from "@/registry/bases/takumi/components/text/text";
import {
  PdfcnThemeProvider,
  usePdfcnTheme,
} from "@/registry/bases/takumi/components/theme-provider";
import {
  Document,
  Page,
  StyleSheet,
} from "@/registry/bases/takumi/lib/pdf-primitives";
import type { PdfcnTheme } from "@/registry/types/pdf-themes";

import type { PressReleaseProps } from "./press-release.types";

// Sample data — replace with your own props or data source
const sampleData: PressReleaseProps = {
  accentColor: "#1e40af",
  address: "123 Market St, San Francisco, CA 94103",
  body: [
    "Acme Corp today announced the launch of pdfcn, an open-source React component library for generating professional PDF documents.",
    "pdfcn is designed to work seamlessly with shadcn/ui and follows the same registry-based distribution model, letting developers add print-ready document blocks with a single CLI command.",
  ],
  boilerplate:
    "Acme Corp is a leading provider of developer tools and open-source software.",
  companyName: "Acme Corp",
  date: "September 10, 2026",
  dateline: { city: "San Francisco", state: "CA" },
  headline: "Acme Corp Launches Revolutionary PDF Toolkit for Developers",
  mediaContact: {
    email: "press@acme.com",
    name: "Press Team",
    phone: "(555) 123-4567",
  },
  quotes: [
    {
      author: "Jane Doe",
      text: "We built pdfcn because generating PDFs in React was unnecessarily painful. Now it feels like writing any other component.",
      title: "CTO, Acme Corp",
    },
  ],
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/acme" },
    { platform: "X", url: "https://x.com/acme" },
  ],
  subheadline:
    "New open-source library makes generating professional PDFs in React effortless",
};

const PressReleaseContent = ({ data }: { data: PressReleaseProps }) => {
  const theme = usePdfcnTheme();

  const styles = StyleSheet.create({
    columnHeading: {
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
  });

  return (
    <Document title={`Press Release — ${data.companyName}`}>
      <Page size="A4" style={styles.page}>
        <PageHeader
          variant="logo-left"
          logo={
            data.companyLogo ? (
              <PdfImage src={data.companyLogo} style={{ margin: 0 }} />
            ) : undefined
          }
          title={data.companyName}
          rightText={data.date}
          style={{ marginBottom: 0 }}
        />
        <Section spacing="none">
          <Text
            variant="xs"
            weight="bold"
            transform="uppercase"
            color={data.accentColor ?? "mutedForeground"}
            noMargin
          >
            For Immediate Release
          </Text>
          <Text variant="2xl" weight="bold" noMargin>
            {data.headline}
          </Text>
          {data.subheadline && (
            <Text variant="lg" color="mutedForeground" noMargin>
              {data.subheadline}
            </Text>
          )}
        </Section>
        <Section spacing="none">
          <Text variant="sm" weight="semibold" transform="uppercase" noMargin>
            {`${data.dateline.city}, ${data.dateline.state} — ${data.date}`}
          </Text>
          {data.body.map((paragraph) => (
            <Text key={paragraph.slice(0, 24)} variant="sm">
              {paragraph}
            </Text>
          ))}
        </Section>
        {data.quotes?.map((quote) => (
          <Section
            key={quote.author}
            spacing="sm"
            variant="callout"
            accentColor={data.accentColor}
          >
            <Text variant="base" italic noMargin>
              {`“${quote.text}”`}
            </Text>
            <Text variant="xs" color="mutedForeground" noMargin>
              {`— ${quote.author}, ${quote.title}`}
            </Text>
          </Section>
        ))}
        <Section spacing="sm">
          <Text
            style={styles.columnHeading}
            color="mutedForeground"
            transform="uppercase"
            noMargin
          >
            {`About ${data.companyName}`}
          </Text>
          <Text variant="sm" noMargin>
            {data.boilerplate}
          </Text>
        </Section>
        <Section spacing="none">
          <Text
            style={styles.columnHeading}
            color="mutedForeground"
            transform="uppercase"
            noMargin
          >
            Media Contact
          </Text>
          <Text noMargin variant="xs">
            {data.mediaContact.name}
          </Text>
          <Text noMargin variant="xs">
            {data.mediaContact.email}
          </Text>
          <Text noMargin variant="xs">
            {data.mediaContact.phone}
          </Text>
          {data.mediaContact.website && (
            <Text noMargin variant="xs">
              {data.mediaContact.website}
            </Text>
          )}
        </Section>
        <Text align="center" variant="sm" weight="medium" noMargin>
          ###
        </Text>
        <PageFooter
          leftText={data.address ?? data.companyName}
          rightText={
            data.socialLinks?.length
              ? data.socialLinks.map((link) => link.platform).join(" · ")
              : undefined
          }
          sticky
          pagePadding={25}
        />
      </Page>
    </Document>
  );
};

export const PressReleaseDocument = ({
  theme,
  data,
  ...props
}: {
  theme?: PdfcnTheme;
  data?: PressReleaseProps;
} & Partial<PressReleaseProps>) => (
  <PdfcnThemeProvider theme={theme}>
    <PressReleaseContent data={{ ...sampleData, ...data, ...props }} />
  </PdfcnThemeProvider>
);
