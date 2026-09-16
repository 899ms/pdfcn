import { PdfImage } from "@/registry/bases/takumi/components/pdf-image/pdf-image";
import { PdfQRCode } from "@/registry/bases/takumi/components/qrcode/qrcode";
import { Text } from "@/registry/bases/takumi/components/text/text";
import {
  PdfcnThemeProvider,
  usePdfcnTheme,
} from "@/registry/bases/takumi/components/theme-provider";
import {
  View,
  StyleSheet,
  Document,
  Page,
} from "@/registry/bases/takumi/lib/pdf-primitives";
import { resolveColor } from "@/registry/bases/takumi/lib/resolve-color";
import type { PdfcnTheme } from "@/registry/types/pdf-themes";

import type {
  ShippingLabelAddress,
  ShippingLabelData,
} from "./shipping-label.types";

// Sample data — replace with your own props or data source
const sampleData: ShippingLabelData = {
  carrier: "UPS",
  dimensions: '12" x 8" x 6"',
  from: {
    address: "456 Industrial Blvd",
    city: "Los Angeles",
    country: "USA",
    name: "ACME Corporation",
    state: "CA",
    zip: "90001",
  },
  handlingLabels: ["FRAGILE", "THIS SIDE UP"],
  packageCount: 1,
  postage: "$18.40",
  serviceLevel: "Ground",
  to: {
    address: "123 Main Street, Apt 4B",
    city: "New York",
    country: "USA",
    name: "John Doe",
    phone: "(503) 555-0142",
    state: "NY",
    zip: "10001",
  },
  trackingNumber: "TRACK123456789US",
  weight: "2.5 kg",
};

// Standard 4" x 6" shipping label, expressed in PDF points (72 dpi)
const LABEL_SIZE = { height: 432, width: 288 };

const formatCityLine = (party: ShippingLabelAddress) => {
  const cityStateZip = `${party.city}, ${party.state} ${party.zip}`;
  return party.country ? `${cityStateZip}, ${party.country}` : cityStateZip;
};

const formatStreetLine = (party: ShippingLabelAddress) => party.address;

// Shared address block — same treatment for both parties (10pt, bold name)
const AddressLines = ({
  party,
}: {
  party: ShippingLabelAddress & { phone?: string };
}) => (
  <>
    <Text noMargin variant="xs" weight="bold">
      {party.name}
    </Text>
    <Text noMargin variant="xs">
      {formatStreetLine(party)}
    </Text>
    <Text noMargin variant="xs">
      {formatCityLine(party)}
    </Text>
    {party.phone && (
      <Text noMargin variant="xs" color="mutedForeground">
        {party.phone}
      </Text>
    )}
  </>
);

