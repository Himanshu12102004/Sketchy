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

    if (!response.ok) {
      const event = new CustomEvent('someError');
      window.dispatchEvent(event);
      return fetchDefaultSVG('error.svg');
    }
    const svgContent = await response.json();
    const blob = new Blob([svgContent.message], { type: 'image/svg+xml' });
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

  const readyToGoEvent = new CustomEvent('readyToGo', {
    detail: { vectors: GlobalVariables.master.getVectorColor() },
  });
  window.dispatchEvent(readyToGoEvent);
  GlobalVariables.grabageClearingHandle = setInterval(() => {
    GlobalVariables.master.disposeGarbage();
  }, GlobalVariables.grabageClearingTime);
}
async function fetchDefaultSVG(fileName = 'pc.svg'): Promise<File> {
  if (innerWidth < 750) {
    fileName = 'phone.svg';
  }
  const response = await fetch(fileName);
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
