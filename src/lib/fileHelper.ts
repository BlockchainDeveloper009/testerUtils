/**
 * File operations helper
 */

import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

export class FileHelper {
  /**
   * Read file asynchronously
   */
  static async readFile(filePath: string): Promise<string> {
    try {
      logger.debug(`Reading file: ${filePath}`, { module: 'FileHelper' });
      const absolutePath = path.resolve(filePath);
      const data = await fs.promises.readFile(absolutePath, 'utf8');
      logger.info(`File read successfully: ${filePath}`, { module: 'FileHelper' }, { size: data.length });
      return data;
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error as Error, { module: 'FileHelper' });
      throw error;
    }
  }

  /**
   * Write file asynchronously
   */
  static async writeFile(filePath: string, data: string): Promise<void> {
    try {
      logger.debug(`Writing file: ${filePath}`, { module: 'FileHelper' });
      const absolutePath = path.resolve(filePath);
      const dir = path.dirname(absolutePath);

      // Ensure directory exists
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
        logger.debug(`Created directory: ${dir}`, { module: 'FileHelper' });
      }

      await fs.promises.writeFile(absolutePath, data, 'utf8');
      logger.info(`File written successfully: ${filePath}`, { module: 'FileHelper' }, { size: data.length });
    } catch (error) {
      logger.error(`Failed to write file: ${filePath}`, error as Error, { module: 'FileHelper' });
      throw error;
    }
  }

  /**
   * Delete file asynchronously
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      logger.debug(`Deleting file: ${filePath}`, { module: 'FileHelper' });
      const absolutePath = path.resolve(filePath);

      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        logger.info(`File deleted successfully: ${filePath}`, { module: 'FileHelper' });
      } else {
        logger.warn(`File not found: ${filePath}`, { module: 'FileHelper' });
      }
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error as Error, { module: 'FileHelper' });
      throw error;
    }
  }

  /**
   * Check if file exists
   */
  static fileExists(filePath: string): boolean {
    const absolutePath = path.resolve(filePath);
    return fs.existsSync(absolutePath);
  }

  /**
   * Read JSON file
   */
  static async readJson<T>(filePath: string): Promise<T> {
    try {
      const content = await this.readFile(filePath);
      return JSON.parse(content) as T;
    } catch (error) {
      logger.error(`Failed to parse JSON file: ${filePath}`, error as Error, { module: 'FileHelper' });
      throw error;
    }
  }

  /**
   * Write JSON file
   */
  static async writeJson<T>(filePath: string, data: T, pretty: boolean = true): Promise<void> {
    try {
      const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      await this.writeFile(filePath, content);
    } catch (error) {
      logger.error(`Failed to write JSON file: ${filePath}`, error as Error, { module: 'FileHelper' });
      throw error;
    }
  }

  /**
   * Get file stats
   */
  static async getStats(filePath: string): Promise<fs.Stats> {
    try {
      const absolutePath = path.resolve(filePath);
      return await fs.promises.stat(absolutePath);
    } catch (error) {
      logger.error(`Failed to get file stats: ${filePath}`, error as Error, { module: 'FileHelper' });
      throw error;
    }
  }

  /**
   * List files in directory
   */
  static async listFiles(dirPath: string): Promise<string[]> {
    try {
      const absolutePath = path.resolve(dirPath);
      const files = await fs.promises.readdir(absolutePath);
      logger.debug(`Listed files in: ${dirPath}`, { module: 'FileHelper' }, { count: files.length });
      return files;
    } catch (error) {
      logger.error(`Failed to list files in: ${dirPath}`, error as Error, { module: 'FileHelper' });
      throw error;
    }
  }
}

export default FileHelper;
