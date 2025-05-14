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
-- Academic Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Python Programming Bootcamp', '2025-07-15', 'Computer Lab 3', 'Intensive 3-day bootcamp covering Python basics, data structures, and web development with Django. Perfect for beginners who want to learn programming.', 'Workshop', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg'),
('Research Paper Writing Workshop', '2025-06-05', 'Library Conference Room', 'Learn how to write effective research papers, proper citation methods, and academic writing techniques. Includes hands-on practice and peer review sessions.', 'Academic', 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg'),
('Mathematics Olympiad Prep', '2025-05-25', 'Room 201', 'Prepare for the national mathematics olympiad with intensive problem-solving sessions. Open to all students interested in advanced mathematics.', 'Academic', 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg');

-- Social Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('International Food Festival', '2025-04-28', 'Student Center', 'Celebrate diversity with cuisines from around the world. Students showcase their cultural dishes, music, and traditions. Free tasting for all attendees!', 'Social', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'),
('Movie Night: Sci-Fi Marathon', '2025-05-18', 'Outdoor Amphitheater', 'Join us for an all-night sci-fi movie marathon under the stars. Bring blankets and snacks. Popcorn and drinks provided.', 'Social', 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'),
('Photography Club Exhibition', '2025-06-12', 'Art Gallery', 'Annual photography exhibition featuring works by student photographers. Themes include nature, portrait, and urban photography.', 'Social', 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg');

-- Sports Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Soccer Tournament Finals', '2025-05-22', 'Main Stadium', 'Championship match of the inter-faculty soccer tournament. Come support your faculty team in this exciting finale!', 'Sports', 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg'),
('Yoga and Wellness Day', '2025-04-15', 'Recreation Center', 'Full day of yoga sessions, meditation workshops, and wellness seminars. Learn stress management techniques and healthy living habits.', 'Sports', 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg'),
('Swimming Competition', '2025-06-08', 'Aquatic Center', 'Annual swimming competition featuring freestyle, butterfly, and relay events. Registration open to all students.', 'Sports', 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg');

-- Conference Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Entrepreneurship Summit', '2025-07-20', 'Business School Auditorium', 'Three-day summit featuring successful entrepreneurs, startup pitches, and networking sessions. Learn how to turn your ideas into successful businesses.', 'Conference', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg'),
('Climate Change Symposium', '2025-06-25', 'Environmental Sciences Building', 'International speakers discuss climate change solutions, renewable energy, and sustainable practices. Panel discussions and Q&A sessions included.', 'Conference', 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg'),
('Medical Innovation Conference', '2025-08-05', 'Medical School Hall', 'Latest advances in medical technology, AI in healthcare, and breakthrough treatments. Open to medical students and professionals.', 'Conference', 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg');

-- Workshop Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Digital Marketing Masterclass', '2025-05-30', 'Media Lab', 'Learn SEO, social media marketing, content creation, and analytics. Hands-on workshops with real-world case studies.', 'Workshop', 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg'),
('Robotics Workshop', '2025-06-15', 'Engineering Lab 2', 'Build and program your own robot! Learn Arduino programming, sensor integration, and basic robotics principles.', 'Workshop', 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg'),
('Public Speaking Skills', '2025-04-22', 'Communication Center', 'Overcome stage fright and develop confident public speaking skills. Practice presentations and receive constructive feedback.', 'Workshop', 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg');

-- Cultural Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Jazz Night', '2025-05-10', 'Music Hall', 'Evening of smooth jazz featuring the university jazz band and special guest performers. Wine and cheese reception included.', 'Social', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'),
('Art Workshop: Watercolor Painting', '2025-06-02', 'Art Studio 1', 'Learn watercolor techniques from professional artists. All materials provided. Suitable for beginners and intermediate artists.', 'Workshop', 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg'),
('Drama Club Performance', '2025-07-01', 'University Theater', 'Shakespeare''s "A Midsummer Night''s Dream" performed by the university drama club. Free admission for students.', 'Social', 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg');

-- Additional Academic Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Graduate School Information Session', '2025-05-08', 'Lecture Hall B', 'Information session for students interested in pursuing graduate studies. Learn about application processes, funding opportunities, and research programs.', 'Academic', 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg'),
('Mock UN Conference', '2025-06-28', 'Conference Center', 'Model United Nations conference simulating UN committees. Debate global issues and develop diplomatic skills.', 'Academic', 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg'),
('Science Fair 2025', '2025-07-10', 'Exhibition Hall', 'Annual science fair showcasing innovative student research projects. Cash prizes for top three projects in each category.', 'Academic', 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg');

-- Special Events
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Alumni Networking Night', '2025-05-28', 'Alumni House', 'Connect with successful alumni from various industries. Career advice, mentorship opportunities, and networking.', 'Social', 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg'),
('Hackathon 2025', '2025-06-20', 'Innovation Hub', '48-hour coding competition. Form teams, build innovative solutions, and win amazing prizes. Food and refreshments provided.', 'Workshop', 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg'),
('Graduation Ceremony', '2025-07-25', 'Grand Auditorium', 'Annual graduation ceremony celebrating the achievements of our graduating class. Reception to follow in the gardens.', 'Academic', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg');

-- Health and Wellness
INSERT INTO events (title, date, location, description, category, image_url) VALUES
('Mental Health Awareness Week', '2025-05-12', 'Student Wellness Center', 'Week-long series of workshops and talks about mental health, stress management, and available campus resources.', 'Workshop', 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg'),
('Blood Donation Drive', '2025-04-30', 'Health Center', 'Annual blood donation drive in partnership with the Red Cross. Save lives by donating blood. Free health check-up included.', 'Social', 'https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg'),
('Nutrition and Cooking Class', '2025-06-18', 'Campus Kitchen', 'Learn to cook healthy meals on a student budget. Professional chef demonstrates easy, nutritious recipes.', 'Workshop', 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg');


-- Insert sample comments
INSERT INTO comments (event_id, author_name, content) VALUES
(1, 'Sarah Johnson', 'Looking forward to this conference! Will there be recordings available for those who cannot attend in person?'),
(1, 'Mike Chen', 'Great lineup of speakers. I am particularly interested in the AI and blockchain sessions.'),
(2, 'Emily Davis', 'Can not wait for the music festival! Which bands will be performing this year?'),
(3, 'Robert Wilson', 'Do we need to register beforehand or can we just show up on the day?'),
(4, 'Lisa Park', 'This workshop sounds amazing. Is it suitable for beginners with no programming experience?');