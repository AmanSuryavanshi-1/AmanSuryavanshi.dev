/**
 * Blog Logger - Centralized logging for blog-related operations
 * Provides structured logging with different levels and contexts
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  component?: string;
  postId?: string;
  postSlug?: string;
  imageUrl?: string;
  fallbackType?: string;
  userId?: string;
  timestamp?: string;
}

export class BlogLogger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log a message with context
   */
  private static log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const logEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context || {},
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined
        }
      })
    };

    // Console logging for development
    if (this.isDevelopment) {
      const consoleMethod = level === LogLevel.ERROR ? 'error' : 
                           level === LogLevel.WARN ? 'warn' : 
                           level === LogLevel.INFO ? 'info' : 'log';
      
      console[consoleMethod](`[Blog ${level.toUpperCase()}]`, message, logEntry);
    }

    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToExternalService(logEntry);
    }
  }

  /**
   * Log debug information
   */
  static debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log informational messages
   */
  static info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warnings
   */
  static warn(message: string, context?: LogContext, error?: Error) {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Log errors
   */
  static error(message: string, context?: LogContext, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log fallback image usage
   */
  static logFallbackUsage(fallbackType: string, context?: Omit<LogContext, 'fallbackType'>) {
    this.info('Fallback image used', {
      ...context,
      fallbackType
    });
  }

  /**
   * Log image loading errors
   */
  static logImageError(imageUrl: string, context?: Omit<LogContext, 'imageUrl'>, error?: Error) {
    this.error('Image failed to load', {
      ...context,
      imageUrl
    }, error);
  }

  /**
   * Log asset extraction operations
   */
  static logAssetExtraction(postId: string, assetsFound: number, context?: LogContext) {
    this.info('Assets extracted from post body', {
      ...context,
      postId,
      assetsFound
    });
  }

  /**
   * Log header image selection
   */
  static logHeaderImageSelection(
    postId: string, 
    selectionType: 'main' | 'first-asset' | 'fallback' | 'ultimate-fallback',
    context?: LogContext
  ) {
    this.info('Header image selected', {
      ...context,
      postId,
      selectionType
    });
  }

  /**
   * Log component render errors
   */
  static logComponentError(component: string, error: Error, context?: Omit<LogContext, 'component'>) {
    this.error(`Component error in ${component}`, {
      ...context,
      component
    }, error);
  }

  /**
   * Send logs to external service (placeholder)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static sendToExternalService(logEntry: any) {
    // Implement your external logging service here
    // Examples: Sentry, LogRocket, DataDog, etc.
    
    // For now, just store in sessionStorage for debugging
    try {
      const logs = JSON.parse(sessionStorage.getItem('blog-logs') || '[]');
      logs.push(logEntry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      sessionStorage.setItem('blog-logs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to store log entry:', error);
    }
  }

  /**
   * Get stored logs (for debugging)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getStoredLogs(): any[] {
    try {
      return JSON.parse(sessionStorage.getItem('blog-logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Clear stored logs
   */
  static clearStoredLogs() {
    try {
      sessionStorage.removeItem('blog-logs');
    } catch (error) {
      console.warn('Failed to clear stored logs:', error);
    }
  }
}