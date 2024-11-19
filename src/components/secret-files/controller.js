import api from "../../services/api.js";

export async function fetchFiles(req, res) {
  try {
    const response = await api.get("secret/files");
    const files = response.data.files;
    const results = await Promise.all(
      files.map(async (file) => {
        const fileContent = await fetchFileContent(file);

        if (!fileContent) {
          return { file, lines: [] };
        }

        const parsedContent = await parseFileContent(fileContent);
        return parsedContent ? { file, lines: parsedContent } : null;
      })
    );

    res.status(200).json(results.filter(Boolean));
  } catch (error) {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? "Internal server error";

    res.status(status).json({ error: status, message });
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
        // number && !isNaN(number) && /^[0-9a-fA-F]{32}$/.test(hex)
        number && !isNaN(number) && hex
    )
    .map(([, text, number, hex]) => ({
      text,
      number: Number(number),
      hex,
    }));
}
