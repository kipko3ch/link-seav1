const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

const trackClick = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { referrer } = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    // Record the click
    await sql`
      INSERT INTO clicks (link_id, referrer, user_agent, ip_address)
      VALUES (${linkId}, ${referrer}, ${userAgent}, ${ipAddress})
    `;

    // Update the click count
    await sql`
      UPDATE links 
      SET click_count = click_count + 1 
      WHERE id = ${linkId}
    `;

    res.status(200).json({ message: 'Click tracked successfully' });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLinkStats = async (req, res) => {
  try {
    const { linkId } = req.params;
    
    // Get link details with click count
    const linkStats = await sql`
      SELECT l.*, COUNT(c.id) as total_clicks,
        COUNT(DISTINCT c.ip_address) as unique_visitors,
        json_agg(json_build_object(
          'clicked_at', c.clicked_at,
          'referrer', c.referrer
        )) as click_history
      FROM links l
      LEFT JOIN clicks c ON c.link_id = l.id
      WHERE l.id = ${linkId}
      GROUP BY l.id
    `;

    if (linkStats.length === 0) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json({ stats: linkStats[0] });
  } catch (error) {
    console.error('Error fetching link stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  trackClick,
  getLinkStats
}; 