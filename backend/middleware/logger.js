import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolver __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta y archivos de logs
const logsDir = path.join(__dirname, "..", "logs");
const appLogPath = path.join(logsDir, "app.log");
const errorLogPath = path.join(logsDir, "error.log");

// Asegurar que la carpeta de logs exista
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Streams de escritura para logs
const appLogStream = fs.createWriteStream(appLogPath, { flags: "a" });
const errorLogStream = fs.createWriteStream(errorLogPath, { flags: "a" });

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${
      req.originalUrl
    } ${res.statusCode} - ${duration}ms\n`;

    // Consola
    console.log(logMessage.trim());
    // Archivo
    appLogStream.write(logMessage);
  });

  next();
};

export const errorLogger = (err, req, res, next) => {
  const status = err.status || err.statusCode || res.statusCode || 500;
  const baseMessage = `[${new Date().toISOString()}] ERROR ${req.method} ${
    req.originalUrl
  } ${status}`;
  const stack = err && err.stack ? err.stack : String(err);
  const logMessage = `${baseMessage}\n${stack}\n\n`;

  // Consola
  console.error(baseMessage);
  console.error(err);
  // Archivo
  errorLogStream.write(logMessage);

  next(err);
};



