"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "~/lib/formatting";
import type { ServiceRequestData } from "~/lib/types";
import { calculateTotalCost } from "~/lib/rate-utils";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  mainBorder: {
    border: 2,
    height: "100%",
    padding: 15,
  },
  innerContent: {
    border: 0.5,
    padding: 10,
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderBottom: 1,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  infoSection: {
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    paddingVertical: 2,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  label: {
    width: 100,
    fontWeight: "bold",
    color: "#444",
  },
  value: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  column: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
    borderBottom: 0.5,
    paddingBottom: 4,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalCost: {
    marginTop: 8,
    paddingTop: 4,
    borderTopWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
  },
  serviceDetails: {
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 4,
    marginBottom: 15,
  },
  instructions: {
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 4,
    minHeight: 60,
    marginBottom: 15,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  signatureBlock: {
    width: "45%",
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 4,
  },
  signatureLine: {
    borderBottom: 1,
    marginTop: 15,
    marginBottom: 5,
  },
  footer: {
    marginTop: 15,
    padding: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
    fontSize: 8,
    textAlign: "center",
  },
});

const PDFDocument = ({
  serviceRequest,
}: {
  serviceRequest: ServiceRequestData;
}) => {
  const totalCost = calculateTotalCost(serviceRequest.appliedRateStructure);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.mainBorder}>
          <Text style={styles.header}>MR. WASTE SUBCONTRACTOR AGREEMENT</Text>

          <View style={styles.dateRow}>
            <Text>Date:</Text>
            <View style={styles.dateRow}>
              <Text>{format(new Date(), "yyyy-MM-dd")}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.row}>
              <Text style={styles.label}>Sub Contractor:</Text>
              <Text style={styles.value}>
                {serviceRequest.subcontractor.name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Attention:</Text>
              <Text style={styles.value}>
                {serviceRequest.subcontractor.contact}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone #:</Text>
              <Text style={styles.value}>
                {serviceRequest.subcontractor.phone}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>
                {serviceRequest.subcontractor.email}
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Service Location</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{serviceRequest.customer.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{serviceRequest.address}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Size:</Text>
                <Text style={styles.value}>{serviceRequest.binSize} yards</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Base Rate:</Text>
                <Text style={styles.value}>
                  {formatCurrency(serviceRequest.appliedRateStructure.baseRate)}
                </Text>
              </View>
              {serviceRequest.appliedRateStructure.dumpFee && (
                <View style={styles.row}>
                  <Text style={styles.label}>Dump Fee:</Text>
                  <Text style={styles.value}>
                    {formatCurrency(
                      serviceRequest.appliedRateStructure.dumpFee,
                    )}
                  </Text>
                </View>
              )}
              {serviceRequest.appliedRateStructure.additionalCosts.length >
                0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Additional Costs:</Text>
                  <View style={styles.value}>
                    {serviceRequest.appliedRateStructure.additionalCosts.map(
                      (cost, index) => (
                        <Text key={index} style={styles.costRow}>
                          {cost.name}:{" "}
                          {cost.isPercentage
                            ? `${cost.amount}%`
                            : formatCurrency(cost.amount)}
                        </Text>
                      ),
                    )}
                  </View>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Total Cost:</Text>
                <Text style={styles.value}>{formatCurrency(totalCost)}</Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Invoice To</Text>
              <Text>Mr. Waste Inc.</Text>
              <Text>389 Bronte St N</Text>
              <Text>Milton, ON</Text>
              <Text>L9T 3N7</Text>
              <Text>info@mrwaste.ca</Text>
              <Text>905-845-9240</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Service Type:</Text>
            <Text style={styles.value}>
              {serviceRequest.serviceType === "frontend"
                ? "Front End"
                : "Roll Off"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Material Type:</Text>
            <Text style={styles.value}>{serviceRequest.materialType}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Service Start:</Text>
            <Text style={styles.value}>
              {format(new Date(serviceRequest.scheduledStart), "yyyy-MM-dd")}
            </Text>
          </View>

          {serviceRequest.scheduledRemoval && (
            <View style={styles.row}>
              <Text style={styles.label}>Removal Date:</Text>
              <Text style={styles.value}>
                {format(
                  new Date(serviceRequest.scheduledRemoval),
                  "yyyy-MM-dd",
                )}
              </Text>
            </View>
          )}

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Special Instructions:</Text>
            <View style={{ borderBottom: 1, marginTop: 5 }}>
              <Text>{serviceRequest.specialInstructions || ""}</Text>
            </View>
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <Text>Mr. Waste Inc.</Text>
              <Text style={{ marginTop: 10 }}>Print:</Text>
              <View style={styles.signatureLine} />
              <Text>Signature:</Text>
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureBlock}>
              <Text>Subcontractor</Text>
              <Text style={{ marginTop: 10 }}>Print:</Text>
              <View style={styles.signatureLine} />
              <Text>Signature:</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>

          <View style={styles.footer}>
            <Text>
              Please fill out detail and email back to info@mrwaste.ca
            </Text>
            <Text>
              Mr. Waste Inc. 389 Bronte St N, Milton ON, L9T3N7 905-845-9240
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function PDFDownloadComponent({
  serviceRequest,
}: {
  serviceRequest: ServiceRequestData;
}) {
  return (
    <PDFDownloadLink
      document={<PDFDocument serviceRequest={serviceRequest} />}
      fileName={`agreement-${serviceRequest.id}.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading}>
          <Download className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
