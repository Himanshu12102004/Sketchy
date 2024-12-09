import GlobalVariables from '../utils/GlobalVariable';

async function processSvg(svgFile: File) {
  try {
    await GlobalVariables.master.fromFile(svgFile);
  } catch (error) {
    console.error('Error processing SVG:', error);
  }
}

async function convertAndProcessImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to convert image to SVG');

    const svgContent = await response.text();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const svgFile = new File([blob], 'converted.svg', {
      type: 'image/svg+xml',
    });

    return svgFile;
  } catch (error) {
    console.error('Error during SVG conversion or processing:', error);
  }
}

function finalizeProcessing() {
  GlobalVariables.master.samplePath();
  const vectorsCreatedEvent = new CustomEvent('vectorsCreated', {
    detail: { vectors: GlobalVariables.master.getVectorColor() },
  });
  window.dispatchEvent(vectorsCreatedEvent);

  GlobalVariables.grabageClearingHandle = setInterval(() => {
    GlobalVariables.master.disposeGarbage();
  }, GlobalVariables.grabageClearingTime);
}
async function fetchDefaultSVG(): Promise<File> {
  const response = await fetch('react.svg');
  const svgContent = await response.text();
  const file = new File([svgContent], 'default.svg', { type: 'image/svg+xml' });
  return file;
}
export {
  processSvg,
  finalizeProcessing,
  convertAndProcessImage,
  fetchDefaultSVG,
};
