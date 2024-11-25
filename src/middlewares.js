export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
}
