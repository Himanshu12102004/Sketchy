const fs = require('fs');
async function removeBg(blob) {
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', blob);

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': 'Mp69EnmU1f5gmEFa48XqZ4Cm' },
    body: formData,
  });

  if (response.ok) {
    return await response.arrayBuffer();
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}
async function remove(blob) {
  const fileBlob = await fs.openAsBlob(blob);
  const rbgResultData = await removeBg(fileBlob);
  fs.writeFileSync(`./uploads/no-bg.png`, Buffer.from(rbgResultData));
}

module.exports = remove;