const ShippingLabelContent = ({ data }: { data: ShippingLabelData }) => {
  const theme = usePdfcnTheme();

  const accent = resolveColor(
    data.accentColor ?? theme.colors.primary,
    theme.colors
  );

  const detailRows = [
    ...(data.weight ? [{ key: "Weight", value: data.weight }] : []),
    ...(data.dimensions ? [{ key: "Dimensions", value: data.dimensions }] : []),
    ...(typeof data.packageCount === "number"
      ? [{ key: "Packages", value: `${data.packageCount}` }]
      : []),
    { key: "Postage", value: data.postage ?? "PAID" },
  ];

  const styles = StyleSheet.create({
    addresses: { flex: 1, flexDirection: "row" },
    badgesRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 8,
    },
    barcodeArea: { alignItems: "center", marginTop: 10 },
    carrierName: { fontSize: 16, fontWeight: "bold" },
    fromColumn: { flex: 1, paddingLeft: 12 },
    handlingTag: {
      alignItems: "center",
      backgroundColor: theme.colors.foreground,
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    handlingTagText: {
      color: theme.colors.background,
      fontSize: 8,
      fontWeight: "bold",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    headerRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    label: {
      borderColor: theme.colors.foreground,
      borderStyle: "solid",
      borderWidth: 2,
      flex: 1,
      padding: 10,
    },
    page: {
      backgroundColor: theme.colors.background,
      boxSizing: "border-box",
      flexDirection: "column",
      height: LABEL_SIZE.height,
      overflow: "hidden",
      padding: 8,
      width: LABEL_SIZE.width,
    },
    rule: {
      backgroundColor: theme.colors.foreground,
      height: 2,
      marginVertical: 6,
    },
    sectionLabel: {
      color: accent,
      fontSize: 8,
      fontWeight: "bold",
      letterSpacing: 1,
      marginBottom: 4,
      textTransform: "uppercase",
    },
    serviceRight: { alignItems: "flex-end" },
    shipToColumn: {
      borderRightColor: theme.colors.foreground,
      borderRightStyle: "solid",
      borderRightWidth: 2,
      flex: 1.4,
      paddingRight: 12,
    },
    table: {
      borderColor: theme.colors.foreground,
      borderStyle: "solid",
      borderWidth: 2,
    },
    tableKey: {
      color: theme.colors.mutedForeground,
      fontSize: 8,
      fontWeight: "bold",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      width: 84,
    },
    tableRow: {
      alignItems: "center",
      borderBottomColor: theme.colors.border,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      flexDirection: "row",
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    tableRowLast: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    tableValue: { flex: 1 },
    trackingText: {
      fontWeight: "bold",
      letterSpacing: 2,
      marginTop: 6,
      textTransform: "uppercase",
    },
  });

  return (
    <Document title={`Shipping Label ${data.trackingNumber}`}>
      <Page size={LABEL_SIZE} style={styles.page}>
        <View style={styles.label}>
          <View style={styles.headerRow}>
            <Text noMargin style={styles.carrierName}>
              {data.carrier}
            </Text>
            <View style={styles.serviceRight}>
              <Text noMargin style={styles.sectionLabel}>
                {data.serviceLevel}
              </Text>
            </View>
          </View>

          <View style={styles.rule} />

          <View style={styles.addresses}>
            <View style={styles.shipToColumn}>
              <Text noMargin style={styles.sectionLabel}>
                Ship To
              </Text>
              <AddressLines party={data.to} />
            </View>
            <View style={styles.fromColumn}>
              <Text noMargin style={styles.sectionLabel}>
                From
              </Text>
              <AddressLines party={data.from} />
            </View>
          </View>

          <View style={styles.rule} />

          <View style={styles.table}>
            {detailRows.map((row, index) => (
              <View
                key={row.key}
                style={
                  index === detailRows.length - 1
                    ? styles.tableRowLast
                    : styles.tableRow
                }
              >
                <Text noMargin style={styles.tableKey}>
                  {row.key}
                </Text>
                <Text noMargin style={styles.tableValue} variant="xs">
                  {row.value}
                </Text>
              </View>
            ))}
          </View>

          {data.handlingLabels && data.handlingLabels.length > 0 && (
            <View style={styles.badgesRow}>
              {data.handlingLabels.map((label, index) => (
                <View key={`${label}-${index}`} style={styles.handlingTag}>
                  <Text noMargin style={styles.handlingTagText}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.barcodeArea}>
            {data.barcodeUrl ? (
              <PdfImage
                fit="contain"
                height={72}
                src={data.barcodeUrl}
                width="100%"
              />
            ) : (
              <PdfQRCode
                backgroundColor="#ffffff"
                color="#000000"
                size={80}
                value={data.trackingNumber}
              />
            )}
            <Text
              noMargin
              style={styles.trackingText}
              variant="xs"
              weight="bold"
            >
              {data.trackingNumber}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const ShippingLabelDocument = ({
  theme,
  data = sampleData,
}: {
  theme?: PdfcnTheme;
  data?: ShippingLabelData;
}) => (
  <PdfcnThemeProvider theme={theme}>
    <ShippingLabelContent data={data} />
  </PdfcnThemeProvider>
);
