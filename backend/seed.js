import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all 11 models
import Admin from './models/Admin.js';
import Solution from './models/Solution.js';
import Project from './models/Project.js';
import Article from './models/Article.js';
import Event from './models/Event.js';
import Gallery from './models/Gallery.js';
import Testimonial from './models/Testimonial.js';
import Inquiry from './models/Inquiry.js';
import EnquiryReport from './models/EnquiryReport.js';
import ChatbotLog from './models/ChatbotLog.js';
import AdminLoginLog from './models/AdminLoginLog.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("No MONGODB_URI in .env file");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to database.");

    // Clean old data to ensure associations link correctly
    console.log("Clearing all existing collections...");
    await Admin.deleteMany({});
    await Solution.deleteMany({});
    await Project.deleteMany({});
    await Article.deleteMany({});
    await Event.deleteMany({});
    await Gallery.deleteMany({});
    await Testimonial.deleteMany({});
    await Inquiry.deleteMany({});
    await EnquiryReport.deleteMany({});
    await ChatbotLog.deleteMany({});
    await AdminLoginLog.deleteMany({});
    console.log("Collections cleared.");

    // 1. Seed Admin
    console.log("Seeding default admin...");
    const defaultAdmin = new Admin({
      username: "admin",
      email: "admin@ai-solutions.com",
      password: "password123", // Will be hashed by pre-save hook
      full_name: "System Administrator",
      role: "Admin"
    });
    await defaultAdmin.save();
    console.log("Default admin created (admin / password123)");

    // 2. Seed Solutions
    console.log("Seeding solutions...");
    const solutionsData = [
      {
        title: "AI-Powered Predictive Analytics",
        description: "Transform business data into actionable forecasts using advanced machine learning models tailored to your industry.",
        icon: "chart-line",
        status: "Active",
        details: [
          "Customer churn prediction",
          "Sales forecasting & inventory optimization",
          "Automated reporting dashboards",
          "Integration with existing CRM/ERP systems"
        ]
      },
      {
        title: "Custom Enterprise Software Development",
        description: "End-to-end development of robust, scalable applications designed to streamline operations and enhance productivity.",
        icon: "code",
        status: "Active",
        details: [
          "Microservices architecture",
          "Cloud-native solutions (AWS, GCP, Azure)",
          "Legacy system modernization",
          "Responsive cross-platform development"
        ]
      },
      {
        title: "Cybersecurity & Compliance Auditing",
        description: "Protect your intellectual property and user data with state-of-the-art vulnerability scanning and compliance frameworks.",
        icon: "shield-halved",
        status: "Active",
        details: [
          "SOC 2 and ISO 27001 readiness",
          "Continuous penetration testing",
          "Zero Trust network architecture implementation",
          "Employee security training & simulation"
        ]
      },
      {
        title: "Cloud Infrastructure & DevOps Automation",
        description: "Migrate workflows to the cloud and automate build/deploy pipelines for 99.9% uptime and rapid deployment cycles.",
        icon: "cloud",
        status: "Active",
        details: [
          "Infrastructure as Code (Terraform)",
          "CI/CD pipeline setup (GitHub Actions, Jenkins)",
          "Kubernetes & Docker container orchestration",
          "Automated cost optimization audits"
        ]
      }
    ];
    const seededSolutions = await Solution.insertMany(solutionsData);
    console.log(`Solutions seeded: ${seededSolutions.length}`);

    // 3. Seed Projects (linked to Solutions via service_id)
    console.log("Seeding projects...");
    const analyticsSol = seededSolutions.find(s => s.title.includes("Analytics"));
    const softwareSol = seededSolutions.find(s => s.title.includes("Software"));
    const securitySol = seededSolutions.find(s => s.title.includes("Cybersecurity"));

    const projectsData = [
      {
        title: "AI-Driven Smart Logistics Engine",
        description: "Built a route-optimization engine for a multinational logistics firm that reduced delivery times by 18% and fuel costs by 12%.",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
        clientName: "Global Express Logistics",
        date: "Q3 2025",
        details: "Leveraged real-time traffic data, historical delivery windows, and machine learning models to dynamically reroute active fleets.",
        service_id: analyticsSol?._id
      },
      {
        title: "Decentralized Fintech Payment API",
        description: "Engineered a low-latency payment processing middleware capable of routing 50,000 transactions per second securely.",
        imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600",
        clientName: "NestaPay Inc.",
        date: "Q1 2026",
        details: "Designed utilizing Go and Node.js microservices with a MongoDB storage layer. Implemented end-to-end encryption complying with PCI-DSS.",
        service_id: softwareSol?._id
      },
      {
        title: "Healthtech Automated Patient Screening UI",
        description: "Developed a secure dashboard interface integrating radiology imaging AI, enabling clinicians to identify critical findings 3x faster.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
        clientName: "St. Jude Healthcare Group",
        date: "Q4 2025",
        details: "Constructed using React and Express. HIPAA-compliant server infrastructure utilizing AWS GovCloud.",
        service_id: analyticsSol?._id
      }
    ];
    await Project.insertMany(projectsData);
    console.log("Projects seeded successfully.");

    // 4. Seed Articles
    console.log("Seeding articles...");
    const articlesData = [
      {
        title: "Maximizing ROI: Implementing Predictive AI in Traditional Retail",
        description: "Discover how mid-sized retail operations can integrate predictive AI into supply chain management without massive capital investments.",
        content: "Enterprise AI is no longer a luxury reserved for tech giants. Mid-sized retailers are facing rising storage costs and unpredictable consumer behaviors. By implementing lightweight predictive analytics engines that hook directly into existing inventory databases, businesses can forecast demand with up to 88% accuracy. Key steps include data cleansing, selecting the right features (holidays, historical sales, local weather), and training lightweight regression models. In this post, we outline the exact roadmap to launch your first predictive analytics pilot program in less than six weeks.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
        author: "Sarah Jenkins (Principal Consultant)",
        category: "Artificial Intelligence",
        date: new Date('2026-05-15'),
        featured: true
      },
      {
        title: "Zero Trust Architecture: The Modern Cybersecurity Standard",
        description: "Why firewalls are no longer sufficient to secure corporate assets in a remote-first workspace, and how to start shifting to Zero Trust.",
        content: "The concept of a secure perimeter is dead. With employees working from home, co-working spaces, and cafes, relying on VPNs and perimeter firewalls leaves networks vulnerable to lateral movement once breached. Zero Trust operates on the principle of 'never trust, always verify'. Every request, whether originating inside or outside the network, must be authenticated, authorized, and encrypted. This article breaks down the three core pillars of Zero Trust: verify explicitly, use least privilege access, and assume breach.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
        author: "Marcus Chen (CISO)",
        category: "Cybersecurity",
        date: new Date('2026-06-02'),
        featured: false
      },
      {
        title: "A Practical Guide to CI/CD Automation in 2026",
        description: "Streamline your development lifecycle, reduce manual testing bottlenecks, and deploy code multiple times daily with confidence.",
        content: "Continuous Integration and Continuous Deployment (CI/CD) is the heartbeat of any high-performing software team. By automating test suites, code linting, and staging deployments, developers can focus on writing features instead of fighting deployment scripts. In this guide, we walk through setting up a modern, cost-efficient CI/CD pipeline using GitHub Actions, Docker containers, and Kubernetes. We also discuss canary deployments, blue-green deployment strategies, and automated rollbacks when health metrics drop.",
        imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600",
        author: "Liam O'Connor (DevOps Lead)",
        category: "DevOps",
        date: new Date('2026-06-18'),
        featured: false
      }
    ];
    await Article.insertMany(articlesData);
    console.log("Articles seeded successfully.");

    // 5. Seed Events
    console.log("Seeding events...");
    const eventsData = [
      {
        title: "Global Tech Summit 2026",
        description: "Explore the future of generative AI, serverless systems, and cloud infrastructure. Networking events and live workshops led by industry leaders.",
        date: new Date('2026-09-10T09:00:00Z'),
        location: "Silicon Valley Convention Center, CA",
        isPromotional: true
      },
      {
        title: "Interactive Frontend Hackathon",
        description: "A 48-hour competitive hacking marathon where developers build outstanding, highly-accessible CSS/React designs with Framer Motion.",
        date: new Date('2026-11-05T09:00:00Z'),
        location: "Virtual Event Online",
        isPromotional: false
      },
      {
        title: "AI-Solutions Annual Tech Expo 2025",
        description: "Our previous annual technology showcase of emerging AI frameworks.",
        date: new Date('2025-09-12T09:00:00Z'),
        location: "Silicon Valley & Online",
        isPromotional: false
      }
    ];
    const seededEvents = await Event.insertMany(eventsData);
    console.log("Events seeded successfully.");

    // 6. Seed Gallery (linked to Events via eventId)
    console.log("Seeding gallery...");
    const galleryData = [
      {
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
        caption: "Opening Keynote at the 2025 AI-Solutions Summit",
        category: "Events",
        eventId: seededEvents[0]?._id
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
        caption: "Our Collaborative Design Studio in Austin, Texas",
        category: "Office",
        eventId: seededEvents[1]?._id
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
        caption: "Developers collaborating during our internal Hackathon",
        category: "Events",
        eventId: seededEvents[2]?._id
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
        caption: "Client feedback session for the Smart Logistics project",
        category: "Projects",
        eventId: seededEvents[0]?._id
      }
    ];
    await Gallery.insertMany(galleryData);
    console.log("Gallery seeded successfully.");

    // 7. Seed Testimonials
    console.log("Seeding testimonials...");
    const testimonialsData = [
      {
        customerName: "Eleanor Vance",
        companyName: "VP of Logistics, Global Express",
        reviewText: "AI-Solutions delivered exactly what was promised. Their predictive route engine saved us hundreds of hours of driver delays. The support team is incredibly responsive and knowledgeable.",
        rating: 5
      },
      {
        customerName: "David Kross",
        companyName: "Chief Technology Officer, NestaPay",
        reviewText: "The custom payment middleware built by AI-Solutions operates flawlessly under high-stress loads. Their code quality is exemplary, and their security auditing gave us full confidence in the launch.",
        rating: 5
      },
      {
        customerName: "Dr. Amanda Ross",
        companyName: "Director of Informatics, St. Jude Group",
        reviewText: "Their design team made an incredibly complex patient imaging workflow feel intuitive and user-friendly for our clinicians. A truly transformative partnership.",
        rating: 4
      }
    ];
    await Testimonial.insertMany(testimonialsData);
    console.log("Testimonials seeded successfully.");

    // 8. Seed Inquiries
    console.log("Seeding inquiries...");
    const inquiriesData = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 019-9999",
        companyName: "Acme Corp",
        country: "United States",
        jobTitle: "IT Director",
        jobDetails: "We are looking to implement a custom predictive analytics dashboard to analyze our supply chain data.",
        status: "Pending"
      },
      {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        phone: "+44 20 7946 0958",
        companyName: "TechNova Ltd",
        country: "United Kingdom",
        jobTitle: "Product Manager",
        jobDetails: "Need a secure payment gateway integration for our e-commerce platform.",
        status: "Pending"
      }
    ];
    const seededInquiries = await Inquiry.insertMany(inquiriesData);
    console.log("Inquiries seeded successfully.");

    // 9. Seed Enquiry Reports (linked to Inquiries via enquiry_id)
    console.log("Seeding enquiry reports...");
    const reportsData = [
      {
        enquiry_id: seededInquiries[0]._id,
        notes: "Initial review: Acme Corp is a high-priority lead. They need predictive analytics integration. Assigned to Sarah Jenkins.",
        inquiry_count: 1
      },
      {
        enquiry_id: seededInquiries[1]._id,
        notes: "Initial review: TechNova requires payment gateway support. Refer them to our Custom Enterprise Software solution.",
        inquiry_count: 1
      }
    ];
    await EnquiryReport.insertMany(reportsData);
    console.log("Enquiry reports seeded successfully.");

    // 10. Seed Chatbot Logs
    console.log("Seeding chatbot logs...");
    const chatbotLogsData = [
      {
        user_question: "What services do you offer?",
        bot_response: "We offer AI-Powered Predictive Analytics, Custom Enterprise Software Development, Cybersecurity & Compliance Auditing, and Cloud Infrastructure & DevOps Automation. Visit our Services page for details!"
      },
      {
        user_question: "Where is your office located?",
        bot_response: "AI-Solutions is headquartered at 100 Technology Way, Silicon Valley, CA. Our business hours are Monday through Friday, 9:00 AM to 6:00 PM PST."
      }
    ];
    await ChatbotLog.insertMany(chatbotLogsData);
    console.log("Chatbot logs seeded successfully.");

    // 11. Seed Admin Login Logs (linked to Admin via admin_id)
    console.log("Seeding admin login logs...");
    const loginLogsData = [
      {
        admin_id: defaultAdmin._id,
        captcha_status: "Passed",
        ip_address: "192.168.1.50"
      },
      {
        admin_id: defaultAdmin._id,
        captcha_status: "Passed",
        ip_address: "127.0.0.1"
      }
    ];
    await AdminLoginLog.insertMany(loginLogsData);
    console.log("Admin login logs seeded successfully.");

    console.log("All data seeded successfully! Closing connection.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n========================================================================');
      console.error('CRITICAL ERROR: Could not connect to any servers in your MongoDB Atlas cluster.');
      console.error('One common reason is that your current IP address is not whitelisted.');
      console.error('Please whitelist your current public IP address in your MongoDB Atlas dashboard:');
      console.error('https://cloud.mongodb.com/ -> Network Access -> Add IP Address');
      console.error('========================================================================\n');
    }
    process.exit(1);
  }
};

seedDatabase();
