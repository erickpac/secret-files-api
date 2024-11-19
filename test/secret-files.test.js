import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import api from "../src/services/api.js";
import {
  processFiles,
  fetchFileList,
} from "../src/components/secret-files/controller.js";

describe("Secret files controller tests", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: (code) => {
        res.statusCode = code;
        return res;
      },
      json: (data) => {
        res.data = data;
      },
    };
  });

  describe("processFiles", () => {
    it("should return 404 if file is not found", async () => {
      req.query.fileName = "nonexistent.txt";
      api.get = async () => {
        throw { response: { status: 404 } };
      };

      await processFiles(req, res);

      expect(res.statusCode).to.equal(404);
      expect(res.data).to.deep.equal({ error: 404, message: "File not found" });
    });

    it("should return parsed content if file is found", async () => {
      req.query.fileName = "file.txt";
      const fileContent =
        "1,hello,123,abcdef1234567890abcdef1234567890\n2,world,456,abcdef1234567890abcdef1234567890";
      api.get = async () => ({ data: fileContent });

      await processFiles(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal({
        file: "file.txt",
        lines: [
          {
            text: "hello",
            number: 123,
            hex: "abcdef1234567890abcdef1234567890",
          },
          {
            text: "world",
            number: 456,
            hex: "abcdef1234567890abcdef1234567890",
          },
        ],
      });
    });

    it("should return list of files and their parsed content", async () => {
      api.get = async (url) => {
        if (url === "secret/files") {
          return { data: { files: ["file1.txt", "file2.txt"] } };
        } else if (url === "secret/file/file1.txt") {
          return {
            data: "1,hello,123,abcdef1234567890abcdef1234567890",
          };
        } else if (url === "secret/file/file2.txt") {
          return {
            data: "2,world,456,abcdef1234567890abcdef1234567890",
          };
        }
      };

      await processFiles(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal([
        {
          file: "file1.txt",
          lines: [
            {
              text: "hello",
              number: 123,
              hex: "abcdef1234567890abcdef1234567890",
            },
          ],
        },
        {
          file: "file2.txt",
          lines: [
            {
              text: "world",
              number: 456,
              hex: "abcdef1234567890abcdef1234567890",
            },
          ],
        },
      ]);
    });
  });

  describe("fetchFileList", () => {
    it("should return list of files", async () => {
      const files = { files: ["file1.txt", "file2.txt"] };
      api.get = async () => ({ data: files });

      await fetchFileList(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal(files);
    });

    it("should return 500 if there is an error", async () => {
      api.get = async () => {
        throw {
          response: { status: 500, data: { message: "Internal server error" } },
        };
      };

      await fetchFileList(req, res);

      expect(res.statusCode).to.equal(500);
      expect(res.data).to.deep.equal({
        error: 500,
        message: "Internal server error",
      });
    });
  });
});
