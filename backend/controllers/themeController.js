const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

const getThemes = async (req, res) => {
  try {
    const themes = await sql`
      SELECT * FROM themes 
      WHERE user_id = ${req.user.id}
      ORDER BY id ASC
    `;
    
    res.json({ themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTheme = async (req, res) => {
  try {
    const { name, background_color, text_color, accent_color } = req.body;
    
    const newTheme = await sql`
      INSERT INTO themes (user_id, name, background_color, text_color, accent_color)
      VALUES (${req.user.id}, ${name}, ${background_color}, ${text_color}, ${accent_color})
      RETURNING *
    `;
    
    res.status(201).json({ theme: newTheme[0] });
  } catch (error) {
    console.error('Error creating theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, background_color, text_color, accent_color, is_active } = req.body;
    
    // Verify theme belongs to user
    const existingTheme = await sql`
      SELECT * FROM themes 
      WHERE id = ${id} AND user_id = ${req.user.id}
    `;
    
    if (existingTheme.length === 0) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    // If setting this theme as active, deactivate all other themes first
    if (is_active) {
      await sql`
        UPDATE themes 
        SET is_active = false 
        WHERE user_id = ${req.user.id}
      `;
    }
    
    const updatedTheme = await sql`
      UPDATE themes 
      SET 
        name = COALESCE(${name}, name),
        background_color = COALESCE(${background_color}, background_color),
        text_color = COALESCE(${text_color}, text_color),
        accent_color = COALESCE(${accent_color}, accent_color),
        is_active = COALESCE(${is_active}, is_active)
      WHERE id = ${id}
      RETURNING *
    `;
    
    res.json({ theme: updatedTheme[0] });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify theme belongs to user
    const existingTheme = await sql`
      SELECT * FROM themes 
      WHERE id = ${id} AND user_id = ${req.user.id}
    `;
    
    if (existingTheme.length === 0) {
      return res.status(404).json({ message: 'Theme not found' });
    }
    
    await sql`
      DELETE FROM themes 
      WHERE id = ${id}
    `;
    
    res.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    console.error('Error deleting theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getActiveTheme = async (req, res) => {
  try {
    const activeTheme = await sql`
      SELECT * FROM themes 
      WHERE user_id = ${req.user.id} AND is_active = true
      LIMIT 1
    `;
    
    if (activeTheme.length === 0) {
      return res.status(404).json({ message: 'No active theme found' });
    }
    
    res.json({ theme: activeTheme[0] });
  } catch (error) {
    console.error('Error fetching active theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  getActiveTheme
}; 