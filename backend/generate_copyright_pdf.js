const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'SmartSite_Advisor_Source_Code.pdf');

const doc = new PDFDocument({
  margin: 40,
  size: 'A4',
  bufferPages: true,
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Cover Header
doc.fillColor('#1e1b4b').fontSize(22).font('Helvetica-Bold')
   .text('OFFICIAL COPYRIGHT SOURCE CODE DOCUMENT', { align: 'center' });
doc.moveDown(0.5);

doc.fillColor('#4338ca').fontSize(14).font('Helvetica-Bold')
   .text('SmartSite Advisor: Multi-Agent AI Engine for Real Estate Spatial Intelligence', { align: 'center' });
doc.moveDown(0.5);

doc.fillColor('#334155').fontSize(10).font('Helvetica')
   .text('Class of Work: Literary Work (Computer Software / Programme)', { align: 'center' })
   .text('Applicant / Author: MANISH RAJE', { align: 'center' })
   .text('Date of Submission: August 2026 | Status: Unpublished Work', { align: 'center' });

doc.moveDown(1);
doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
doc.moveDown(1);

const codeFiles = [
  // Section 1: Backend Architecture & Swarm Agents (First Pages)
  { relativePath: 'backend/server.js', label: '1. SERVER ENTRYPOINT (backend/server.js)' },
  { relativePath: 'backend/app.js', label: '2. EXPRESS APPLICATION CONFIG (backend/app.js)' },
  { relativePath: 'backend/src/agents/ParichayAgent.js', label: '3. PARICHAY VOICE ONBOARDING AGENT (backend/src/agents/ParichayAgent.js)' },
  { relativePath: 'backend/src/agents/GeoSpatialAgent.js', label: '4. GEOSPATIAL NEIGHBORHOOD AGENT (backend/src/agents/GeoSpatialAgent.js)' },
  { relativePath: 'backend/src/agents/ValuationROIAgent.js', label: '5. VALUATION & ROI ANALYTICS AGENT (backend/src/agents/ValuationROIAgent.js)' },
  { relativePath: 'backend/src/agents/PortalSyncManager.js', label: '6. PORTAL SYNC MULTI-SCRAPER AGENT (backend/src/agents/PortalSyncManager.js)' },
  
  // Section 2: Frontend Spatial UI & Map Discovery (Last Pages)
  { relativePath: 'frontend/src/App.jsx', label: '7. FRONTEND ROUTER & APP SHELL (frontend/src/App.jsx)' },
  { relativePath: 'frontend/src/pages/PropertyListing.jsx', label: '8. NATURAL LANGUAGE SPATIAL CATALOG (frontend/src/pages/PropertyListing.jsx)' },
  { relativePath: 'frontend/src/components/property/PropertyMapView.jsx', label: '9. DYNAMIC LEAFLET SPATIAL MAP ENGINE (frontend/src/components/property/PropertyMapView.jsx)' },
  { relativePath: 'frontend/src/components/ui/ExplainerChatbot.jsx', label: '10. AI SPATIAL CHATBOT & POI OVERLAY (frontend/src/components/ui/ExplainerChatbot.jsx)' },
];

codeFiles.forEach((fileInfo) => {
  const fullPath = path.join(rootDir, fileInfo.relativePath);
  if (!fs.existsSync(fullPath)) return;

  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');

  doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold').text(fileInfo.label);
  doc.fillColor('#64748b').fontSize(8).font('Helvetica').text(`File: ${fileInfo.relativePath} | Total Lines: ${lines.length}`);
  doc.moveDown(0.4);

  // Print code lines
  doc.font('Courier').fontSize(7.5).fillColor('#0f172a');
  
  lines.forEach((line, index) => {
    // Check page overflow
    if (doc.y > 750) {
      doc.addPage();
    }
    const lineNum = String(index + 1).padStart(4, ' ');
    doc.text(`${lineNum} | ${line.replace(/\t/g, '  ')}`, { lineBreak: true });
  });

  doc.moveDown(1.5);
});

// Footer Page Numbers
const pageCount = doc.bufferedPageRange().count;
for (let i = 0; i < pageCount; i++) {
  doc.switchToPage(i);
  doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
     .text(`SmartSite Advisor - Source Code Document | Page ${i + 1} of ${pageCount}`, 40, 800, { align: 'center' });
}

doc.end();

writeStream.on('finish', () => {
  console.log(`✅ Copyright Source Code PDF successfully generated at:\n${outputPath}`);
  console.log(`Total Pages: ${pageCount}`);
});
