package com.college.eventbooking.pattern.template;

public class PdfReportGenerator extends ReportGenerator {
    @Override
    protected String formatData(String rawData) {
        // Format for PDF layout
        return "==== EVENT STATISTICS ====\n" + rawData + "\n==========================";
    }

    @Override
    protected String exportReport(String formattedData) {
        return "--- PDF GENERATED ---\n" + formattedData + "\n---------------------";
    }
}
