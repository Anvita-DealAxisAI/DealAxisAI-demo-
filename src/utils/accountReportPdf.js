import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const FONTS = {
  display: 'helvetica',
  body: 'helvetica',
};

const FONT_SIZES = {
  coverTitle: 28,
  sectionHeading: 17,
  subheading: 12.5,
  body: 10,
  tableHeader: 8.5,
  tableBody: 8.5,
  caption: 8,
  kpi: 17,
  footer: 8,
};

const TABLE_HEADER_GREY = [8, 145, 178];
const SECTION_GAP = 10;

function safe(value, fallback = 'TBD') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function formatIsoDate(value) {
  if (!value) return 'TBD';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    const raw = String(value).trim();
    return raw ? raw.slice(0, 10) : 'TBD';
  }
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function summarizeAccountGrowthThesis(account, signals) {
  const summary = signals?.businessSummary ? String(signals.businessSummary).trim() : '';
  if (summary) return summary;
  const about = safe(account?.about, '');
  const strategy = safe(account?.businessStrategy, '');
  return [about, strategy].filter(Boolean).join(' ').slice(0, 1100) || 'Account growth thesis pending analyst curation.';
}

function groupOpportunities(opportunities = []) {
  const groups = {
    'Confirmed Opportunity': [],
    'Inferred Opportunity': [],
    'Strategic Hypothesis Opportunity': [],
    'Watchlist Opportunity': [],
  };
  for (const opp of opportunities) {
    const key = opp?.opportunityClassification || 'Watchlist Opportunity';
    if (!groups[key]) groups[key] = [];
    groups[key].push(opp);
  }
  return groups;
}

function toImageDataUrl(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(image, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL('image/png'),
        width: image.width,
        height: image.height,
      });
    };
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

function addHeader(doc, logoAsset, accountName) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, 18, 'F');
  if (logoAsset?.dataUrl && logoAsset?.width && logoAsset?.height) {
    const maxWidth = 40;
    const maxHeight = 8;
    const aspect = logoAsset.width / logoAsset.height;
    let drawWidth = maxWidth;
    let drawHeight = drawWidth / aspect;
    if (drawHeight > maxHeight) {
      drawHeight = maxHeight;
      drawWidth = drawHeight * aspect;
    }
    doc.addImage(logoAsset.dataUrl, 'PNG', 14, 6, drawWidth, drawHeight);
  } else {
    doc.setTextColor(30, 41, 59);
    doc.setFont(FONTS.body, 'bold');
    doc.setFontSize(FONT_SIZES.body);
    doc.text('AccountSignal AI', 14, 10.5);
  }
  doc.setTextColor(15, 23, 42);
  doc.setFont(FONTS.body, 'normal');
  doc.setFontSize(9);
  doc.text(`${safe(accountName)} Intelligence Report`, pageWidth - 14, 10.5, { align: 'right' });
}

function addCoverPage(doc, logoAsset, accountName, reportDateLabel) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  if (logoAsset?.dataUrl && logoAsset?.width && logoAsset?.height) {
    const maxWidth = 60;
    const maxHeight = 13;
    const aspect = logoAsset.width / logoAsset.height;
    let drawWidth = maxWidth;
    let drawHeight = drawWidth / aspect;
    if (drawHeight > maxHeight) {
      drawHeight = maxHeight;
      drawWidth = drawHeight * aspect;
    }
    doc.addImage(
      logoAsset.dataUrl,
      'PNG',
      (pageWidth - drawWidth) / 2,
      52,
      drawWidth,
      drawHeight,
    );
  } else {
    doc.setFont(FONTS.body, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('AccountSignal AI', pageWidth - 14, 20, { align: 'right' });
  }

  doc.setFont(FONTS.display, 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(FONT_SIZES.coverTitle);
  doc.text('Account Intelliegnce Report', pageWidth / 2, 80, { align: 'center' });

  doc.setFont(FONTS.body, 'bold');
  doc.setFontSize(16.25);
  doc.text(safe(accountName, 'Synovus Bank'), pageWidth / 2, 94, { align: 'center' });

  doc.setFont(FONTS.body, 'normal');
  doc.setFontSize(FONT_SIZES.body);
  doc.setTextColor(51, 65, 85);
  doc.text(`Report Date: ${reportDateLabel}`, pageWidth / 2, 102, { align: 'center' });
}

function addSectionTitle(doc, title, y) {
  doc.setFont(FONTS.display, 'bold');
  doc.setFontSize(FONT_SIZES.sectionHeading);
  doc.setTextColor(15, 23, 42);
  doc.text(title, 14, y);
  return y + 8;
}

function ensureSpace(doc, y, neededHeight, logoAsset, accountName) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerHeight = 14;
  if (y + neededHeight <= pageHeight - footerHeight) return y;
  doc.addPage();
  addHeader(doc, logoAsset, accountName);
  return 24;
}

