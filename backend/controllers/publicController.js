const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

const getPublicPage = async (req, res) => {
  try {
    const { username } = req.params;

    // Get user and their active theme
    const users = await sql`
      SELECT id, username, email, bio
      FROM users 
      WHERE username = ${username}
    `;

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Get user's links
    const links = await sql`
      SELECT 
        id, 
        title, 
        url, 
        description, 
        type,
        position,
        click_count
      FROM links 
      WHERE user_id = ${user.id}
      ORDER BY position ASC
    `;

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio
      },
      links
    });
  } catch (error) {
    console.error('Error fetching public page:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPublicPage
}; 