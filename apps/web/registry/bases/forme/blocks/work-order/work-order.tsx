import { Document, Page, StyleSheet, View } from "@formepdf/react";

import { Badge } from "@/registry/bases/forme/components/badge/badge";
import type { BadgeVariant } from "@/registry/bases/forme/components/badge/badge";
import { KeyValue } from "@/registry/bases/forme/components/key-value/key-value";
import { PageFooter } from "@/registry/bases/forme/components/page-footer/page-footer";
import { PageHeader } from "@/registry/bases/forme/components/page-header/page-header";
import { PdfImage } from "@/registry/bases/forme/components/pdf-image/pdf-image";
import { Section } from "@/registry/bases/forme/components/section/section";
import { PdfSignatureBlock } from "@/registry/bases/forme/components/signature/signature";
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

import type { WorkOrderData, WorkOrderPriority } from "./work-order.types";

// Sample data — replace with your own props or data source
const sampleData: WorkOrderData = {
  accentColor: "#ea580c",
  companyName: "FixIt Pro Services",
  customer: {
    accountNumber: "ACC-10234",
    address: "789 Elm St, Austin, TX 78701",
    name: "Riverside Apartments",
    phone: "(512) 555-0199",
  },
  customerNotes: "Please service before end of month lease inspection.",
  date: "September 10, 2026",
  equipment: {
    description: "Commercial Dishwasher",
    location: "Kitchen — Unit 4B",
    makeModel: "Bosch SHP878ZD5N",
    serialNumber: "BSH-2024-88712",
  },
  jobType: "Repair",
  labor: [
    {
      description: "Diagnosis and repair",
      hours: 2.5,
      rate: 95,
      technician: "Mike Torres",
    },
  ],
  parts: [
    {
      description: "Drain Pump Assembly",
      partNumber: "PUMP-001",
      qty: 1,
      unitPrice: 89.99,
    },
    {
      description: "Drain Hose Kit",
      partNumber: "HOSE-012",
      qty: 1,
      unitPrice: 24.5,
    },
  ],
  priority: "High",
  taxRate: 0.0825,
  technician: "Mike Torres",
  technicianNotes:
    "Found clogged drain pump. Replaced pump and hose. Unit tested OK.",
  warrantyInfo: "90-day warranty on parts and labor.",
  workOrderNumber: "WO-2026-0452",
};

const PRIORITY_BADGE_VARIANT: Record<WorkOrderPriority, BadgeVariant> = {
  High: "warning",
  Low: "default",
  Medium: "info",
  Urgent: "destructive",
};