function buildTableOptions(doc, logoAsset, accountName, options = {}) {
  const originalDidDrawPage = options.didDrawPage;
  const mergedMargin = { top: 24, ...(options.margin || {}) };
  return {
    ...options,
    margin: mergedMargin,
    didDrawPage: (data) => {
      if (doc.getCurrentPageInfo().pageNumber > 1) {
        addHeader(doc, logoAsset, accountName);
      }
      if (typeof originalDidDrawPage === 'function') {
        originalDidDrawPage(data);
      }
    },
  };
}

export async function generateAccountReportPdf({
  account,
  signals,
  organization,
  news,
  reportDate = new Date(),
  logoUrl,
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logoAsset = logoUrl ? await toImageDataUrl(logoUrl) : null;
  const opportunities = Array.isArray(account?.opportunities) ? account.opportunities : [];
  const grouped = groupOpportunities(opportunities);
  const cards = Array.isArray(signals?.cards) ? signals.cards : [];
  const stakeholders = organization?.kpis?.totalStakeholders ?? 0;
  const reportDateLabel = formatIsoDate(reportDate);

  addCoverPage(doc, logoAsset, account?.name, reportDateLabel);
  doc.addPage();
  addHeader(doc, logoAsset, account?.name);
  let y = 28;

  y = addSectionTitle(doc, '1. Account growth thesis', y);
  autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
    startY: y,
    head: [['Strategic Fit', 'Opportunities', 'Est. Value', 'Stakeholders']],
    body: [[
      safe(account?.overview?.strategicFit, 'Medium'),
      String(opportunities.length),
      safe(account?.summary?.opportunityRange, 'TBD'),
      String(stakeholders),
    ]],
    styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 2 },
    headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
  }));
  y = doc.lastAutoTable.finalY + SECTION_GAP;

  const growthThesis = summarizeAccountGrowthThesis(account, signals);
  const lines = doc.splitTextToSize(growthThesis, 182);
  doc.setFont(FONTS.body, 'normal');
  doc.setFontSize(FONT_SIZES.body);
  doc.setTextColor(51, 65, 85);
  doc.text(lines, 14, y);
  y += lines.length * 4 + SECTION_GAP;

  y = addSectionTitle(doc, '2. Overview of the Bank', y);
  const overviewRows = [
    ['Bank name', safe(account?.name)],
    ['Asset size', safe(account?.assetSize)],
    ['Revenue', safe(account?.revenue)],
    ['NIM', safe(account?.nim)],
    ['Efficiency ratio', safe(account?.efficiencyRatio)],
    ['Business model', safe(account?.sector, 'Regional Bank')],
  ];
  if (String(account?.businessStrategy ?? '').trim()) {
    overviewRows.push(['Strategic posture', safe(account?.businessStrategy)]);
  }
  autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
    startY: y,
    head: [['Attribute', 'Details']],
    body: overviewRows,
    styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 2 },
    headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
    columnStyles: { 0: { cellWidth: 44, fontStyle: 'bold' } },
    theme: 'grid',
  }));
  y = doc.lastAutoTable.finalY + SECTION_GAP;

  y = addSectionTitle(doc, '3. Products and Services', y);
  autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
    startY: y,
    head: [['Area', 'Products / Services', 'Growth Theme', 'SI Implication']],
    body: [
      ['Retail and Consumer', safe(account?.products), 'Digital growth and relationship depth', 'Journey modernization and service automation'],
      ['Commercial and Treasury', safe(account?.services), 'Payments and workflow expansion', 'API, integration, and process design'],
      ['Technology and Data', safe(account?.businessStrategy), 'Efficiency and risk controls', 'Data, controls, and platform engineering'],
    ],
    styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 2 },
    headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
  }));
  y = doc.lastAutoTable.finalY + SECTION_GAP;

  y = addSectionTitle(doc, '4. Business Segments and Signals', y);
  autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
    startY: y,
    head: [['Signal', 'Summary']],
    body: cards.length
      ? cards.map((card) => [safe(card.title), safe(card.text)])
      : [['No signal cards', 'Signals are not yet populated for this account.']],
    styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: 46, fontStyle: 'bold' } },
    headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
  }));

  y = doc.lastAutoTable.finalY + SECTION_GAP;
  y = ensureSpace(doc, y, 42, logoAsset, account?.name);
  y = addSectionTitle(doc, '5. Opportunity Portfolio', y);

  const opportunitySections = [
    ['Confirmed Opportunities', grouped['Confirmed Opportunity']],
    ['Inferred Opportunities', grouped['Inferred Opportunity']],
    ['Strategic Hypothesis Opportunities', grouped['Strategic Hypothesis Opportunity']],
    ['Watchlist Opportunities', grouped['Watchlist Opportunity']],
  ];

  for (const [label, list] of opportunitySections) {
    doc.setFont(FONTS.body, 'bold');
    doc.setFontSize(FONT_SIZES.subheading);
    doc.setTextColor(30, 41, 59);
    doc.text(label, 14, y);
    y += 5;
    autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
      startY: y,
      head: [['Opportunity', 'Priority', 'Value', 'Timeline', 'Confidence', 'Buyer']],
      body: list.length
        ? list.slice(0, 6).map((opp) => [
            safe(opp.title),
            safe(opp.priority, 'Medium'),
            safe(opp.dealSize, 'TBD'),
            safe(opp.timeline, 'TBD'),
            safe(opp.confidenceScore, '3/5'),
            safe(opp.buyer, 'TBD'),
          ])
        : [['No opportunities available', '-', '-', '-', '-', '-']],
      styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 1.8 },
      headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
      margin: { left: 14, right: 14 },
    }));
    y = doc.lastAutoTable.finalY + SECTION_GAP;
    if (y > 265) {
      doc.addPage();
      addHeader(doc, logoAsset, account?.name);
      y = 24;
    }
  }

  y = ensureSpace(doc, y, 44, logoAsset, account?.name);
  y = addSectionTitle(doc, '6. Organization and Buying Center', y);
  const orgRows = [];
  for (const tab of organization?.tabs || []) {
    for (const person of tab.people || []) {
      orgRows.push([
        safe(person.name),
        safe(person.title),
        safe(tab.label),
        String(person.opps ?? 0),
        `${person.stars ?? 0}/5`,
      ]);
    }
  }
  autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
    startY: y,
    head: [['Stakeholder', 'Title', 'Group', 'Opps', 'Influence']],
    body: orgRows.length ? orgRows.slice(0, 24) : [['No stakeholders mapped', '-', '-', '-', '-']],
    styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 1.8 },
    headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
  }));
  y = doc.lastAutoTable.finalY + SECTION_GAP;

  y = ensureSpace(doc, y, 56, logoAsset, account?.name);
  y = addSectionTitle(doc, '7. Latest News and Updates', y);
  const bankNews = news?.bankNews ?? [];
  autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
    startY: y,
    head: [['Title', 'Date', 'Category', 'Relevance']],
    body: bankNews.length
      ? bankNews.slice(0, 10).map((item) => [
          safe(item.title),
          formatIsoDate(item.published_at),
          safe(item.category, 'General'),
          safe(item.sales_relevance || item.relevance),
        ])
      : [['No bank news available', '-', '-', '-']],
    styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 1.8 },
    headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
  }));
  y = doc.lastAutoTable.finalY + SECTION_GAP;

  y = ensureSpace(doc, y, 58, logoAsset, account?.name);
  y = addSectionTitle(doc, '8. Recommended 30-Day Plan', y);
  const topOpps = opportunities.slice(0, 3);
  autoTable(doc, buildTableOptions(doc, logoAsset, account?.name, {
    startY: y,
    head: [['Timing', 'Action', 'Owner', 'Expected Output']],
    body: [
      ['Week 1', safe(topOpps[0]?.firstMeetingTheme, 'Validate top opportunity and buyer map'), 'Sales Lead', 'Prioritized account actions'],
      ['Week 2', safe(topOpps[0]?.siEntryWedge, 'Run discovery with technology and business stakeholders'), 'Sales + Solution', 'Discovery notes and scope'],
      ['Week 3', safe(topOpps[1]?.firstMeetingTheme, 'Align scope and controls with account priorities'), 'Solution Team', 'Draft POV and workplan'],
      ['Week 4', safe(topOpps[2]?.firstMeetingTheme, 'Package executive-ready proposal'), 'Account Team', 'Next-step proposal'],
    ],
    styles: { font: FONTS.body, fontSize: FONT_SIZES.tableBody, cellPadding: 2 },
    headStyles: { fillColor: TABLE_HEADER_GREY, font: FONTS.body, fontStyle: 'bold', fontSize: FONT_SIZES.tableHeader },
  }));
  y = doc.lastAutoTable.finalY + SECTION_GAP;

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 10, pageWidth - 14, pageHeight - 10);
    doc.setFont(FONTS.body, 'normal');
    doc.setFontSize(FONT_SIZES.footer);
    doc.setTextColor(100, 116, 139);
    doc.text(`Confidential - AccountSignal AI`, 14, pageHeight - 5);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - 14, pageHeight - 5, { align: 'right' });
  }

  const fileName = `${safe(account?.name, 'bank').replace(/[^a-z0-9]+/gi, '_').toLowerCase()}_account_intelligence_report.pdf`;
  doc.save(fileName);
}
