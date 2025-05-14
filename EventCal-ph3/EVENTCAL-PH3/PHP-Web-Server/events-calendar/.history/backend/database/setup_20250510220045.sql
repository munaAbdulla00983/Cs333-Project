-- Create database
CREATE DATABASE IF NOT EXISTS campus_hub;
USE campus_hub;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Tech Conference 2025', '2025-05-15', 'UOB Convention Center', 'Join us for the biggest tech event of the year, featuring industry leaders, workshops, and cutting-edge innovations. Network with professionals, attend hands-on sessions, and learn about the latest technological trends.', 'Conference', 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg'),
('Spring Music Festival', '2025-04-20', 'Campus Green', 'Annual spring music festival featuring student bands, food trucks, and outdoor activities. Come enjoy live performances from various genres including rock, jazz, and classical music.', 'Social', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'),
('Career Fair 2025', '2025-03-25', 'Sports Complex', 'Connect with top employers from various industries. Bring your resume and dress professionally. Over 100 companies will be present offering internships and full-time positions.', 'Academic', 'https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg'),
('AI Workshop Series', '2025-06-10', 'Computer Science Building', 'Learn the fundamentals of artificial intelligence and machine learning. This workshop series covers Python programming, neural networks, and practical applications of AI.', 'Workshop', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'),
('Basketball Championship', '2025-05-30', 'University Gymnasium', 'Inter-university basketball championship finals. Support our team as they compete for the regional title. Free entry for all students with valid ID.', 'Sports', 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg');


-- Insert sample comments
INSERT INTO comments (event_id, author_name, content) VALUES
(1, 'Sarah Johnson', 'Looking forward to this conference! Will there be recordings available for those who cannot attend in person?'),
(1, 'Mike Chen', 'Great lineup of speakers. I am particularly interested in the AI and blockchain sessions.'),
(2, 'Emily Davis', 'Can not wait for the music festival! Which bands will be performing this year?'),
(3, 'Robert Wilson', 'Do we need to register beforehand or can we just show up on the day?'),
(4, 'Lisa Park', 'This workshop sounds amazing. Is it suitable for beginners with no programming experience?');