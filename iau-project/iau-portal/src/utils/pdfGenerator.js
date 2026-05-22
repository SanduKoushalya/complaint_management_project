import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateComplaintPDF(formData, crn, submittedAt) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const margin = 18;

  // ── Colour palette ──────────────────────────────────────────
  const NAVY  = [27,  63, 143];
  const GREEN = [76, 183,  72];
  const CYAN  = [0,  181, 226];
  const WHITE = [255,255,255];
  const LIGHT = [240,244,253];

  // ── Header bar ──────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 28, 'F');

  // Gradient accent stripe (approximated with 3 rects)
  doc.setFillColor(...NAVY);  doc.rect(0, 25, W * 0.33, 3, 'F');
  doc.setFillColor(...CYAN);  doc.rect(W * 0.33, 25, W * 0.33, 3, 'F');
  doc.setFillColor(...GREEN); doc.rect(W * 0.66, 25, W * 0.34, 3, 'F');

  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('SRI LANKA TELECOM PLC (SLTMOBITEL)', margin, 11);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Internal Affairs Unit (IAU) — Complaint & Concern Reporting Portal', margin, 18);

  // Confidential tag top-right
  doc.setFillColor(220,38,38);
  doc.roundedRect(W - margin - 24, 6, 26, 8, 1, 1, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIDENTIAL', W - margin - 22, 11.5);

  // ── CRN box ─────────────────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.roundedRect(margin, 34, W - margin * 2, 18, 2, 2, 'F');
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, 34, W - margin * 2, 18, 2, 2, 'S');

  doc.setTextColor(...NAVY);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPLAINT REFERENCE NUMBER', margin + 6, 41);

  doc.setFontSize(14);
  doc.setFont('courier', 'bold');
  doc.text(crn, margin + 6, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100,116,139);
  const dt = submittedAt
    ? new Date(submittedAt).toLocaleString('en-GB', { dateStyle:'long', timeStyle:'short' })
    : new Date().toLocaleString('en-GB', { dateStyle:'long', timeStyle:'short' });
  doc.text(`Submitted: ${dt}`, W - margin - 6, 41, { align: 'right' });
  doc.text(`Status: Submitted`, W - margin - 6, 48, { align: 'right' });

  let y = 60;

  // ── Section helper ───────────────────────────────────────────
  const section = (title, rows) => {
    if (y > 250) { doc.addPage(); y = 20; }

    // Section header
    doc.setFillColor(...NAVY);
    doc.rect(margin, y, W - margin * 2, 7, 'F');
    doc.setTextColor(...WHITE);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin + 4, y + 5);
    y += 10;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [],
      body: rows.filter(r => r[1] && r[1] !== ''),
      styles: {
        fontSize: 8.5,
        cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
        lineColor: [226,232,240],
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [71,85,105], cellWidth: 52, fillColor: [248,250,252] },
        1: { textColor: [30,41,59], fillColor: [255,255,255] },
      },
      alternateRowStyles: { fillColor: [255,255,255] },
      didParseCell: (data) => {
        if (data.column.index === 0) data.cell.styles.fillColor = [248,250,252];
      },
    });

    y = doc.lastAutoTable.finalY + 8;
  };

  // ── Sections ────────────────────────────────────────────────
  section('Section 1 — Reporter Information', [
    ['Submission Type',   formData.submissionType],
    ['Reporter Category', formData.reporterCategory],
    ['Full Name',         formData.submissionType === 'Anonymous' ? 'Anonymous' : (formData.fullName || '—')],
    ['Staff ID',          formData.staffId || '—'],
    ['Division / Dept',   formData.division || '—'],
    ['Designation',       formData.designation || '—'],
    ['Contact Email',     formData.submissionType === 'Anonymous' ? 'Not provided' : (formData.contactEmail || '—')],
    ['Contact Tel',       formData.submissionType === 'Anonymous' ? 'Not provided' : (formData.contactTel || '—')],
    ['Preferred Contact', formData.preferredContact || '—'],
  ]);

  section('Section 2 — Complaint / Concern Details', [
    ['Complaint Category',   formData.category],
    ['Date From',            formData.dateFrom],
    ['Date To',              formData.dateTo || '—'],
    ['Location / Division',  formData.location],
    ['Frequency',            formData.frequency],
    ['How Became Aware',     formData.awarenessMethod],
    ['Previously Reported',  formData.previouslyReported],
    ['Previous Details',     formData.previousReportDetails || '—'],
    ['Description',          formData.description],
  ]);

  section('Section 3 — Subject(s) of the Complaint', [
    ['Subject Name(s)',      formData.subjectNames || '—'],
    ['Designation / Role',   formData.subjectDesignation || '—'],
    ['Organisation',         formData.subjectOrg || '—'],
    ['Relationship',         formData.subjectRelationship || '—'],
    ['Involves Senior Mgmt', formData.seniorManagement],
    ['Senior Names',         formData.seniorNames || '—'],
  ]);

  section('Section 4 — Supporting Evidence', [
    ['Has Evidence',     formData.hasEvidence],
    ['Evidence Types',   (formData.evidenceTypes || []).join(', ') || '—'],
    ['Uploaded Files',   (formData.files || []).map(f => f.name).join(', ') || 'None'],
    ['Witnesses',        formData.witnesses || '—'],
    ['Additional Info',  formData.additionalInfo || '—'],
  ]);

  // ── Declaration ─────────────────────────────────────────────
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFillColor(...NAVY);
  doc.rect(margin, y, W - margin * 2, 7, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 5 — DECLARATION', margin + 4, y + 5);
  y += 12;

  doc.setFillColor(...LIGHT);
  doc.rect(margin, y, W - margin * 2, 22, 'F');
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, W - margin * 2, 22, 'S');
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(1);
  doc.line(margin, y, margin, y + 22);

  doc.setTextColor(51,65,85);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const declText = 'I hereby confirm that the information provided is, to the best of my knowledge, true and accurate. I understand that deliberate or malicious false reports are treated seriously and may result in disciplinary action.';
  doc.text(doc.splitTextToSize(declText, W - margin * 2 - 10), margin + 5, y + 7);
  y += 28;

  // ── Footer on every page ─────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(248,250,252);
    doc.rect(0, pageH - 12, W, 12, 'F');
    doc.setDrawColor(226,232,240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageH - 12, W - margin, pageH - 12);
    doc.setTextColor(148,163,184);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`SLTMobitel IAU · ${crn} · CONFIDENTIAL`, margin, pageH - 5);
    doc.text(`Page ${i} of ${totalPages}`, W - margin, pageH - 5, { align: 'right' });
  }

  doc.save(`${crn}_IAU_Complaint.pdf`);
}
