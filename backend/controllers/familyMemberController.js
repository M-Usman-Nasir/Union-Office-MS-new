import { query } from '../config/database.js';

// Get all family members for a resident
export const getByResidentId = async (req, res) => {
  try {
    const { id: residentId } = req.params;

    const result = await query(
      `SELECT id, resident_id, name, relation, created_at, updated_at
       FROM family_members
       WHERE resident_id = $1
       ORDER BY name`,
      [residentId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch family members',
      error: error.message,
    });
  }
};

// Create family member for a resident
export const create = async (req, res) => {
  try {
    const { id: residentId } = req.params;
    const { name, relation } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    const result = await query(
      `INSERT INTO family_members (resident_id, name, relation)
       VALUES ($1, $2, $3)
       RETURNING id, resident_id, name, relation, created_at, updated_at`,
      [residentId, name.trim(), (relation && relation.trim()) || null]
    );

    res.status(201).json({
      success: true,
      message: 'Family member added successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add family member',
      error: error.message,
    });
  }
};

// Update family member
export const update = async (req, res) => {
  try {
    const { id: residentId, fmId } = req.params;
    const { name, relation } = req.body;

    const result = await query(
      `UPDATE family_members
       SET name = COALESCE(NULLIF(TRIM($1), ''), name),
           relation = CASE WHEN $2 IS NOT NULL THEN NULLIF(TRIM($2), '') ELSE relation END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND resident_id = $4
       RETURNING id, resident_id, name, relation, updated_at`,
      [name, relation, fmId, residentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found',
      });
    }

    res.json({
      success: true,
      message: 'Family member updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update family member',
      error: error.message,
    });
  }
};

// Delete family member
export const remove = async (req, res) => {
  try {
    const { id: residentId, fmId } = req.params;

    const result = await query(
      'DELETE FROM family_members WHERE id = $1 AND resident_id = $2 RETURNING id',
      [fmId, residentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found',
      });
    }

    res.json({
      success: true,
      message: 'Family member removed successfully',
    });
  } catch (error) {
    console.error('Delete family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove family member',
      error: error.message,
    });
  }
};
