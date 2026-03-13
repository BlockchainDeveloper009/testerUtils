/**
 * Structured Logger for automated tests
 * Provides different log levels with timestamps and context
 */

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export interface LogContext {
  testName?: string;
  module?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  context?: LogContext;
  data?: any;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  private enableConsole: boolean = true;
  private enableFile: boolean = false;
  private logHistory: LogEntry[] = [];
  private maxHistorySize: number = 1000;

  /**
   * Initialize logger with configuration
   */
  configure(options: {
    level?: LogLevel;
    enableConsole?: boolean;
    enableFile?: boolean;
    maxHistorySize?: number;
  }): void {
    if (options.level) this.logLevel = options.level;
    if (options.enableConsole !== undefined) this.enableConsole = options.enableConsole;
    if (options.enableFile !== undefined) this.enableFile = options.enableFile;
    if (options.maxHistorySize) this.maxHistorySize = options.maxHistorySize;
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  /**
   * Format log message with colors (if console)
   */
  private getColoredLevel(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      [LogLevel.TRACE]: '\x1b[90m', // Gray
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m', // Green
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[41m\x1b[37m', // White on Red
    };
    const reset = '\x1b[0m';
    return `${colors[level]}[${level}]${reset}`;
  }

  /**
   * Format timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format and output log entry
   */
  private outputLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    // Add to history
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    if (this.enableConsole) {
      const timestamp = `\x1b[90m${entry.timestamp}\x1b[0m`;
      const levelStr = this.getColoredLevel(entry.level);
      const contextStr = entry.context
        ? ` ${JSON.stringify(entry.context)}`
        : '';
      
      let output = `${timestamp} ${levelStr} ${entry.message}${contextStr}`;
      console.log(output);

      if (entry.data) {
        console.log('  Data:', JSON.stringify(entry.data, null, 2));
      }

      if (entry.error) {
        console.log('  Error:', entry.error);
        console.log('  Stack:', entry.error.stack);
      }
    }
  }

  /**
   * Trace level logging
   */
  trace(message: string, context?: LogContext, data?: any): void {
    this.outputLog({
      level: LogLevel.TRACE,
      timestamp: this.getTimestamp(),
      message,
      context,
      data,
    });
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext, data?: any): void {
    this.outputLog({
      level: LogLevel.DEBUG,
      timestamp: this.getTimestamp(),
      message,
      context,
      data,
    });
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext, data?: any): void {
    this.outputLog({
      level: LogLevel.INFO,
      timestamp: this.getTimestamp(),
      message,
      context,
      data,
    });
  }

  /**
   * Warn level logging
   */
  warn(message: string, context?: LogContext, data?: any): void {
    this.outputLog({
      level: LogLevel.WARN,
      timestamp: this.getTimestamp(),
      message,
      context,
      data,
    });
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.outputLog({
      level: LogLevel.ERROR,
      timestamp: this.getTimestamp(),
      message,
      context,
      error,
    });
  }

  /**
   * Fatal level logging
   */
  fatal(message: string, error?: Error, context?: LogContext): void {
    this.outputLog({
      level: LogLevel.FATAL,
      timestamp: this.getTimestamp(),
      message,
      context,
      error,
    });
  }

  /**
   * Structured API call logging
   */
  logApiCall(
    method: string,
    url: string,
    statusCode?: number,
    duration?: number,
    context?: LogContext
  ): void {
    const data = {
      method,
      url,
      statusCode,
      durationMs: duration,
    };
    const message = `API ${method} ${url}`;
    this.info(message, context, data);
  }

  /**
   * Structured test step logging
   */
  logTestStep(step: string, status: 'STARTED' | 'PASSED' | 'FAILED', context?: LogContext): void {
    const level = status === 'FAILED' ? LogLevel.ERROR : LogLevel.INFO;
    const message = `[${status}] ${step}`;
    this.outputLog({
      level,
      timestamp: this.getTimestamp(),
      message,
      context,
    });
  }

  /**
   * Get log history
   */
  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Export logs as JSON
   */
  exportAsJson(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }

  /**
   * Export logs as tab-separated values
   */
  exportAsCsv(): string {
    const headers = ['timestamp', 'level', 'message', 'context', 'data'];
    const rows = this.logHistory.map((entry) => [
      entry.timestamp,
      entry.level,
      entry.message,
      JSON.stringify(entry.context || {}),
      JSON.stringify(entry.data || {}),
    ]);

    const csv = [
      headers.join('\t'),
      ...rows.map((row) => row.join('\t')),
    ].join('\n');

    return csv;
  }
}

// Singleton instance
export const logger = new Logger();
export default logger;
