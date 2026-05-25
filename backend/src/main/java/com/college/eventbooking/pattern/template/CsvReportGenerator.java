package com.college.eventbooking.pattern.template;

public class CsvReportGenerator extends ReportGenerator {
    @Override
    protected String formatData(String rawData) {
        // Convert the string into CSV format
        return rawData.replace("Total Events: ", "Events,")
                      .replace(", Total Tickets Sold: ", "\nTickets Sold,");
    }

    @Override
    protected String exportReport(String formattedData) {
        return "--- CSV REPORT START ---\n" + formattedData + "\n--- CSV REPORT END ---";
    }
}
