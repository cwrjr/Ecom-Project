import { 
  users, 
  projects, 
  services, 
  contactSubmissions,
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type Service,
  type InsertService,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private services: Map<number, Service>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentServiceId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.services = new Map();
    this.contactSubmissions = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentServiceId = 1;
    this.currentContactId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample projects
    const sampleProjects: Project[] = [
      {
        id: this.currentProjectId++,
        title: "E-Commerce Platform",
        description: "Full-stack React application with payment integration, inventory management, and real-time analytics dashboard.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        demoUrl: "https://ecommerce-demo.example.com",
        codeUrl: "https://github.com/developer/ecommerce-platform",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProjectId++,
        title: "Task Management App",
        description: "Collaborative project management tool with real-time updates, team chat, and advanced reporting features.",
        technologies: ["Next.js", "Socket.io", "PostgreSQL"],
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        demoUrl: "https://taskmanager-demo.example.com",
        codeUrl: "https://github.com/developer/task-manager",
        featured: true,
        createdAt: new Date(),
      },
      {
        id: this.currentProjectId++,
        title: "Analytics Dashboard",
        description: "Business intelligence platform with interactive charts, predictive analytics, and customizable reports.",
        technologies: ["React", "D3.js", "Python", "AWS"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        demoUrl: "https://analytics-demo.example.com",
        codeUrl: "https://github.com/developer/analytics-dashboard",
        featured: true,
        createdAt: new Date(),
      },
    ];

    sampleProjects.forEach(project => {
      this.projects.set(project.id, project);
    });

    // Initialize sample services
    const sampleServices: Service[] = [
      {
        id: this.currentServiceId++,
        title: "Full-Stack Development",
        description: "End-to-end web application development from concept to deployment, including frontend, backend, and database architecture.",
        icon: "fas fa-laptop-code",
        features: ["React/Next.js Applications", "RESTful API Development", "Database Design & Integration", "Performance Optimization"],
      },
      {
        id: this.currentServiceId++,
        title: "Mobile-First Design",
        description: "Creating seamless user experiences across all devices with responsive design and progressive web app capabilities.",
        icon: "fas fa-mobile-alt",
        features: ["Cross-Platform Compatibility", "PWA Development", "Touch-Optimized UI", "Offline Functionality"],
      },
      {
        id: this.currentServiceId++,
        title: "API Development",
        description: "Robust backend solutions with RESTful APIs, database design, and third-party integrations for scalable applications.",
        icon: "fas fa-database",
        features: ["RESTful Architecture", "Database Optimization", "Cloud Integration", "Security Implementation"],
      },
    ];

    sampleServices.forEach(service => {
      this.services.set(service.id, service);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.featured)
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new MemStorage();
