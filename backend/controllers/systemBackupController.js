/* eslint-env node */
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { endPool, query } from '../config/database.js';
import {
  listBackups,
  createBackupFile,
  deleteBackupFile,
  terminateOtherSessions,
  runPgRestoreSync,
  factoryResetTruncateAll,
  assertSafeBackupFilename,
  getBackupDir,
} from '../services/systemBackupService.js';

export const list = async (req, res) => {
  try {
    const backups = await listBackups();
    return res.json({ success: true, data: backups });
  } catch (error) {
    console.error('systemBackup list:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to list backups',
    });
  }
};

export const create = async (req, res) => {
  try {
    const filename = await createBackupFile();
    return res.status(201).json({
      success: true,
      message: 'Backup created.',
      data: { filename },
    });
  } catch (error) {
    console.error('systemBackup create:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create backup',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { filename, confirm } = req.body || {};
    if (confirm !== 'DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Send JSON body: { "filename": "...", "confirm": "DELETE" }',
      });
    }
    assertSafeBackupFilename(filename);
    await deleteBackupFile(filename);
    return res.json({ success: true, message: 'Backup deleted.' });
  } catch (error) {
    console.error('systemBackup delete:', error);
    if (error.code === 'ENOENT') {
      return res.status(404).json({ success: false, message: 'Backup file not found.' });
    }
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete backup',
    });
  }
};

export const restore = async (req, res) => {
  try {
    const { filename, confirm } = req.body || {};
    if (confirm !== 'RESTORE') {
      return res.status(400).json({
        success: false,
        message: 'Send JSON body: { "filename": "...", "confirm": "RESTORE" }',
      });
    }
    const safe = assertSafeBackupFilename(filename);
    const fp = path.join(getBackupDir(), safe);
    if (!fs.existsSync(fp)) {
      return res.status(404).json({ success: false, message: 'Backup file not found.' });
    }

    res.json({
      success: true,
      message:
        'Restore started. The API process will exit when restore finishes — restart the backend manually.',
    });

    setImmediate(async () => {
      try {
        await terminateOtherSessions();
        await endPool();
        runPgRestoreSync(safe);
        console.log('[systemBackup] pg_restore completed');
      } catch (e) {
        console.error('[systemBackup] restore failed:', e);
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('systemBackup restore:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to start restore',
    });
  }
};

export const factoryReset = async (req, res) => {
  try {
    const { confirm, password } = req.body || {};
    if (confirm !== 'FACTORY RESET') {
      return res.status(400).json({
        success: false,
        message: 'Send JSON body: { "confirm": "FACTORY RESET", "password": "…" }',
      });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    const userRes = await query(
      'SELECT password FROM users WHERE id = $1 AND is_active = true AND deleted_at IS NULL',
      [req.user.id]
    );
    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
    const stored = userRes.rows[0].password;
    const passwordOk =
      (await bcrypt.compare(password, stored)) || password === stored;
    if (!passwordOk) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.',
      });
    }

    const result = await factoryResetTruncateAll();
    return res.json({
      success: true,
      message:
        'All application data in public tables was removed. Use POST /api/bootstrap with X-Bootstrap-Secret to create a super admin again if no users remain.',
      data: result,
    });
  } catch (error) {
    console.error('systemBackup factoryReset:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Factory reset failed',
    });
  }
};
