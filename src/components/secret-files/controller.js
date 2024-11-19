import api from "../../services/api.js";

/**
 * Processes files based on the request query parameters.
 *
 * If a `fileName` is provided in the query, it fetches the content of the specified file,
 * parses it, and returns the parsed content. If the file is not found, it returns a 404 error.
 *
 * If no `fileName` is provided, it fetches a list of secret files, retrieves their content,
 * parses each file, and returns the results.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters of the request.
 * @param {string} [req.query.fileName] - The name of the file to process.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves when the processing is complete.
 *
 * @throws {Error} - Throws an error if there is an issue with fetching or parsing the files.
 */
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

/**
 * Fetches the list of secret files from the API and sends the response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 *
 * @throws {Error} - Throws an error if the API request fails.
 */
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
