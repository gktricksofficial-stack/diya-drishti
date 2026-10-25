
export const downloadPDF = (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Save original display state
    const originalDisplay = element.style.display;

    // Hide all other elements except the report
    const allElements = document.body.children;
    Array.from(allElements).forEach((el: any) => {
      if (el.id !== elementId && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
        el.style.display = 'none';
      }
    });

    // Show only the report element
    element.style.display = 'block';
    element.style.width = '100%';
    element.style.maxWidth = '210mm'; // A4 width
    element.style.margin = '0 auto';
    element.style.padding = '20mm';

    // Trigger browser print dialog
    window.print();

    // Restore original display state after print dialog closes
    setTimeout(() => {
      Array.from(allElements).forEach((el: any) => {
        el.style.display = '';
      });
      element.style.display = originalDisplay;
      element.style.width = '';
      element.style.maxWidth = '';
      element.style.margin = '';
      element.style.padding = '';
    }, 1000);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("Could not generate PDF. Please try again.");
  }
};
