const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

const getLinks = async (req, res) => {
  try {
    console.log('Fetching links for user:', req.user.id);
    
    const links = await sql`
      SELECT id, user_id, title, url, description, type, click_count, created_at
      FROM links 
      WHERE user_id = ${req.user.id}
      ORDER BY created_at DESC
    `;
    
    console.log('Found links:', links);
    res.json({ links });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createLink = async (req, res) => {
  try {
    const { title, url, description, type } = req.body;
    const userId = req.user.id;
    
    console.log('Creating link:', { userId, title, url, description, type });

    // Validate required fields
    if (!title || !url || !type) {
      return res.status(400).json({ message: 'Title, URL, and type are required' });
    }

    // Add http:// if no protocol is specified
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    const newLink = await sql`
      INSERT INTO links (user_id, title, url, description, type, click_count)
      VALUES (${userId}, ${title}, ${formattedUrl}, ${description || ''}, ${type}, 0)
      RETURNING id, user_id, title, url, description, type, click_count, created_at
    `;
    
    console.log('Created link:', newLink[0]);
    res.status(201).json({ 
      success: true,
      message: 'Link created successfully',
      link: newLink[0] 
    });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create link',
      error: error.message 
    });
  }
};

const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description, icon, position } = req.body;
    
    // Verify link belongs to user
    const existingLink = await sql`
      SELECT * FROM links 
      WHERE id = ${id} AND user_id = ${req.user.id}
    `;
    
    if (existingLink.length === 0) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    const updatedLink = await sql`
      UPDATE links 
      SET 
        title = COALESCE(${title}, title),
        url = COALESCE(${url}, url),
        description = COALESCE(${description}, description),
        icon = COALESCE(${icon}, icon),
        position = COALESCE(${position}, position)
      WHERE id = ${id}
      RETURNING *
    `;
    
    res.json({ link: updatedLink[0] });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete link:', id);

    // First delete any associated clicks
    await sql`
      DELETE FROM clicks 
      WHERE link_id = ${id}
    `;
    console.log('Deleted associated clicks');

    // Then delete the link
    const result = await sql`
      DELETE FROM links 
      WHERE id = ${id} 
      AND user_id = ${req.user.id}
      RETURNING id
    `;
    console.log('Delete result:', result);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Link not found or unauthorized',
        linkId: id
      });
    }

    res.status(200).json({
      success: true,
      message: 'Link deleted successfully',
      linkId: id
    });

  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete link',
      error: error.message,
      linkId: req.params.id
    });
  }
};

module.exports = {
  getLinks,
  createLink,
  updateLink,
  deleteLink
}; 