const WorkOrderContent = ({ data }: { data: WorkOrderData }) => {
  const theme = usePdfcnTheme();

  const styles = StyleSheet.create({
    checkbox: {
      borderColor: theme.colors.foreground,
      borderStyle: "solid",
      borderWidth: 1,
      height: 10,
      width: 10,
    },
    checkboxRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 6,
      marginTop: theme.spacing.componentGap,
    },
    col: {
      flex: 1,
      paddingRight: 15,
    },
    label: {
      fontSize: 9,
      fontWeight: "bold",
      marginBottom: 2,
    },
    page: {
      backgroundColor: theme.colors.background,
    },
    row: {
      flexDirection: "row",
    },
    section: {
      marginBottom: theme.spacing.componentGap,
    },
    sectionSpaced: {
      marginBottom: theme.spacing.componentGap,
      marginTop: theme.spacing.componentGap,
    },
    signature: {
      marginBottom: 0,
      marginTop: 0,
    },
  });

  const partsTotal = data.parts.reduce(
    (sum, part) => sum + part.qty * part.unitPrice,
    0
  );
  const laborTotal = data.labor.reduce(
    (sum, item) => sum + item.hours * item.rate,
    0
  );
  const taxRate = data.taxRate ?? 0;
  const tax = (partsTotal + laborTotal) * taxRate;
  const grandTotal = partsTotal + laborTotal + tax;

  return (
    <Document title={`Work Order ${data.workOrderNumber}`}>
      <Page
        margin={{
          bottom: theme.spacing.page.marginBottom,
          left: theme.spacing.page.marginLeft,
          right: theme.spacing.page.marginRight,
          top: theme.spacing.page.marginTop,
        }}
        size="A4"
      >
        <PageFooter
          leftText={data.warrantyInfo}
          rightText="Page 1 of 1"
          sticky
          pagePadding={25}
        />
        <View style={styles.page as never}>
          <PageHeader
            variant="logo-left"
            logo={
              data.companyLogo ? (
                <PdfImage src={data.companyLogo} style={{ margin: 0 }} />
              ) : undefined
            }
            title={data.companyName}
            subtitle="Work Order"
            rightText={`WO #${data.workOrderNumber}`}
            rightSubText={`Date: ${data.date}`}
            style={styles.section}
          />

          <Section
            noWrap
            spacing="none"
            style={{
              ...styles.row,
              ...styles.section,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ alignItems: "center", flexDirection: "row", gap: 8 }}
            >
              <Text
                style={{ fontSize: 9, fontWeight: "bold" }}
                color="mutedForeground"
                transform="uppercase"
                noMargin
              >
                Priority
              </Text>
              <Badge
                label={data.priority}
                variant={PRIORITY_BADGE_VARIANT[data.priority]}
                size="sm"
              />
            </View>
            <Badge label={data.jobType} variant="outline" size="sm" />
          </Section>

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
                Customer
              </Text>
              <Text noMargin variant="xs">
                {data.customer.name}
              </Text>
              <Text noMargin variant="xs">
                {data.customer.address}
              </Text>
              <Text noMargin variant="xs">
                {data.customer.phone}
              </Text>
              {data.customer.email ? (
                <Text noMargin variant="xs">
                  {data.customer.email}
                </Text>
              ) : null}
              {data.customer.accountNumber ? (
                <Text noMargin variant="xs">
                  {`Acct #: ${data.customer.accountNumber}`}
                </Text>
              ) : null}
            </View>
            <View style={styles.col}>
              <Text
                style={styles.label}
                color="mutedForeground"
                transform="uppercase"
                noMargin
              >
                Job Info
              </Text>
              <Text noMargin variant="xs">
                {`Technician: ${data.technician}`}
              </Text>
              <Text noMargin variant="xs">
                {`Job Type: ${data.jobType}`}
              </Text>
            </View>
            <View style={styles.col}>
              <Text
                style={styles.label}
                color="mutedForeground"
                transform="uppercase"
                noMargin
              >
                Equipment
              </Text>
              <Text noMargin variant="xs">
                {data.equipment.description}
              </Text>
              {data.equipment.makeModel ? (
                <Text noMargin variant="xs">
                  {data.equipment.makeModel}
                </Text>
              ) : null}
              {data.equipment.serialNumber ? (
                <Text noMargin variant="xs">
                  {`S/N: ${data.equipment.serialNumber}`}
                </Text>
              ) : null}
              {data.equipment.location ? (
                <Text noMargin variant="xs">
                  {`Location: ${data.equipment.location}`}
                </Text>
              ) : null}
            </View>
          </Section>

          <Section spacing="none">
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Parts Used
            </Text>
            <Table variant="grid" zebraStripe>
              <TableHeader>
                <TableRow header>
                  <TableCell>Part #</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.parts.map((part, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: parts have no stable id
                  <TableRow key={index}>
                    <TableCell>{part.partNumber}</TableCell>
                    <TableCell>{part.description}</TableCell>
                    <TableCell align="center">{`${part.qty}`}</TableCell>
                    <TableCell align="right">{`$${part.unitPrice.toFixed(2)}`}</TableCell>
                    <TableCell align="right">{`$${(part.qty * part.unitPrice).toFixed(2)}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          <Section spacing="none">
            <Text
              style={styles.label}
              color="mutedForeground"
              transform="uppercase"
              noMargin
            >
              Labor
            </Text>
            <Table variant="grid" zebraStripe>
              <TableHeader>
                <TableRow header>
                  <TableCell>Description</TableCell>
                  <TableCell>Technician</TableCell>
                  <TableCell align="center">Hours</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.labor.map((item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: labor entries have no stable id
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.technician}</TableCell>
                    <TableCell align="center">{`${item.hours}`}</TableCell>
                    <TableCell align="right">{`$${item.rate.toFixed(2)}`}</TableCell>
                    <TableCell align="right">{`$${(item.hours * item.rate).toFixed(2)}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          <Section
            noWrap
            spacing="none"
            style={{ ...styles.row, ...styles.section }}
          >
            <View style={{ flex: 1, paddingRight: 15 }}>
              {data.technicianNotes ? (
                <View>
                  <Text
                    style={styles.label}
                    color="mutedForeground"
                    transform="uppercase"
                    noMargin
                  >
                    Technician Notes
                  </Text>
                  <Text noMargin variant="xs">
                    {data.technicianNotes}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={{ marginLeft: "auto", width: 200 }}>
              <KeyValue
                size="sm"
                dividerThickness={1}
                items={[
                  { key: "Parts Total", value: `$${partsTotal.toFixed(2)}` },
                  { key: "Labor Total", value: `$${laborTotal.toFixed(2)}` },
                  {
                    key: `Tax (${(taxRate * 100).toFixed(2)}%)`,
                    value: `$${tax.toFixed(2)}`,
                  },
                  {
                    key: "Grand Total",
                    keyStyle: { fontSize: 12, fontWeight: "bold" },
                    value: `$${grandTotal.toFixed(2)}`,
                    valueStyle: { fontSize: 12, fontWeight: "bold" },
                  },
                ]}
                divided
              />
            </View>
          </Section>

          {data.customerNotes ? (
            <Section spacing="none" style={styles.sectionSpaced}>
              <Text
                style={styles.label}
                color="mutedForeground"
                transform="uppercase"
                noMargin
              >
                Customer Notes
              </Text>
              <Text noMargin variant="xs">
                {data.customerNotes}
              </Text>
            </Section>
          ) : null}

          <Section spacing="none">
            <PdfSignatureBlock
              variant="double"
              signers={[
                { date: data.date, label: "Customer Signature" },
                {
                  date: data.date,
                  label: "Technician Signature",
                  name: data.technician,
                },
              ]}
              style={styles.signature}
            />
            <View style={styles.checkboxRow}>
              <View style={styles.checkbox} />
              <Text noMargin variant="xs">
                Customer approves work performed and charges above
              </Text>
            </View>
          </Section>
        </View>
      </Page>
    </Document>
  );
};

export const WorkOrderDocument = ({
  theme,
  data = sampleData,
}: {
  theme?: PdfcnTheme;
  data?: WorkOrderData;
}) => (
  <PdfcnThemeProvider theme={theme}>
    <WorkOrderContent data={data} />
  </PdfcnThemeProvider>
);
