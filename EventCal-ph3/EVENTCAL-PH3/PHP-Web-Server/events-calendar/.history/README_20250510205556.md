# Events Calendar - Campus Hub

A full-stack web application for managing campus events, built as part of the Campus Hub project. This module allows users to view, create, edit, and delete events, as well as add comments to events.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Phase Completion](#phase-completion)
- [Troubleshooting](#troubleshooting)

## Features

- **Event Management**: Create, read, update, and delete events
- **Event Categories**: Filter events by categories (Academic, Social, Conference, Workshop, Sports)
- **Search Functionality**: Search events by title, description, or location
- **Sorting**: Sort events by date or title
- **Pagination**: Navigate through events with pagination controls
- **Comments System**: Add and delete comments on events
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean, professional design with smooth animations

## Technologies Used

### Frontend
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- JavaScript (ES6+)
- Font Awesome Icons
- Fetch API for AJAX requests

### Backend
- PHP 7.4+
- MySQL/MariaDB
- PDO for database connections
- RESTful API architecture

## Project Structure

```
events-calendar/
├── backend/
│   ├── api/
│   │   ├── config/
│   │   │   └── database.php         # Database configuration
│   │   ├── endpoints/
│   │   │   ├── events/
│   │   │   │   ├── create.php       # Create event endpoint
│   │   │   │   ├── read.php         # Read events endpoint
│   │   │   │   ├── update.php       # Update event endpoint
│   │   │   │   ├── delete.php       # Delete event endpoint
│   │   │   │   └── search.php       # Search events endpoint
│   │   │   └── comments/
│   │   │       ├── create.php       # Create comment endpoint
│   │   │       ├── read.php         # Read comments endpoint
│   │   │       └── delete.php       # Delete comment endpoint
│   │   └── index.php                # API router
│   └── database/
│       └── setup.sql                # Database schema and sample data
├── frontend/
│   ├── css/
│   │   └── styles.css               # Main stylesheet
│   ├── js/
│   │   ├── events.js                # Events listing page JavaScript
│   │   ├── event-details.js         # Event details page JavaScript
│   │   └── create-event.js          # Create/Edit event JavaScript
│   ├── index.html                   # Landing page
│   ├── events.html                  # Events listing page
│   ├── event-details.html           # Event details page
│   └── create-event.html            # Create/Edit event page
└── README.md                        # Project documentation
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/events-calendar.git
   cd events-calendar
   ```

2. **Set up a local development environment**
   - Install XAMPP, WAMP, MAMP, or similar local server software
   - Or use PHP's built-in server (requires PHP 7.4+)

## Database Setup

1. **Create the database**
   - Open phpMyAdmin or MySQL command line
   - Create a new database:
     ```sql
     CREATE DATABASE campus_hub;
     ```

2. **Import the database schema**
   - Navigate to `backend/database/setup.sql`
   - Import this file into your MySQL database:
     ```bash
     mysql -u root -p campus_hub < backend/database/setup.sql
     ```
   - Or use phpMyAdmin to import the file

3. **Update database credentials**
   - Open `backend/api/config/database.php`
   - Update the following variables with your database credentials:
     ```php
     private $host = "localhost";
     private $database_name = "campus_hub";
     private $username = "root";     // Your MySQL username
     private $password = "";         // Your MySQL password
     ```

## Configuration

1. **Update API URLs in Frontend**
   - Open each JavaScript file in `frontend/js/`
   - Update the `API_BASE_URL` constant:
     ```javascript
     const API_BASE_URL = 'http://localhost/events-calendar/backend/api';
     ```
   - Adjust the URL based on your server configuration

2. **Configure CORS (if needed)**
   - The API already includes CORS headers
   - If you encounter CORS issues, ensure the frontend URL is allowed in `backend/api/index.php`

## Running the Application

### Option 1: Using XAMPP/WAMP/MAMP

1. **Place the project in the web root**
   - Copy the entire `events-calendar` folder to:
     - XAMPP: `C:\xampp\htdocs\`
     - WAMP: `C:\wamp\www\`
     - MAMP: `/Applications/MAMP/htdocs/`

2. **Start the server**
   - Launch XAMPP/WAMP/MAMP control panel
   - Start Apache and MySQL services

3. **Access the application**
   - Open your browser and navigate to:
     ```
     http://localhost/events-calendar/frontend/
     ```

### Option 2: Using PHP Built-in Server

1. **Start the PHP server**
   ```bash
   # Navigate to the project root
   cd events-calendar
   
   # Start the server on port 8000
   php -S localhost:8000
   ```

2. **Access the application**
   - Open your browser and navigate to:
     ```
     http://localhost:8000/frontend/
     ```

### Option 3: Deployment on Replit

1. **Create a new PHP project on Replit**
2. **Upload the project files** maintaining the folder structure
3. **Set up the database**
   - Use Replit's database or connect to an external MySQL database
   - Import the `setup.sql` file
4. **Update configurations**
   - Update database credentials in `database.php`
   - Update API URLs in JavaScript files to match your Replit URL
5. **Run the application**

## API Documentation

### Events Endpoints

#### Get All Events
```
GET /backend/api/events
Query Parameters:
- page (optional): Page number for pagination
- limit (optional): Number of items per page
- search (optional): Search term
- category (optional): Filter by category
- sort (optional): Sort field (date, title)
- order (optional): Sort order (ASC, DESC)
```

#### Get Single Event
```
GET /backend/api/events/{id}
```

#### Create Event
```
POST /backend/api/events
Body (JSON):
{
  "title": "Event Title",
  "date": "2025-05-15",
  "location": "Main Auditorium",
  "description": "Event description",
  "category": "Academic",
  "image_url": "https://example.com/image.jpg"
}
```

#### Update Event
```
PUT /backend/api/events/{id}
Body: Same as create
```

#### Delete Event
```
DELETE /backend/api/events/{id}
```

### Comments Endpoints

#### Get Comments for Event
```
GET /backend/api/comments?event_id={event_id}
```

#### Create Comment
```
POST /backend/api/comments
Body (JSON):
{
  "event_id": 1,
  "author_name": "John Doe",
  "content": "Comment content"
}
```

#### Delete Comment
```
DELETE /backend/api/comments/{id}
```

## Phase Completion

### Phase 1 - HTML/CSS Structure ✓
- Responsive layouts for all pages
- Event listing grid
- Event detail view
- Create/edit event forms
- Comments section design

### Phase 2 - JavaScript Functionality ✓
- Dynamic content rendering
- Search and filtering
- Form validation
- Pagination
- Error handling
- Mock data integration

### Phase 3 - PHP Backend API ✓
- RESTful API endpoints
- CRUD operations for events
- Comments system
- Database integration
- Input validation and sanitization
- Error handling

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `database.php`
   - Ensure the database exists

2. **404 Errors on API Requests**
   - Check the API URL in JavaScript files
   - Verify the .htaccess file (if using Apache)
   - Ensure the API router is accessible

3. **CORS Issues**
   - Check that CORS headers are present in `index.php`
   - Ensure the frontend URL matches the allowed origin

4. **Events Not Loading**
   - Check browser console for errors
   - Verify API endpoints are returning data
   - Ensure database contains sample data

### Debug Mode

To enable debug mode, you can modify `database.php`:
```php
// Add this at the top of database.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## License

This project is part of the Campus Hub academic project.

## Contributors

- Your Name - Events Calendar Module

## Contact

For questions or support, please contact the project team.