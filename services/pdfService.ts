
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    document.body.style.cursor = 'wait';

    // Save original styles
    const originalBg = element.style.background;
    const originalColor = element.style.color;

    // Apply print styling
    element.style.background = '#ffffff';
    element.style.color = '#000000';

    // A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const availableWidth = pdfWidth - (margin * 2);
    const availableHeight = pdfHeight - (margin * 2);

    // Capture element as canvas with proper scaling
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });

    // Restore original styles
    element.style.background = originalBg;
    element.style.color = originalColor;

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Calculate image dimensions to fit PDF width
    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page - position starts at 0 (top of image)
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    heightLeft -= availableHeight;

    // Add additional pages if content exceeds page height
    while (heightLeft > 0) {
      position = -heightLeft; // Negative position to show next portion
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= availableHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("Could not generate PDF. Please try again.");
  } finally {
    document.body.style.cursor = 'default';
  }
};
