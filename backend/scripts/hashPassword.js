import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query } from '../config/database.js';

dotenv.config();

const email = 'admin@homelandunion.com';
const newPassword = 'admin123'; // Change this to your desired password

console.log('🔐 Hashing password for user...\n');

try {
  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log('✅ Password hashed successfully');

  // Update user password
  const result = await query(
    'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email, name',
    [hashedPassword, email]
  );

  if (result.rows.length > 0) {
    console.log('\n✅ Password updated successfully!');
    console.log('User:', result.rows[0]);
    console.log('\n📝 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}\n`);
    process.exit(0);
  } else {
    console.error('\n❌ User not found:', email);
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
