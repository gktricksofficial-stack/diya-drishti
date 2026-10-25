
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
    const margin = 10;
    const availableWidth = pdfWidth - (margin * 2);
    const availableHeight = pdfHeight - (margin * 2);

    // Get the actual rendered width of the element
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    // Calculate scale to fit width
    const scale = availableWidth / elementWidth;

    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: elementWidth,
      height: elementHeight,
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
    let position = margin;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= availableHeight;

    // Add additional pages if content exceeds page height
    let pageCount = 1;
    while (heightLeft > 0) {
      position = margin - (pageCount * availableHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= availableHeight;
      pageCount++;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("Could not generate PDF. Please try again.");
  } finally {
    document.body.style.cursor = 'default';
  }
};
