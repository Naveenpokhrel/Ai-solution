import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Solution from './models/Solution.js';
import Project from './models/Project.js';
import Article from './models/Article.js';
import Event from './models/Event.js';
import Gallery from './models/Gallery.js';
import Testimonial from './models/Testimonial.js';

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

    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log("Seeding default admin...");
      const defaultAdmin = new Admin({
        username: "admin",
        email: "admin@ai-solutions.com",
        password: "password123" // Will be hashed by pre-save hook
      });
      await defaultAdmin.save();
      console.log("Default admin created (admin / password123)");
    } else {
      console.log("Admin collection not empty, skipping admin seed.");
    }

    // 2. Seed Solutions
    const solutionCount = await Solution.countDocuments();
    if (solutionCount === 0) {
      console.log("Seeding solutions...");
      const solutionsData = [
        {
          title: "AI-Powered Predictive Analytics",
          description: "Transform business data into actionable forecasts using advanced machine learning models tailored to your industry.",
          icon: "chart-line",
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
          details: [
            "Infrastructure as Code (Terraform)",
            "CI/CD pipeline setup (GitHub Actions, Jenkins)",
            "Kubernetes & Docker container orchestration",
            "Automated cost optimization audits"
          ]
        }
      ];
      await Solution.insertMany(solutionsData);
      console.log("Solutions seeded successfully.");
    } else {
      console.log("Solutions already exist, skipping seed.");
    }

    // 3. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log("Seeding projects...");
      const projectsData = [
        {
          title: "AI-Driven Smart Logistics Engine",
          description: "Built a route-optimization engine for a multinational logistics firm that reduced delivery times by 18% and fuel costs by 12%.",
          imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
          clientName: "Global Express Logistics",
          date: "Q3 2025",
          details: "Leveraged real-time traffic data, historical delivery windows, and machine learning models to dynamically reroute active fleets."
        },
        {
          title: "Decentralized Fintech Payment API",
          description: "Engineered a low-latency payment processing middleware capable of routing 50,000 transactions per second securely.",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600",
          clientName: "NestaPay Inc.",
          date: "Q1 2026",
          details: "Designed utilizing Go and Node.js microservices with a MongoDB storage layer. Implemented end-to-end encryption complying with PCI-DSS."
        },
        {
          title: "Healthtech Automated Patient Screening UI",
          description: "Developed a secure dashboard interface integrating radiology imaging AI, enabling clinicians to identify critical findings 3x faster.",
          imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
          clientName: "St. Jude Healthcare Group",
          date: "Q4 2025",
          details: "Constructed using React and Express. HIPAA-compliant server infrastructure utilizing AWS GovCloud."
        }
      ];
      await Project.insertMany(projectsData);
      console.log("Projects seeded successfully.");
    } else {
      console.log("Projects already exist, skipping seed.");
    }

    // 4. Seed Articles
    const articleCount = await Article.countDocuments();
    if (articleCount === 0) {
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
    } else {
      console.log("Articles already exist, skipping seed.");
    }

    // 5. Seed Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log("Seeding events...");
      const eventsData = [
        {
          title: "AI-Solutions Annual Tech Expo 2026",
          description: "Join our core engineers and industry leaders for a full-day showcase of emerging AI technologies, product updates, and hands-on developer workshops.",
          date: new Date('2026-08-12T09:00:00Z'),
          location: "Silicon Valley Convention Center & Virtual Stream",
          isPromotional: true
        },
        {
          title: "Cloud Migration Masterclass: Moving Safely",
          description: "A specialized technical workshop focusing on hybrid cloud strategies, security compliance during transit, and database synchronization.",
          date: new Date('2026-07-20T14:00:00Z'),
          location: "AI-Solutions Headquarters, Austin TX",
          isPromotional: false
        },
        {
          title: "Webinar: Next-Gen DevSecOps",
          description: "Learn how to embed automated security testing into your existing Kubernetes and Docker build pipelines without slowing down developers.",
          date: new Date('2026-07-05T16:00:00Z'),
          location: "Zoom Virtual Event",
          isPromotional: false
        }
      ];
      await Event.insertMany(eventsData);
      console.log("Events seeded successfully.");
    } else {
      console.log("Events already exist, skipping seed.");
    }

    // 6. Seed Gallery
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      console.log("Seeding gallery...");
      const galleryData = [
        {
          imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
          caption: "Opening Keynote at the 2025 AI-Solutions Summit",
          category: "Events"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
          caption: "Our Collaborative Design Studio in Austin, Texas",
          category: "Office"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
          caption: "Developers collaborating during our internal Hackathon",
          category: "Events"
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
          caption: "Client feedback session for the Smart Logistics project",
          category: "Projects"
        }
      ];
      await Gallery.insertMany(galleryData);
      console.log("Gallery seeded successfully.");
    } else {
      console.log("Gallery already exist, skipping seed.");
    }

    // 7. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
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
    } else {
      console.log("Testimonials already exist, skipping seed.");
    }

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
