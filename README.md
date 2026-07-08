# AI-Solutions: Enterprise Portal & Administrative Suite

AI-Solutions is a decoupled three-tier enterprise web portal and operational management system. It comprises a Node.js/Express RESTful API backend, a MongoDB database, and two Vite/React frontend modules: a public client-facing portal and a secure administrative dashboard.

---

## Project Structure

The codebase is organized into three distinct core modules, which reduces the security attack surface and optimizes build sizes:

```
Prototype Development/
├── backend/                  # Express RESTful API & database connections
│   ├── middleware/
│   │   └── auth.js           # JWT Authorization middleware
│   ├── models/               # Mongoose schemas with pre-save compatibility aliases
│   │   ├── Admin.js
│   │   ├── AdminLoginLog.js
│   │   ├── Article.js
│   │   ├── ChatbotLog.js
│   │   ├── EnquiryReport.js
│   │   ├── Event.js
│   │   ├── Gallery.js
│   │   ├── Inquiry.js
│   │   ├── Project.js
│   │   ├── Solution.js
│   │   └── Testimonial.js
│   ├── server.js             # API entrypoint, routes, and LLM Orchestration
│   ├── seed.js               # Dev database seeder
│   ├── migrate_aliases.js    # Schema field compatibility migration utility
│   ├── package.json
│   └── .env                  # Environment configurations
├── client/                   # Vite / React Public Client-Facing Portal
│   ├── src/                  # Portal components and user pages
│   │   ├── App.jsx           # Main portal layout and router
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── admin/                    # Vite / React Secure Administrative Suite
    ├── src/                  # Admin management dashboards and charts
    │   ├── App.jsx           # Analytical dashboard and CRUD forms
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Route Specifications

### Public Routes (No Authentication Required)

| Method | Endpoint | Description | Request Body Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Authenticate admin, log IP, and return JWT | `{ "username": "admin", "password": "password123" }` |
| **POST** | `/api/inquiries` | Submit user inquiry form | `{ "name": "Name", "email": "mail@domain.com", "phone": "12345", "companyName": "Co", "country": "US", "jobTitle": "Dev", "jobDetails": "Details" }` |
| **GET** | `/api/solutions` | List capability solutions | *None* |
| **GET** | `/api/projects` | List portfolio projects | *None* |
| **GET** | `/api/articles` | List published articles | *None* |
| **GET** | `/api/articles/:id` | Get details of a single article | *None* |
| **GET** | `/api/events` | List dynamic conferences/summits | *None* |
| **GET** | `/api/gallery` | Retrieve portfolio and office photos | *None* |
| **GET** | `/api/testimonials` | List client reviews | *None* |
| **POST** | `/api/testimonials` | Submit a client testimonial | `{ "customerName": "John", "companyName": "Tech", "reviewText": "Text", "rating": 5 }` |
| **POST** | `/api/chat` | Context-injected chatbot via Gemini / regex fallback | `{ "messages": [{ "role": "user", "content": "hello" }] }` |

---

### Admin Routes (Protected - Require Authentication)

All admin routes require a valid JSON Web Token to be sent in the request header:  
`Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Description | Request Body Payload |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/auth/profile` | Retrieve profile of the logged-in admin | *None* |
| **PUT** | `/api/auth/profile` | Update admin profile details | `{ "username": "new_admin", "email": "new@domain.com", "password": "new_password", "full_name": "New Name" }` |
| **GET** | `/api/inquiries` | Retrieve all inquiries | *None* |
| **GET** | `/api/inquiries/:id` | View a specific inquiry | *None* |
| **DELETE**| `/api/inquiries/:id` | Delete a specific inquiry | *None* |
| **POST** | `/api/solutions` | Create a new capability solution | `{ "title": "Service", "description": "Desc", "icon": "fa-cog", "status": "Active", "details": ["Sub-service"] }` |
| **PUT** | `/api/solutions/:id` | Update a capability solution | `{ "title": "New Title", "description": "New Desc", ... }` |
| **DELETE**| `/api/solutions/:id` | Delete a capability solution | *None* |
| **POST** | `/api/projects` | Create a new portfolio project | `{ "title": "Proj", "service_id": "ID", "industry": "Finance", "description": "Desc", "imageUrl": "url", "clientName": "Name", "date": "Q3 2026", "details": "Detailed stats" }` |
| **PUT** | `/api/projects/:id` | Update a portfolio project | `{ "title": "New Proj", ... }` |
| **DELETE**| `/api/projects/:id` | Delete a portfolio project | *None* |
| **POST** | `/api/articles` | Create a new article/blog | `{ "title": "Blog", "description": "Desc", "content": "Markdown Content", "imageUrl": "url", "author": "Admin", "category": "Tech", "featured": true }` |
| **PUT** | `/api/articles/:id` | Update an article | `{ "title": "New Blog", ... }` |
| **DELETE**| `/api/articles/:id` | Delete an article | *None* |
| **POST** | `/api/events` | Create a dynamic event | `{ "title": "Summit", "description": "Desc", "date": "2026-07-15", "location": "Silicon Valley", "image": "url", "isPromotional": true }` |
| **PUT** | `/api/events/:id` | Update an event | `{ "title": "New Summit", ... }` |
| **DELETE**| `/api/events/:id` | Delete an event | *None* |
| **POST** | `/api/gallery` | Add a photo/asset to gallery | `{ "imageUrl": "url", "caption": "Caption text", "category": "Office", "eventId": "event_id" }` |
| **DELETE**| `/api/gallery/:id` | Delete a gallery photo | *None* |
| **PUT** | `/api/testimonials/:id` | Modify/moderate a testimonial | `{ "customerName": "John", "companyName": "Tech Co", "reviewText": "Text", "rating": 5 }` |
| **DELETE**| `/api/testimonials/:id` | Delete a testimonial | *None* |
| **GET** | `/api/dashboard/analytics`| Retrieve analytical cohort stats and aggregate charts | *None* |
| **GET** | `/api/logs/login` | Retrieve administrative authentication audit logs | *None* |
| **GET** | `/api/logs/chatbot` | Retrieve visitor query/response chatbot logs | *None* |
| **GET** | `/api/reports/enquiries`| Get all generated inquiry reports/notes | *None* |
| **POST** | `/api/reports/enquiries`| Create or append follow-up notes to an inquiry | `{ "enquiry_id": "id", "notes": "Contacted client", "inquiry_count": 1 }` |
| **DELETE**| `/api/reports/enquiries/:id` | Delete a specific inquiry report | *None* |

---

## Security Specifications

1. **Password Hashing (Bcrypt)**: Administrator credentials are protected using `bcryptjs` with a cost factor of `10` salt rounds, hashing passwords automatically via Mongoose pre-save hooks.
2. **Session Authorization (JWT)**: Authenticated endpoints use JSON Web Tokens (`jsonwebtoken`) signed with a backend `JWT_SECRET`. Tokens are set to expire in 24 hours and must be passed as `Bearer <token>` in the HTTP `Authorization` header.
3. **Admin Login Logging**: Audits administrative authentication attempts by recording timestamps, client IP addresses (handling proxy forwards), and captcha validation statuses.
4. **Chatbot Audit Logs**: Every exchange in the chatbot (input question and AI response) is logged inside MongoDB for administrators to screen for prompt injections and analyze client needs.
5. **Decoupled Frontend Bundles**: Administrative assets and logic are built entirely separately from the client portal, minimizing unauthorized discovery and exposure of administrative components.

---

## Supported Image Formats

Images are represented throughout the database as URL strings pointing to files hosted either locally or on remote services (such as Unsplash, CDNs, etc.). The frontends support all standard web-compatible formats:
* **Vector Graphics**: SVG (`.svg`)
* **Standard Raster**: PNG (`.png`), JPEG/JPG (`.jpeg`, `.jpg`)
* **Modern High-Compression**: WebP (`.webp`)
* **Animated/Dynamic**: GIF (`.gif`)

---

## Installation Requirements

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Database**: MongoDB (Local community server or MongoDB Atlas Cluster)
* **AI Chat (Optional)**: Google Gemini API Key (if absent, backend switches to local deterministic regex-based fallback engine)

---

## Installation Steps

1. **Clone or Extract Project Files**:
   Extract all project files into your desired workspace directory.

2. **Configure Environment Variables**:
   Navigate to the `backend/` directory, create a `.env` file, and populate it with your configuration credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-solutions?appName=Cluster0
   JWT_SECRET=your_custom_cryptographic_jwt_key
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

3. **Install Dependencies**:
   Open a terminal in the root folder and install dependencies in all three modules:
   * **Backend**:
     ```bash
     cd backend
     npm install
     ```
   * **Client Portal**:
     ```bash
     cd ../client
     npm install
     ```
   * **Admin Dashboard**:
     ```bash
     cd ../admin
     npm install
     ```

4. **Initialize Database**:
   Navigate back to the `backend/` directory and seed the database with initial mock categories, blog posts, and the default admin credentials:
   ```bash
   cd ../backend
   node seed.js
   ```
   *(Optional)* To synchronize field aliases if schema adjustments have occurred, run:
   ```bash
   node migrate_aliases.js
   ```

5. **Start Servers**:
   Open separate terminal windows for each module to start their respective development servers:
   * **Backend server** (runs on `http://localhost:5000`):
     ```bash
     cd backend
     npm run dev
     ```
   * **Client Portal** (runs on `http://localhost:3000`):
     ```bash
     cd client
     npm run dev
     ```
   * **Admin Dashboard** (runs on `http://localhost:3001`):
     ```bash
     cd admin
     npm run dev
     ```

6. **Access App Modules**:
   * **Public Portal**: [http://localhost:3000](http://localhost:3000)
   * **Admin Dashboard**: [http://localhost:3001](http://localhost:3001)
   * **Default Admin Credentials**:
     * **Username**: `admin`
     * **Password**: `password123`
