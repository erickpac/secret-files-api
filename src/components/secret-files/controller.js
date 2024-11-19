import api from "../../services/api.js";

export async function processFiles(req, res) {
  try {
    const { fileName } = req.query;

    if (fileName) {
      const fileContent = await fetchFileContent(fileName);

      if (!fileContent) {
        return res.status(404).json({ error: 404, message: "File not found" });
      }

      const parsedContent = await parseFileContent(fileContent);
      return res.status(200).json({ file: fileName, lines: parsedContent });
    }

    const filesResponse = await api.get("secret/files");
    const files = filesResponse.data.files;
    const results = await Promise.all(
      files.map(async (file) => {
        const fileContent = await fetchFileContent(file);

        if (!fileContent) {
          return { file, lines: [] };
        }

        const parsedContent = await parseFileContent(fileContent);
        return { file, lines: parsedContent };
      })
    );

    res.status(200).json(results);
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

export async function fetchFileList(req, res) {
  try {
    let response = await api.get("secret/files");

    res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? "Internal server error";

    res.status(status).json({ error: status, message });
  }
}
