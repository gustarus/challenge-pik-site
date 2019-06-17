export default function resizePictureFromDataUri(dataUri, maxWidth, maxHeight) {
  const img = document.createElement('img');
  img.src = dataUri;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  let width = img.width;
  let height = img.height;
  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/png');
}
