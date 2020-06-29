function getNextValidFloat32HeapLength(desiredLengthFloats: number) {
  let heapLengthBytes;
  const desiredLengthBytes = desiredLengthFloats << 2;

  if (desiredLengthBytes <= Math.pow(2, 12)) {
    heapLengthBytes = Math.pow(2, 12);
  } else if (desiredLengthBytes < Math.pow(2, 24)) {
    heapLengthBytes = Math.pow(2, Math.ceil(Math.log2(desiredLengthBytes)));
  } else {
    throw new Error('Heap length greater than 2^24 bytes not implemented');
  }
  return heapLengthBytes;
}

export { getNextValidFloat32HeapLength };
