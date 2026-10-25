
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Add a loading cursor or state could be handled in the component
    document.body.style.cursor = 'wait';

    // Save original background
    const originalBg = element.style.background;
    const originalColor = element.style.color;

    // Apply print-friendly styling temporarily
    element.style.background = '#ffffff';
    element.style.color = '#000000';

    const canvas = await html2canvas(element, {
      scale: 3, // Professional print quality (300 DPI equivalent)
      backgroundColor: '#ffffff', // White background for print
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 15000,
      removeContainer: true
    });

    // Restore original styling
    element.style.background = originalBg;
    element.style.color = originalColor;

    const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality

    // A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if content is long
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("Could not generate PDF. Please try again.");
  } finally {
    document.body.style.cursor = 'default';
  }
};
