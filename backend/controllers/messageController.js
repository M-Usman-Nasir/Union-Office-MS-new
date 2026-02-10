import { query } from '../config/database.js';

// Get list of conversations (users the current user has chatted with)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // Get distinct other users + last message + unread count
    const result = await query(
      `WITH partners AS (
        SELECT DISTINCT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS partner_id
        FROM messages WHERE sender_id = $1 OR receiver_id = $1
      ),
      last_msg AS (
        SELECT DISTINCT ON (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
          CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS partner_id,
          m.body, m.created_at, m.read_at, m.sender_id
        FROM messages m
        WHERE m.sender_id = $1 OR m.receiver_id = $1
        ORDER BY CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END, m.created_at DESC
      ),
      unread_counts AS (
        SELECT receiver_id AS partner_id, COUNT(*) AS unread
        FROM messages WHERE receiver_id = $1 AND read_at IS NULL
        GROUP BY receiver_id
      )
      SELECT u.id, u.name, u.email, u.role,
             lm.body AS last_message, lm.created_at AS last_at, lm.sender_id = $1 AS last_sent_by_me,
             COALESCE(uc.unread, 0)::int AS unread_count
      FROM partners p
      JOIN users u ON u.id = p.partner_id AND u.is_active = true
      LEFT JOIN last_msg lm ON lm.partner_id = p.partner_id
      LEFT JOIN unread_counts uc ON uc.partner_id = p.partner_id
      ORDER BY lm.created_at DESC NULLS LAST`,
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations', error: error.message });
  }
};

// Get messages with a specific user
export const getMessagesWith = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.userId, 10);
    if (!otherUserId) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Ensure user can chat with other: resident <-> union_admin of same society; super_admin with anyone
    const other = await query(
      'SELECT id, name, email, role, society_apartment_id FROM users WHERE id = $1 AND is_active = true',
      [otherUserId]
    );
    if (other.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const otherUser = other.rows[0];

    const role = req.user.role;
    if (role === 'resident') {
      if (otherUser.role !== 'union_admin' && otherUser.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'You can only message admins of your society' });
      }
      if (otherUser.role === 'union_admin' && otherUser.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({ success: false, message: 'You can only message admin of your society' });
      }
    } else if (role === 'union_admin') {
      if (otherUser.role === 'resident' && otherUser.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({ success: false, message: 'You can only message residents of your society' });
      }
      if (otherUser.role !== 'resident' && otherUser.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'Invalid conversation' });
      }
    }
    // super_admin can chat with anyone

    const messages = await query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.body, m.read_at, m.created_at,
              sender.name AS sender_name
       FROM messages m
       JOIN users sender ON sender.id = m.sender_id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at ASC`,
      [userId, otherUserId]
    );

    // Mark messages from other user as read
    await query(
      'UPDATE messages SET read_at = CURRENT_TIMESTAMP WHERE receiver_id = $1 AND sender_id = $2 AND read_at IS NULL',
      [userId, otherUserId]
    );

    res.json({ success: true, data: messages.rows, otherUser: { id: otherUser.id, name: otherUser.name, email: otherUser.email } });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { to_user_id, body } = req.body;
    if (!to_user_id || !body || !body.trim()) {
      return res.status(400).json({ success: false, message: 'Recipient and message body are required' });
    }
    const receiverId = parseInt(to_user_id, 10);

    const receiver = await query(
      'SELECT id, name, role, society_apartment_id FROM users WHERE id = $1 AND is_active = true',
      [receiverId]
    );
    if (receiver.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }
    const rec = receiver.rows[0];
    const role = req.user.role;

    if (role === 'resident') {
      if (rec.role !== 'union_admin' && rec.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'You can only message admins' });
      }
      if (rec.role === 'union_admin' && rec.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({ success: false, message: 'You can only message admin of your society' });
      }
    } else if (role === 'union_admin') {
      if (rec.role === 'resident' && rec.society_apartment_id !== req.user.society_apartment_id) {
        return res.status(403).json({ success: false, message: 'You can only message residents of your society' });
      }
      if (rec.role !== 'resident' && rec.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'Invalid recipient' });
      }
    }

    const result = await query(
      `INSERT INTO messages (sender_id, receiver_id, body) VALUES ($1, $2, $3) RETURNING *`,
      [senderId, receiverId, body.trim()]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
};

// Get chat partners for dropdown (admin: residents of society; resident: union_admin of society)
export const getChatPartners = async (req, res) => {
  try {
    const role = req.user.role;
    const societyId = req.user.society_apartment_id;

    if (role === 'resident') {
      const admins = await query(
        `SELECT id, name, email FROM users WHERE is_active = true AND society_apartment_id = $1
         AND role IN ('union_admin', 'super_admin') ORDER BY name`,
        [societyId]
      );
      return res.json({ success: true, data: admins.rows });
    }
    if (role === 'union_admin' && societyId) {
      const residents = await query(
        `SELECT id, name, email FROM users WHERE is_active = true AND society_apartment_id = $1 AND role = 'resident' ORDER BY name`,
        [societyId]
      );
      return res.json({ success: true, data: residents.rows });
    }
    if (role === 'super_admin') {
      const all = await query(
        `SELECT id, name, email, role FROM users WHERE is_active = true AND role IN ('union_admin', 'resident') ORDER BY role, name`
      );
      return res.json({ success: true, data: all.rows });
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Get chat partners error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch partners', error: error.message });
  }
};
