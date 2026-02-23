export default function parseRequest(buffer) {
  const headerEndIndex = buffer.indexOf("\r\n\r\n");
  if (headerEndIndex === -1) return null;

  const headersPart = buffer.slice(0, headerEndIndex);
  const bodyStartIndex = headerEndIndex + 4;

  const lines = headersPart.split("\r\n");
  const requestLine = lines[0];
  const parts = requestLine.split(" ");

  if (parts.length !== 3) return null;

  const [method, path, version] = parts;

  const headers = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    headers[key] = value;
  }

  let contentLength = 0;
  if (headers["content-length"]) {
    contentLength = parseInt(headers["content-length"], 10);
  }

  const totalLength = bodyStartIndex + contentLength;

  if (buffer.length < totalLength) return null;

  const body = buffer.slice(bodyStartIndex, totalLength);

  return {
    request: { method, path, headers, body },
    totalLength,
  };
}
