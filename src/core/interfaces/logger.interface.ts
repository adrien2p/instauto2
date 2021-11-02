export interface LiteLogger {
  error: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
}

export interface Logger extends LiteLogger {
  log: (message?: any, ...optionalParams: any[]) => void;
}