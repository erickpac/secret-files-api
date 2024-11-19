import api from "../../services/api.js";

export async function getFiles(req, res) {
  try {
    const response = await api.get("secret/files");
    const files = response.data.files;
    const results = await Promise.all(
      files.map(async (file) => {
        const fileContent = await fetchFileContent(file);
        if (!fileContent) return null;
        const parsedContent = await parseFileContent(fileContent);
        return parsedContent ? { file, lines: parsedContent } : null;
      })
    );

    res.status(200).json(results.filter(Boolean));
  } catch (error) {
    const status = error.response?.status ?? 500;

    res.status(status).json(error.response?.data);
  }
}

async function fetchFileContent(name) {
  try {
    const response = await api.get(`secret/file/${name}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

async function parseFileContent(fileContent) {
  return fileContent
    .split("\n")
    .map((line) => line.split(","))
    .filter(
      ([, , number, hex]) =>
        number && !isNaN(number) && /^[0-9a-fA-F]{32}$/.test(hex)
    )
    .map(([, text, number, hex]) => ({
      text,
      number: Number(number),
      hex,
    }));
}
