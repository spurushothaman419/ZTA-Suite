// Export utilities for PDF and Excel reports
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ztmmPillars, getMaturityFromScore, MaturityLevel } from './ztmmData';

type AssessmentAnswer = {
  questionId: string;
  pillarId: string;
  functionId: string;
  maturityLevel: MaturityLevel;
  notes: string;
  evidence: string;
};

type ExportData = {
  projectName: string;
  clientName: string;
  assessmentDate: string;
  answers: Record<string, AssessmentAnswer>;
  overallScore: number;
  pillarScores: Record<string, number>;
};

// Helper to get maturity score
const getMaturityScore = (level: MaturityLevel): number => {
  switch (level) {
    case 'Optimal': return 4;
    case 'Advanced': return 3;
    case 'Initial': return 2;
    default: return 1;
  }
};

// Export to PDF
export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Zero Trust Maturity Assessment', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105); // slate-500
  doc.text('CISA ZTMM v2.0 Assessment Report', pageWidth / 2, 35, { align: 'center' });
  
  // Project Info
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(`Project: ${data.projectName}`, 20, 50);
  doc.text(`Client: ${data.clientName}`, 20, 58);
  doc.text(`Assessment Date: ${data.assessmentDate}`, 20, 66);
  
  // Overall Score Box
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.roundedRect(20, 75, pageWidth - 40, 30, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Overall Maturity Score', pageWidth / 2, 88, { align: 'center' });
  doc.setFontSize(24);
  doc.text(`${data.overallScore.toFixed(1)} / 4.0 - ${getMaturityFromScore(data.overallScore)}`, pageWidth / 2, 100, { align: 'center' });
  
  // Pillar Scores Table
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.text('Pillar Maturity Scores', 20, 120);
  
  const pillarTableData = ztmmPillars.map(pillar => {
    const score = data.pillarScores[pillar.id] || 0;
    const maturity = getMaturityFromScore(score);
    const questionCount = pillar.functions.reduce((sum, f) => sum + f.questions.length, 0);
    const answeredCount = pillar.functions.reduce((sum, f) => 
      sum + f.questions.filter(q => data.answers[q.id]).length, 0);
    
    return [
      pillar.name,
      score.toFixed(1),
      maturity,
      `${answeredCount}/${questionCount}`,
      `${questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0}%`
    ];
  });
  
  autoTable(doc, {
    startY: 125,
    head: [['Pillar', 'Score', 'Maturity Level', 'Questions', 'Completion']],
    body: pillarTableData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  });
  
  // Gap Analysis Section
  let currentY = (doc as any).lastAutoTable.finalY + 15;
  
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.text('Gap Analysis Summary', 20, currentY);
  currentY += 10;
  
  // Find gaps (pillars below Advanced level)
  const gaps: string[][] = [];
  ztmmPillars.forEach(pillar => {
    const score = data.pillarScores[pillar.id] || 0;
    if (score < 3) { // Below Advanced
      const maturity = getMaturityFromScore(score);
      const gap = 3 - score; // Gap to reach Advanced
      gaps.push([
        pillar.name,
        maturity,
        gap.toFixed(1),
        score < 2 ? 'High' : 'Medium'
      ]);
    }
  });
  
  if (gaps.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Pillar', 'Current Level', 'Gap to Advanced', 'Priority']],
      body: gaps,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] }, // red-500
      styles: { fontSize: 10 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // green-500
    doc.text('All pillars are at Advanced level or above!', 20, currentY);
    currentY += 15;
  }
  
  // Detailed Assessment by Pillar
  doc.addPage();
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text('Detailed Assessment Results', pageWidth / 2, 20, { align: 'center' });
  
  let detailY = 35;
  
  ztmmPillars.forEach(pillar => {
    if (detailY > 250) {
      doc.addPage();
      detailY = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241);
    doc.text(`${pillar.name}`, 20, detailY);
    detailY += 8;
    
    const pillarAnswers: string[][] = [];
    pillar.functions.forEach(func => {
      func.questions.forEach(q => {
        const answer = data.answers[q.id];
        if (answer) {
          pillarAnswers.push([
            func.name,
            q.question.substring(0, 50) + '...',
            answer.maturityLevel,
            answer.notes ? answer.notes.substring(0, 30) + '...' : '-'
          ]);
        }
      });
    });
    
    if (pillarAnswers.length > 0) {
      autoTable(doc, {
        startY: detailY,
        head: [['Function', 'Question', 'Level', 'Notes']],
        body: pillarAnswers,
        theme: 'striped',
        headStyles: { fillColor: [71, 85, 105] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 70 },
          2: { cellWidth: 25 },
          3: { cellWidth: 45 },
        },
      });
      detailY = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('No assessments completed for this pillar', 25, detailY);
      detailY += 12;
    }
  });
  
  // Recommendations Page
  doc.addPage();
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text('Recommendations', pageWidth / 2, 20, { align: 'center' });
  
  let recY = 35;
  doc.setFontSize(10);
  
  ztmmPillars.forEach(pillar => {
    const score = data.pillarScores[pillar.id] || 0;
    if (score < 3) {
      if (recY > 260) {
        doc.addPage();
        recY = 20;
      }
      
      doc.setTextColor(99, 102, 241);
      doc.setFontSize(11);
      doc.text(`${pillar.name} (Current: ${getMaturityFromScore(score)})`, 20, recY);
      recY += 7;
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      
      // Generate recommendations based on current level
      const recommendations = getRecommendations(pillar.id, score);
      recommendations.forEach(rec => {
        if (recY > 270) {
          doc.addPage();
          recY = 20;
        }
        doc.text(`• ${rec}`, 25, recY);
        recY += 6;
      });
      recY += 5;
    }
  });
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by ZTA-Suite | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`ZTMM_Assessment_${data.projectName.replace(/\s+/g, '_')}_${data.assessmentDate}.pdf`);
};

// Export to Excel
export const exportToExcel = (data: ExportData) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData = [
    ['Zero Trust Maturity Assessment Report'],
    [''],
    ['Project Information'],
    ['Project Name', data.projectName],
    ['Client', data.clientName],
    ['Assessment Date', data.assessmentDate],
    [''],
    ['Overall Results'],
    ['Overall Score', data.overallScore.toFixed(2)],
    ['Overall Maturity Level', getMaturityFromScore(data.overallScore)],
    [''],
    ['Pillar Scores'],
    ['Pillar', 'Score', 'Maturity Level', 'Questions Answered', 'Completion %'],
  ];
  
  ztmmPillars.forEach(pillar => {
    const score = data.pillarScores[pillar.id] || 0;
    const questionCount = pillar.functions.reduce((sum, f) => sum + f.questions.length, 0);
    const answeredCount = pillar.functions.reduce((sum, f) => 
      sum + f.questions.filter(q => data.answers[q.id]).length, 0);
    
    summaryData.push([
      pillar.name,
      score.toFixed(2),
      getMaturityFromScore(score),
      `${answeredCount}/${questionCount}`,
      `${questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0}%`
    ]);
  });
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Detailed Assessment Sheet
  const detailData = [
    ['Pillar', 'Function', 'Question', 'Maturity Level', 'Score', 'Notes', 'Evidence']
  ];
  
  ztmmPillars.forEach(pillar => {
    pillar.functions.forEach(func => {
      func.questions.forEach(q => {
        const answer = data.answers[q.id];
        detailData.push([
          pillar.name,
          func.name,
          q.question,
          answer?.maturityLevel || 'Not Assessed',
          answer ? getMaturityScore(answer.maturityLevel).toString() : '',
          answer?.notes || '',
          answer?.evidence || ''
        ]);
      });
    });
  });
  
  const detailSheet = XLSX.utils.aoa_to_sheet(detailData);
  XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detailed Assessment');
  
  // Gap Analysis Sheet
  const gapData = [
    ['Gap Analysis'],
    [''],
    ['Pillar', 'Current Score', 'Current Level', 'Target Level', 'Gap', 'Priority', 'Recommendations']
  ];
  
  ztmmPillars.forEach(pillar => {
    const score = data.pillarScores[pillar.id] || 0;
    const gap = Math.max(0, 3 - score);
    const priority = score < 2 ? 'High' : score < 3 ? 'Medium' : 'Low';
    const recommendations = getRecommendations(pillar.id, score).join('; ');
    
    gapData.push([
      pillar.name,
      score.toFixed(2),
      getMaturityFromScore(score),
      'Advanced',
      gap.toFixed(2),
      priority,
      recommendations
    ]);
  });
  
  const gapSheet = XLSX.utils.aoa_to_sheet(gapData);
  XLSX.utils.book_append_sheet(workbook, gapSheet, 'Gap Analysis');
  
  // Maturity Indicators Sheet (Reference)
  const indicatorData = [
    ['Maturity Level Indicators Reference'],
    [''],
    ['Pillar', 'Function', 'Question', 'Traditional', 'Initial', 'Advanced', 'Optimal']
  ];
  
  ztmmPillars.forEach(pillar => {
    pillar.functions.forEach(func => {
      func.questions.forEach(q => {
        indicatorData.push([
          pillar.name,
          func.name,
          q.question,
          q.traditionalIndicator,
          q.initialIndicator,
          q.advancedIndicator,
          q.optimalIndicator
        ]);
      });
    });
  });
  
  const indicatorSheet = XLSX.utils.aoa_to_sheet(indicatorData);
  XLSX.utils.book_append_sheet(workbook, indicatorSheet, 'Maturity Indicators');
  
  // Save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `ZTMM_Assessment_${data.projectName.replace(/\s+/g, '_')}_${data.assessmentDate}.xlsx`);
};

// Generate recommendations based on pillar and score
const getRecommendations = (pillarId: string, score: number): string[] => {
  const recommendations: Record<string, Record<string, string[]>> = {
    identity: {
      traditional: [
        'Implement multi-factor authentication (MFA) for all users',
        'Deploy a centralized identity provider (IdP)',
        'Establish identity lifecycle management processes',
        'Implement privileged access management (PAM)',
      ],
      initial: [
        'Expand MFA to phishing-resistant methods',
        'Implement risk-based authentication',
        'Deploy user behavior analytics (UBA)',
        'Automate identity provisioning and deprovisioning',
      ],
    },
    devices: {
      traditional: [
        'Deploy endpoint detection and response (EDR) solution',
        'Implement device inventory and asset management',
        'Establish device compliance policies',
        'Deploy mobile device management (MDM)',
      ],
      initial: [
        'Implement continuous device health monitoring',
        'Deploy unified endpoint management (UEM)',
        'Automate device compliance enforcement',
        'Extend protection to IoT and OT devices',
      ],
    },
    networks: {
      traditional: [
        'Implement network segmentation with VLANs',
        'Deploy next-generation firewalls',
        'Encrypt all network traffic (TLS 1.3)',
        'Implement DNS security and filtering',
      ],
      initial: [
        'Deploy micro-segmentation solution',
        'Implement software-defined perimeter (SDP)',
        'Deploy zero trust network access (ZTNA)',
        'Implement east-west traffic inspection',
      ],
    },
    applications: {
      traditional: [
        'Implement application inventory and classification',
        'Deploy web application firewall (WAF)',
        'Establish secure development practices',
        'Implement API security controls',
      ],
      initial: [
        'Integrate security into CI/CD pipeline (DevSecOps)',
        'Implement runtime application self-protection (RASP)',
        'Deploy application-level access controls',
        'Automate vulnerability scanning and remediation',
      ],
    },
    data: {
      traditional: [
        'Implement data classification scheme',
        'Deploy data loss prevention (DLP) solution',
        'Encrypt sensitive data at rest and in transit',
        'Establish data access controls',
      ],
      initial: [
        'Implement automated data discovery and classification',
        'Deploy cloud access security broker (CASB)',
        'Implement data rights management',
        'Automate data lifecycle management',
      ],
    },
    visibility: {
      traditional: [
        'Deploy SIEM solution with centralized logging',
        'Implement security monitoring and alerting',
        'Establish incident response procedures',
        'Deploy network traffic analysis',
      ],
      initial: [
        'Implement security orchestration and automation (SOAR)',
        'Deploy extended detection and response (XDR)',
        'Implement threat intelligence integration',
        'Automate incident response playbooks',
      ],
    },
    automation: {
      traditional: [
        'Identify manual security processes for automation',
        'Implement basic security automation scripts',
        'Deploy configuration management tools',
        'Establish automation governance',
      ],
      initial: [
        'Deploy SOAR platform for security automation',
        'Implement automated policy enforcement',
        'Automate compliance monitoring and reporting',
        'Integrate security tools via APIs',
      ],
    },
    governance: {
      traditional: [
        'Develop Zero Trust strategy and roadmap',
        'Establish security policies and standards',
        'Implement risk management framework',
        'Define roles and responsibilities',
      ],
      initial: [
        'Align Zero Trust with business objectives',
        'Implement continuous compliance monitoring',
        'Establish metrics and KPIs for Zero Trust',
        'Develop Zero Trust training program',
      ],
    },
  };
  
  const level = score < 2 ? 'traditional' : 'initial';
  return recommendations[pillarId]?.[level] || [
    'Conduct detailed assessment of current capabilities',
    'Develop improvement roadmap with prioritized initiatives',
    'Allocate resources for security improvements',
    'Establish metrics to track progress',
  ];
};

export { getRecommendations };
