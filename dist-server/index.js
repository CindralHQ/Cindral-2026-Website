// server/src/index.ts
import express9 from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

// server/src/config/db.ts
import mongoose from "mongoose";
var connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.VITE_MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
var db_default = connectDB;

// server/src/routes/divisionRoutes.ts
import express from "express";

// server/src/models/Division.ts
import mongoose2, { Schema } from "mongoose";

// types.ts
var DivisionType = /* @__PURE__ */ ((DivisionType2) => {
  DivisionType2["LABS"] = "Labs";
  DivisionType2["STUDIOS"] = "Studios";
  DivisionType2["IMMERSIVE"] = "Immersive";
  DivisionType2["ENTERTAINMENT"] = "Entertainment";
  return DivisionType2;
})(DivisionType || {});

// server/src/models/Division.ts
var DivisionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: Object.values(DivisionType), required: true },
  title: { type: String, required: true },
  tagline: { type: String, default: "" },
  description: { type: String, default: "" },
  iconName: { type: String, default: "FlaskConical" },
  color: { type: String, default: "text-white" },
  themeColor: { type: String, default: "#ffffff" },
  bannerImage: { type: String }
}, { timestamps: true });
var Division_default = mongoose2.model("Division", DivisionSchema);

// server/src/controllers/divisionController.ts
var getDivisions = async (_req, res) => {
  try {
    const divisions = await Division_default.find();
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createDivision = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const newDivision = new Division_default({
      id: payload.id || `div_${Date.now()}`,
      type: payload.type || "Labs" /* LABS */,
      title: payload.title,
      tagline: payload.tagline,
      description: payload.description,
      iconName: payload.iconName,
      color: payload.color,
      themeColor: payload.themeColor,
      bannerImage: payload.bannerImage
    });
    const savedDivision = await newDivision.save();
    res.status(201).json(savedDivision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const division = await Division_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }
    res.json(division);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Division_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Division not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/src/middleware/auth.ts
var tokens = /* @__PURE__ */ new Set();
var requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const [, token] = auth.split(" ");
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.token = token;
  return next();
};

// server/src/routes/divisionRoutes.ts
var router = express.Router();
router.get("/", getDivisions);
router.post("/", requireAuth, createDivision);
router.put("/:id", requireAuth, updateDivision);
router.delete("/:id", requireAuth, deleteDivision);
var divisionRoutes_default = router;

// server/src/routes/projectRoutes.ts
import express2 from "express";

// server/src/models/Project.ts
import mongoose3, { Schema as Schema2 } from "mongoose";
var ProjectSchema = new Schema2({
  id: { type: String, required: true, unique: true },
  divisionId: { type: String, required: true },
  title: { type: String, required: true },
  client: { type: String },
  summary: { type: String, default: "" },
  content: { type: String, default: "" },
  images: [{ type: String }],
  year: { type: String, default: () => (/* @__PURE__ */ new Date()).getFullYear().toString() }
}, { timestamps: true });
var Project_default = mongoose3.model("Project", ProjectSchema);

// server/src/controllers/projectController.ts
var getProjects = async (_req, res) => {
  try {
    const projects = await Project_default.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createProject = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title || !payload.divisionId) {
      return res.status(400).json({ message: "Title and divisionId are required" });
    }
    const newProject = new Project_default({
      id: payload.id || `proj_${Date.now()}`,
      divisionId: payload.divisionId,
      title: payload.title,
      client: payload.client,
      summary: payload.summary,
      content: payload.content,
      images: payload.images,
      year: payload.year
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const project = await Project_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Project_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/src/routes/projectRoutes.ts
var router2 = express2.Router();
router2.get("/", getProjects);
router2.post("/", requireAuth, createProject);
router2.put("/:id", requireAuth, updateProject);
router2.delete("/:id", requireAuth, deleteProject);
var projectRoutes_default = router2;

// server/src/routes/teamRoutes.ts
import express3 from "express";

// server/src/models/TeamMember.ts
import mongoose4, { Schema as Schema3 } from "mongoose";
var TeamMemberSchema = new Schema3({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, default: "" },
  image: { type: String, default: "" },
  linkedIn: { type: String },
  projectIds: [{ type: String }],
  csrActivities: [{ type: String }],
  skills: [{ type: String }],
  interests: [{ type: String }],
  quote: { type: String },
  learningStats: {
    currentStreak: { type: Number },
    totalHours: { type: Number },
    lastTopic: { type: String }
  },
  fitnessStats: {
    activityType: { type: String },
    weeklyMinutes: { type: Number },
    personalBest: { type: String }
  }
}, { timestamps: true });
var TeamMember_default = mongoose4.model("TeamMember", TeamMemberSchema);

// server/src/controllers/teamController.ts
var getTeam = async (_req, res) => {
  try {
    const team = await TeamMember_default.find();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createTeamMember = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.name || !payload.role) {
      return res.status(400).json({ message: "Name and role are required" });
    }
    const newMember = new TeamMember_default({
      id: payload.id || `team_${Date.now()}`,
      name: payload.name,
      role: payload.role,
      bio: payload.bio,
      image: payload.image,
      linkedIn: payload.linkedIn,
      projectIds: payload.projectIds,
      csrActivities: payload.csrActivities,
      skills: payload.skills,
      interests: payload.interests,
      quote: payload.quote,
      learningStats: payload.learningStats,
      fitnessStats: payload.fitnessStats
    });
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const member = await TeamMember_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TeamMember_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/src/routes/teamRoutes.ts
var router3 = express3.Router();
router3.get("/", getTeam);
router3.post("/", requireAuth, createTeamMember);
router3.put("/:id", requireAuth, updateTeamMember);
router3.delete("/:id", requireAuth, deleteTeamMember);
var teamRoutes_default = router3;

// server/src/routes/contactRoutes.ts
import express4 from "express";

// server/src/controllers/contactController.ts
import { nanoid } from "nanoid";

// server/src/models/ContactSubmission.ts
import mongoose5, { Schema as Schema4 } from "mongoose";
var ContactSubmissionSchema = new Schema4({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: "" },
  email: { type: String, required: true },
  subject: { type: String, default: "General Inquiry" },
  message: { type: String, required: true },
  createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
  status: { type: String, enum: ["new", "in_progress", "responded"], default: "new" }
}, { timestamps: true });
var ContactSubmission_default = mongoose5.model("ContactSubmission", ContactSubmissionSchema);

// server/src/controllers/contactController.ts
var createContactSubmission = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.firstName || !payload.email || !payload.message) {
      return res.status(400).json({ message: "First name, email, and message are required" });
    }
    const submission = new ContactSubmission_default({
      id: `submission_${nanoid(10)}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      status: "new"
    });
    const savedSubmission = await submission.save();
    res.status(201).json(savedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getContactSubmissions = async (_req, res) => {
  try {
    const submissions = await ContactSubmission_default.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const submission = await ContactSubmission_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ContactSubmission_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/src/routes/contactRoutes.ts
var router4 = express4.Router();
router4.post("/contact", createContactSubmission);
router4.get("/contact-submissions", requireAuth, getContactSubmissions);
router4.put("/contact-submissions/:id", requireAuth, updateContactSubmission);
router4.delete("/contact-submissions/:id", requireAuth, deleteContactSubmission);
var contactRoutes_default = router4;

// server/src/routes/clientRoutes.ts
import express5 from "express";

// server/src/controllers/clientController.ts
import { nanoid as nanoid2 } from "nanoid";

// server/src/models/ClientProject.ts
import mongoose6, { Schema as Schema5 } from "mongoose";
var ClientResourceLinkSchema = new Schema5({
  id: String,
  label: String,
  url: String,
  type: { type: String, enum: ["doc", "design", "repo", "prototype", "analytics", "ticket", "storage"] },
  description: String
});
var ClientProjectTaskSchema = new Schema5({
  id: String,
  title: String,
  status: { type: String, enum: ["todo", "in_progress", "done", "cancelled"] },
  owner: String,
  dueDate: String,
  highlight: String,
  notes: String
});
var ClientProjectTimelineItemSchema = new Schema5({
  id: String,
  label: String,
  date: String,
  status: { type: String, enum: ["complete", "active", "upcoming"] },
  description: String
});
var ClientUpdateSchema = new Schema5({
  id: String,
  title: String,
  date: String,
  author: String,
  summary: String,
  type: { type: String, enum: ["win", "risk", "note", "decision"] },
  impact: String
});
var ClientProjectSchema = new Schema5({
  id: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  clientName: { type: String, required: true },
  name: { type: String, required: true },
  summary: { type: String, default: "" },
  status: { type: String, enum: ["On Track", "At Risk", "Behind"], default: "On Track" },
  health: { type: String, enum: ["green", "amber", "red"], default: "green" },
  progress: { type: Number, default: 0 },
  budgetUsed: { type: Number, default: 0 },
  startDate: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
  endDate: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
  nextMilestone: { type: String, default: "" },
  team: [{ type: String }],
  resources: [ClientResourceLinkSchema],
  tasks: [ClientProjectTaskSchema],
  timeline: [ClientProjectTimelineItemSchema],
  updates: [ClientUpdateSchema],
  links: [ClientResourceLinkSchema]
}, { timestamps: true });
var ClientProject_default = mongoose6.model("ClientProject", ClientProjectSchema);

// server/src/models/ClientInvoice.ts
import mongoose7, { Schema as Schema6 } from "mongoose";
var ClientInvoiceSchema = new Schema6({
  id: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ["paid", "due", "overdue"], default: "due" },
  issuedOn: { type: String, required: true },
  dueOn: { type: String, required: true },
  description: { type: String, default: "" },
  downloadUrl: { type: String }
}, { timestamps: true });
var ClientInvoice_default = mongoose7.model("ClientInvoice", ClientInvoiceSchema);

// server/src/models/ClientUser.ts
import mongoose8, { Schema as Schema7 } from "mongoose";
var ClientUserSchema = new Schema7({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: "" },
  role: { type: String, enum: ["admin", "member", "viewer"], default: "viewer" },
  allowedProjectIds: [{ type: String }]
}, { timestamps: true });
var ClientUser_default = mongoose8.model("ClientUser", ClientUserSchema);

// server/src/controllers/clientController.ts
var computeProgressFromTasks = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === "done").length;
  return Math.round(done / tasks.length * 100);
};
var getClientProjects = async (_req, res) => {
  try {
    const projects = await ClientProject_default.find();
    const withProgress = projects.map((cp) => {
      const obj = cp.toObject();
      return {
        ...obj,
        progress: computeProgressFromTasks(obj.tasks) || obj.progress || 0
      };
    });
    res.json(withProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createClientProject = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.name || !payload.projectId) {
      return res.status(400).json({ message: "Name and projectId are required" });
    }
    const newProject = new ClientProject_default({
      id: payload.id || `client_proj_${Date.now()}`,
      projectId: payload.projectId,
      clientName: payload.clientName || payload.name,
      name: payload.name,
      summary: payload.summary,
      status: payload.status,
      health: payload.health,
      progress: computeProgressFromTasks(payload.tasks) || 0,
      budgetUsed: payload.budgetUsed,
      startDate: payload.startDate,
      endDate: payload.endDate,
      nextMilestone: payload.nextMilestone,
      team: payload.team,
      resources: payload.resources,
      tasks: payload.tasks,
      timeline: payload.timeline,
      updates: payload.updates,
      links: payload.links
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateClientProject = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (payload.tasks) {
      payload.progress = computeProgressFromTasks(payload.tasks);
    }
    const project = await ClientProject_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!project) {
      return res.status(404).json({ message: "Client project not found" });
    }
    const obj = project.toObject();
    obj.progress = computeProgressFromTasks(obj.tasks) || obj.progress || 0;
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteClientProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ClientProject_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Client project not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getClientInvoices = async (_req, res) => {
  try {
    const invoices = await ClientInvoice_default.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createClientInvoice = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.projectId || !payload.amount || !payload.currency || !payload.issuedOn || !payload.dueOn) {
      return res.status(400).json({ message: "projectId, amount, currency, issuedOn, and dueOn are required" });
    }
    const invoice = new ClientInvoice_default({
      id: payload.id || `inv_${nanoid2(8)}`,
      projectId: payload.projectId,
      amount: payload.amount,
      currency: payload.currency,
      status: payload.status,
      issuedOn: payload.issuedOn,
      dueOn: payload.dueOn,
      description: payload.description,
      downloadUrl: payload.downloadUrl
    });
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateClientInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const invoice = await ClientInvoice_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteClientInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ClientInvoice_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getClientUsers = async (_req, res) => {
  try {
    const users = await ClientUser_default.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createClientUser = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.name || !payload.email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    const user = new ClientUser_default({
      id: payload.id || `client_${nanoid2(8)}`,
      name: payload.name,
      email: payload.email,
      company: payload.company,
      role: payload.role,
      allowedProjectIds: payload.allowedProjectIds
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateClientUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const user = await ClientUser_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!user) {
      return res.status(404).json({ message: "Client user not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteClientUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ClientUser_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Client user not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/src/routes/clientRoutes.ts
var router5 = express5.Router();
router5.get("/client-projects", getClientProjects);
router5.post("/client-projects", requireAuth, createClientProject);
router5.put("/client-projects/:id", requireAuth, updateClientProject);
router5.delete("/client-projects/:id", requireAuth, deleteClientProject);
router5.get("/client-invoices", getClientInvoices);
router5.post("/client-invoices", requireAuth, createClientInvoice);
router5.put("/client-invoices/:id", requireAuth, updateClientInvoice);
router5.delete("/client-invoices/:id", requireAuth, deleteClientInvoice);
router5.get("/client-users", requireAuth, getClientUsers);
router5.post("/client-users", requireAuth, createClientUser);
router5.put("/client-users/:id", requireAuth, updateClientUser);
router5.delete("/client-users/:id", requireAuth, deleteClientUser);
var clientRoutes_default = router5;

// server/src/routes/initiativeRoutes.ts
import express6 from "express";

// server/src/controllers/initiativeController.ts
import { nanoid as nanoid3 } from "nanoid";

// server/src/models/Initiative.ts
import mongoose9, { Schema as Schema8 } from "mongoose";
var InitiativeStatSchema = new Schema8({
  label: String,
  value: Number
});
var MilestoneSchema = new Schema8({
  date: String,
  title: String,
  description: String,
  status: { type: String, enum: ["completed", "ongoing", "upcoming"] }
});
var InitiativeSchema = new Schema8({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" },
  fullContent: { type: String, default: "" },
  iconName: { type: String, default: "Heart" },
  color: { type: String, default: "text-white" },
  bgHover: { type: String, default: "" },
  textHover: { type: String, default: "" },
  stats: [InitiativeStatSchema],
  gallery: [{ type: String }],
  milestones: [MilestoneSchema]
}, { timestamps: true });
var Initiative_default = mongoose9.model("Initiative", InitiativeSchema);

// server/src/controllers/initiativeController.ts
var getInitiatives = async (_req, res) => {
  try {
    const initiatives = await Initiative_default.find();
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createInitiative = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const newInitiative = new Initiative_default({
      id: payload.id || `init_${nanoid3(8)}`,
      title: payload.title,
      image: payload.image,
      description: payload.description,
      fullContent: payload.fullContent,
      iconName: payload.iconName,
      color: payload.color,
      bgHover: payload.bgHover,
      textHover: payload.textHover,
      stats: payload.stats
    });
    const savedInitiative = await newInitiative.save();
    res.status(201).json(savedInitiative);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const initiative = await Initiative_default.findOneAndUpdate({ id }, payload, { new: true });
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" });
    }
    res.json(initiative);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var deleteInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Initiative_default.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: "Initiative not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/src/routes/initiativeRoutes.ts
var router6 = express6.Router();
router6.get("/", getInitiatives);
router6.post("/", requireAuth, createInitiative);
router6.put("/:id", requireAuth, updateInitiative);
router6.delete("/:id", requireAuth, deleteInitiative);
var initiativeRoutes_default = router6;

// server/src/routes/authRoutes.ts
import express7 from "express";

// server/src/controllers/authController.ts
import { nanoid as nanoid4 } from "nanoid";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
var login = (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = nanoid4();
  tokens.add(token);
  return res.json({ token });
};
var logout = (req, res) => {
  const token = req.token;
  if (token && tokens.has(token)) {
    tokens.delete(token);
  }
  return res.json({ success: true });
};

// server/src/routes/authRoutes.ts
var router7 = express7.Router();
router7.post("/login", login);
router7.post("/logout", requireAuth, logout);
var authRoutes_default = router7;

// server/src/routes/dataRoutes.ts
import express8 from "express";

// constants.ts
var BRAND = {
  name: "Cindral",
  logo: {
    url: "/assets/logo.png",
    alt: "Cindral Logo"
  },
  colors: {
    primary: "#00AEEF",
    secondary: "#a855f7",
    accent: "#22c55e",
    background: "#0F172A",
    surface: "#1e293b",
    text: "#F8FAFC",
    muted: "#94a3b8"
  },
  typography: {
    display: "Space Grotesk",
    sans: "Inter"
  }
};
var LOGO_URL = BRAND.logo.url;
var DIVISIONS = [
  {
    id: "labs",
    type: "Labs" /* LABS */,
    title: "Cindral Labs",
    tagline: "Where curiosity meets code.",
    description: "Our playground for R&D. We experiment with emerging technologies, AI algorithms, and novel interaction models before they hit the market.",
    iconName: "FlaskConical",
    color: "text-cyan-400",
    themeColor: "#22d3ee",
    // cyan-400
    bannerImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1920"
  },
  {
    id: "studios",
    type: "Studios" /* STUDIOS */,
    title: "Cindral Studios",
    tagline: "Crafting digital excellence.",
    description: "Our client-facing arm delivering bespoke web, mobile, and software solutions. We turn business requirements into polished, scalable products.",
    iconName: "Briefcase",
    color: "text-blue-500",
    themeColor: "#3b82f6",
    // blue-500
    bannerImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1920"
  },
  {
    id: "immersive",
    type: "Immersive" /* IMMERSIVE */,
    title: "Cindral Immersive",
    tagline: "Beyond the screen.",
    description: "Specializing in Extended Reality (XR). From AR marketing campaigns to VR training simulations, we bridge the physical and digital worlds.",
    iconName: "Glasses",
    color: "text-purple-400",
    themeColor: "#a855f7",
    // purple-500
    bannerImage: "https://images.unsplash.com/photo-1626387346567-2cd2dc032a1e?auto=format&fit=crop&q=80&w=1920"
  },
  {
    id: "entertainment",
    type: "Entertainment" /* ENTERTAINMENT */,
    title: "Cindral Entertainment",
    tagline: "Stories that captivate.",
    description: "Game development and interactive media. We create immersive narratives and fun gameplay experiences for PC, console, and mobile.",
    iconName: "Gamepad2",
    color: "text-pink-500",
    themeColor: "#ec4899",
    // pink-500
    bannerImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1920"
  }
];
var PROJECTS = [
  // Labs
  {
    id: "p1",
    divisionId: "labs",
    title: "Project Neural Bloom",
    summary: "Generative AI for dynamic floral patterns.",
    content: "Neural Bloom explores the intersection of nature and machine learning. Using GANs, we trained models on thousands of orchid species to generate never-before-seen digital flora that evolves based on user sentiment analysis.",
    year: "2023",
    images: ["https://picsum.photos/id/106/800/600", "https://picsum.photos/id/112/800/600"]
  },
  // Studios
  {
    id: "p2",
    divisionId: "studios",
    title: "FinTech Dashboard Redesign",
    client: "AlphaBank Global",
    summary: "A complete UX overhaul for high-frequency trading.",
    content: "We partnered with AlphaBank to reduce cognitive load for traders. By implementing a modular grid system and dark-mode-first data visualization, we improved trade execution speed by 15%.",
    year: "2024",
    images: ["https://picsum.photos/id/445/800/600", "https://picsum.photos/id/20/800/600"]
  },
  // Immersive
  {
    id: "p3",
    divisionId: "immersive",
    title: "Virtual Museum Tour",
    client: "National History Org",
    summary: "An accessible VR experience for historical artifacts.",
    content: "Using photogrammetry, we digitized 500+ artifacts. Users can pick up, rotate, and inspect items in VR that are locked behind glass in the real world.",
    year: "2023",
    images: ["https://picsum.photos/id/231/800/600", "https://picsum.photos/id/238/800/600"]
  },
  // Entertainment
  {
    id: "p4",
    divisionId: "entertainment",
    title: "Neon Odyssey",
    summary: "A cyberpunk rhythm racer.",
    content: "Neon Odyssey is a high-octane racing game where the track generates procedurally based on the music track selected by the player. Released on Steam and Epic Games Store.",
    year: "2022",
    images: ["https://picsum.photos/id/532/800/600", "https://picsum.photos/id/453/800/600"]
  }
];
var getAvatar = (id) => `https://i.pravatar.cc/300?img=${id + 10}`;
var TEAM = [
  {
    id: "t1",
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Sarah is a visionary technologist with over 15 years in software engineering. She started Cindral to bridge the gap between hard tech and creative expression.",
    image: getAvatar(1),
    projectIds: ["p1", "p2"],
    csrActivities: ['Mentored 50+ students in "Code for Future".', "Spearheaded Bonsai reforestation."],
    skills: ["Strategic Planning", "System Architecture", "Leadership", "Python"],
    interests: ["Quantum Computing", "Hiking", "Classical Piano"],
    quote: "Technology is the brush, humanity is the canvas.",
    learningStats: { currentStreak: 45, totalHours: 120, lastTopic: "Quantum Mechanics" },
    fitnessStats: { activityType: "Yoga", weeklyMinutes: 180, personalBest: "Headstand 5m" }
  },
  {
    id: "t2",
    name: "Marcus Thorne",
    role: "Creative Director",
    bio: "With a background in traditional art and 3D modeling, Marcus ensures everything Cindral ships looks stunning and feels intuitive.",
    image: getAvatar(2),
    projectIds: ["p3", "p4"],
    csrActivities: ["Designed materials for rural schools.", "Organized charity art auction."],
    skills: ["UI/UX Design", "Blender", "Art Direction", "Typography"],
    interests: ["Oil Painting", "Architecture", "Indie Games"],
    quote: "Design is intelligence made visible.",
    learningStats: { currentStreak: 12, totalHours: 48, lastTopic: "Generative Design" },
    fitnessStats: { activityType: "Cycling", weeklyMinutes: 120, personalBest: "50km Ride" }
  },
  {
    id: "t3",
    name: "Elena Rodriguez",
    role: "Head of Immersive",
    bio: "Elena lives in the future. She leads the Immersive division, pushing boundaries of what AR and VR can achieve.",
    image: getAvatar(3),
    projectIds: ["p3", "p1"],
    csrActivities: ['Consultant for "Tech for Non-Profits".'],
    skills: ["Unity 3D", "ARKit/ARCore", "C#", "Spatial Computing"],
    interests: ["Sci-Fi Literature", "Rock Climbing", "Robotics"],
    quote: "The best way to predict the future is to simulate it.",
    learningStats: { currentStreak: 89, totalHours: 250, lastTopic: "Haptic Feedback" },
    fitnessStats: { activityType: "Rock Climbing", weeklyMinutes: 240, personalBest: "V5 Boulder" }
  },
  {
    id: "t4",
    name: "David Okafor",
    role: "Head of Entertainment",
    bio: "A storyteller at heart, David crafts the narratives that make Cindral Entertainment titles unforgettable.",
    image: getAvatar(4),
    projectIds: ["p4"],
    csrActivities: ["Runs weekend game jams."],
    skills: ["Narrative Design", "Unreal Engine", "Creative Writing", "Level Design"],
    interests: ["Mythology", "Tabletop RPGs", "Film Noir"],
    quote: "Every pixel should tell a story.",
    learningStats: { currentStreak: 5, totalHours: 30, lastTopic: "Interactive Storytelling" },
    fitnessStats: { activityType: "Jogging", weeklyMinutes: 90, personalBest: "5k in 25m" }
  },
  {
    id: "t5",
    name: "Aisha Gupta",
    role: "Lead UI/UX Designer",
    bio: "Obsessed with micro-interactions and accessibility, Aisha believes great design goes unnoticed.",
    image: getAvatar(5),
    projectIds: ["p2"],
    csrActivities: [],
    skills: ["Figma", "Prototyping", "User Research", "Accessibility"],
    interests: ["Pottery", "Traveling", "Urban Sketching"],
    quote: "Empathy is the most important design tool.",
    learningStats: { currentStreak: 30, totalHours: 90, lastTopic: "Web Accessibility Guidelines" },
    fitnessStats: { activityType: "Pilates", weeklyMinutes: 150, personalBest: "Core Strength" }
  },
  {
    id: "t6",
    name: "James Wilson",
    role: "Senior Backend Engineer",
    bio: "Architecting scalable systems for millions of users. James makes sure Cindral never goes offline.",
    image: getAvatar(6),
    projectIds: ["p2"],
    csrActivities: [],
    skills: ["Node.js", "PostgreSQL", "Kubernetes", "Go"],
    interests: ["Cycling", "Coffee Brewing", "Open Source"],
    quote: "Scale is not an accident.",
    learningStats: { currentStreak: 200, totalHours: 450, lastTopic: "Rust Programming" },
    fitnessStats: { activityType: "Cycling", weeklyMinutes: 300, personalBest: "100km Ride" }
  },
  {
    id: "t7",
    name: "Yuki Tanaka",
    role: "3D Artist",
    bio: "Creating digital worlds polygon by polygon. Yuki brings texture and life to our immersive projects.",
    image: getAvatar(7),
    projectIds: ["p3", "p4"],
    csrActivities: [],
    skills: ["Maya", "Substance Painter", "ZBrush", "Character Design"],
    interests: ["Anime", "Fashion Design", "Sculpting"],
    quote: "Details make the world believing.",
    learningStats: { currentStreak: 15, totalHours: 55, lastTopic: "Unreal Engine 5 Nanite" },
    fitnessStats: { activityType: "Swimming", weeklyMinutes: 120, personalBest: "2km Swim" }
  },
  {
    id: "t8",
    name: "Omar Farooq",
    role: "AI Researcher",
    bio: "Specializing in LLMs and generative art models. Omar bridges the gap between math and magic.",
    image: getAvatar(8),
    projectIds: ["p1"],
    csrActivities: [],
    skills: ["PyTorch", "TensorFlow", "NLP", "Generative Adversarial Networks"],
    interests: ["Chess", "Philosophy", "Electronic Music"],
    quote: "AI isn't artificial, it's augmented imagination.",
    learningStats: { currentStreak: 60, totalHours: 180, lastTopic: "Transformer Architectures" },
    fitnessStats: { activityType: "Calisthenics", weeklyMinutes: 100, personalBest: "20 Pullups" }
  },
  {
    id: "t9",
    name: "Sophie Dubois",
    role: "Project Manager",
    bio: "The glue that holds our chaotic creativity together. Sophie ensures we ship on time, every time.",
    image: getAvatar(9),
    projectIds: ["p1", "p2", "p3", "p4"],
    csrActivities: [],
    skills: ["Agile", "Scrum", "Risk Management", "Communication"],
    interests: ["Baking", "Yoga", "Puzzle Games"],
    quote: "Chaos is just undefined order.",
    learningStats: { currentStreak: 4, totalHours: 20, lastTopic: "Psychological Safety in Teams" },
    fitnessStats: { activityType: "Running", weeklyMinutes: 120, personalBest: "Marathon Finisher" }
  },
  {
    id: "t10",
    name: "Lucas Silva",
    role: "Unity Developer",
    bio: "Turning code into gameplay mechanics. Lucas creates the fun factor in our games.",
    image: getAvatar(10),
    projectIds: ["p4"],
    csrActivities: [],
    skills: ["C#", "Physics Engines", "Game Mechanics", "Optimization"],
    interests: ["Skateboarding", "Synthesizers", "Retro Gaming"],
    quote: "If it's not fun, it's not finished.",
    learningStats: { currentStreak: 22, totalHours: 66, lastTopic: "Shader Graph" },
    fitnessStats: { activityType: "Skateboarding", weeklyMinutes: 200, personalBest: "Kickflip" }
  },
  {
    id: "t11",
    name: "Nina Patel",
    role: "Frontend Developer",
    bio: "Pixel perfectionist and React enthusiast. Nina makes the web look beautiful on any device.",
    image: getAvatar(11),
    projectIds: ["p2"],
    csrActivities: [],
    skills: ["React", "TypeScript", "Tailwind CSS", "WebGL"],
    interests: ["Photography", "Interior Design", "Cooking"],
    quote: "The web is the world's canvas.",
    learningStats: { currentStreak: 10, totalHours: 40, lastTopic: "Three.js" },
    fitnessStats: { activityType: "Zumba", weeklyMinutes: 120, personalBest: "Dance Marathon" }
  },
  {
    id: "t12",
    name: "Robert Chang",
    role: "DevOps Engineer",
    bio: "Keeping the servers cool and the pipelines green. Robert loves automation.",
    image: getAvatar(12),
    projectIds: ["p2"],
    csrActivities: [],
    skills: ["AWS", "Docker", "Terraform", "CI/CD"],
    interests: ["Home Automation", "Woodworking", "Sci-Fi Movies"],
    quote: "Automate everything.",
    learningStats: { currentStreak: 33, totalHours: 110, lastTopic: "eBPF" },
    fitnessStats: { activityType: "Hiking", weeklyMinutes: 180, personalBest: "Mt. Fuji" }
  },
  {
    id: "t13",
    name: "Emma Lewis",
    role: "Content Strategist",
    bio: "Giving voice to our digital creations. Emma ensures our message is clear and compelling.",
    image: getAvatar(13),
    projectIds: ["p1"],
    csrActivities: [],
    skills: ["Copywriting", "SEO", "Brand Storytelling", "Social Media"],
    interests: ["Poetry", "Vintage Shopping", "Documentaries"],
    quote: "Words shape reality.",
    learningStats: { currentStreak: 8, totalHours: 25, lastTopic: "Behavioral Economics" },
    fitnessStats: { activityType: "Tennis", weeklyMinutes: 120, personalBest: "Club Champ" }
  },
  {
    id: "t14",
    name: "Klaus M\xFCller",
    role: "Sound Designer",
    bio: "Creating immersive soundscapes for VR and Games. Klaus knows that hearing is believing.",
    image: getAvatar(14),
    projectIds: ["p3", "p4"],
    csrActivities: [],
    skills: ["Ableton Live", "FMOD", "Sound Synthesis", "Field Recording"],
    interests: ["Modular Synths", "Hiking", "Acoustics"],
    quote: "Silence is also a sound.",
    learningStats: { currentStreak: 18, totalHours: 54, lastTopic: "Ambisonics" },
    fitnessStats: { activityType: "Crossfit", weeklyMinutes: 150, personalBest: "Deadlift 100kg" }
  },
  {
    id: "t15",
    name: "Priya Singh",
    role: "QA Lead",
    bio: "If it breaks, Priya found it first. She is the guardian of our quality.",
    image: getAvatar(15),
    projectIds: ["p2", "p4"],
    csrActivities: [],
    skills: ["Automated Testing", "Bug Tracking", "Performance Testing", "Detail Oriented"],
    interests: ["Mystery Novels", "Gardening", "Sudoku"],
    quote: "Quality is not an act, it is a habit.",
    learningStats: { currentStreak: 25, totalHours: 75, lastTopic: "Cypress Testing" },
    fitnessStats: { activityType: "Badminton", weeklyMinutes: 90, personalBest: "Regional Team" }
  },
  {
    id: "t16",
    name: "Tom Baker",
    role: "AR Specialist",
    bio: "Bringing magic to the mundane world. Tom layers digital information over physical reality.",
    image: getAvatar(16),
    projectIds: ["p3"],
    csrActivities: [],
    skills: ["Spark AR", "Computer Vision", "Mobile Development", "3D Scanning"],
    interests: ["Magic Tricks", "Street Art", "Drones"],
    quote: "Reality is just the base layer.",
    learningStats: { currentStreak: 50, totalHours: 150, lastTopic: "LiDAR Scanning" },
    fitnessStats: { activityType: "Parkour", weeklyMinutes: 120, personalBest: "Wall Run" }
  },
  {
    id: "t17",
    name: "Lia Zhang",
    role: "Marketing Lead",
    bio: "Sharing Cindral's story with the world. Lia connects our innovations with the people who need them.",
    image: getAvatar(17),
    projectIds: [],
    csrActivities: [],
    skills: ["Digital Marketing", "Data Analysis", "Public Relations", "Event Planning"],
    interests: ["Travel Photography", "Food Blogging", "Languages"],
    quote: "Innovation needs a voice.",
    learningStats: { currentStreak: 7, totalHours: 21, lastTopic: "Growth Hacking" },
    fitnessStats: { activityType: "Salsa", weeklyMinutes: 180, personalBest: "Competition Win" }
  },
  {
    id: "t18",
    name: "Hassan Reid",
    role: "Data Scientist",
    bio: "Finding patterns in the noise. Hassan turns raw data into actionable insights.",
    image: getAvatar(18),
    projectIds: ["p1", "p2"],
    csrActivities: [],
    skills: ["Python", "SQL", "Machine Learning", "Data Visualization"],
    interests: ["Basketball", "Statistics", "Podcasts"],
    quote: "Data speaks if you listen.",
    learningStats: { currentStreak: 40, totalHours: 120, lastTopic: "Bayesian Statistics" },
    fitnessStats: { activityType: "Basketball", weeklyMinutes: 240, personalBest: "30pts Game" }
  },
  {
    id: "t19",
    name: "Zoe O'Connell",
    role: "Concept Artist",
    bio: "Visualizing the impossible before it is built. Zoe draws the blueprints of our dreams.",
    image: getAvatar(19),
    projectIds: ["p4", "p3"],
    csrActivities: [],
    skills: ["Photoshop", "Illustration", "Color Theory", "Storyboarding"],
    interests: ["Comics", "Cosplay", "History"],
    quote: "Imagination is the preview of life's coming attractions.",
    learningStats: { currentStreak: 14, totalHours: 50, lastTopic: "Anatomy" },
    fitnessStats: { activityType: "Archery", weeklyMinutes: 60, personalBest: "Bullseye Streak" }
  },
  {
    id: "t20",
    name: "Miguel Torres",
    role: "Intern",
    bio: "Learning fast and breaking things safely. Miguel is our newest spark of energy.",
    image: getAvatar(20),
    projectIds: ["p1"],
    csrActivities: [],
    skills: ["HTML/CSS", "JavaScript", "Git", "Curiosity"],
    interests: ["Surfing", "Music Festivals", "Learning"],
    quote: "Every expert was once a beginner.",
    learningStats: { currentStreak: 90, totalHours: 270, lastTopic: "React Hooks" },
    fitnessStats: { activityType: "Surfing", weeklyMinutes: 300, personalBest: "Big Wave" }
  }
];
var CLIENT_PORTAL_PROJECTS = [
  {
    id: "cp1",
    projectId: "p2",
    clientName: "AlphaBank Global",
    name: "AlphaBank Trading Portal",
    summary: "Enterprise-grade trading portal revamp with latency SLAs.",
    status: "On Track",
    health: "green",
    progress: 72,
    budgetUsed: 64,
    startDate: "2024-02-05",
    endDate: "2024-08-01",
    nextMilestone: "Beta handoff on Jun 28",
    team: ["t1", "t2", "t5", "t6"],
    resources: [
      { id: "res-cp1-1", label: "Figma design system", url: "https://www.figma.com/file/alpha-bank-system", type: "design", description: "Components, tokens, and signed-off flows." },
      { id: "res-cp1-2", label: "Staging dashboard", url: "https://alpha.cindral.app", type: "prototype", description: "Protected staging build for UAT." },
      { id: "res-cp1-3", label: "API contract", url: "https://docs.cindral.dev/alphabank/openapi", type: "doc", description: "OpenAPI + webhook catalogue." }
    ],
    tasks: [
      { id: "task-cp1-1", title: "Performance profiling on heatmaps", status: "in_progress", owner: "James Wilson", dueDate: "2024-06-15", highlight: "Target p95 < 180ms" },
      { id: "task-cp1-2", title: "Copy + compliance review", status: "done", owner: "Aisha Gupta", dueDate: "2024-05-30" },
      { id: "task-cp1-3", title: "Pen-test remediation batch 1", status: "todo", owner: "Sarah Chen", dueDate: "2024-06-10", highlight: "Awaiting VPN allowlist for vendor" }
    ],
    timeline: [
      { id: "tl-cp1-1", label: "Discovery + Research", date: "2024-02-29", status: "complete", description: "Stakeholder workshops & audits." },
      { id: "tl-cp1-2", label: "Design Sprint", date: "2024-04-05", status: "complete", description: "IA, flows, interaction prototypes." },
      { id: "tl-cp1-3", label: "Beta Build", date: "2024-06-28", status: "active", description: "Feature complete beta to client UAT." },
      { id: "tl-cp1-4", label: "Launch", date: "2024-08-01", status: "upcoming", description: "Production cutover + training." }
    ],
    updates: [
      { id: "upd-cp1-1", title: "Latency down 18%", date: "2024-05-28", author: "Sarah Chen", summary: "Caching on order book view and WebSocket tuning cut p95 latency by 18%.", type: "win" },
      { id: "upd-cp1-2", title: "Compliance review booked", date: "2024-05-25", author: "Marcus Thorne", summary: "AlphaBank InfoSec review on Jun 2 for SOC2 artefacts and audit logs.", type: "decision" },
      { id: "upd-cp1-3", title: "Blocked: SSO sandbox access", date: "2024-05-22", author: "James Wilson", summary: "Need client approval for new OAuth app to finish UAT setup.", type: "risk", impact: "Medium" }
    ],
    links: [
      { id: "link-cp1-1", label: "Sprint board (Linear)", url: "https://linear.app/cindral/alphabank", type: "ticket", description: "Active sprint, bugs, and backlog." },
      { id: "link-cp1-2", label: "Decision log", url: "https://docs.google.com/document/d/alphabank-decisions", type: "doc", description: "Signed-off decisions and approvals." }
    ]
  },
  {
    id: "cp2",
    projectId: "p3",
    clientName: "National History Org",
    name: "Virtual Museum Tour",
    summary: "Immersive VR tour with accessibility-first interactions.",
    status: "At Risk",
    health: "amber",
    progress: 58,
    budgetUsed: 62,
    startDate: "2024-01-10",
    endDate: "2024-07-15",
    nextMilestone: "Final artifact import on Jun 20",
    team: ["t3", "t7", "t12", "t18"],
    resources: [
      { id: "res-cp2-1", label: "VR build (Quest)", url: "https://museum.cindral.app/quest-build", type: "prototype", description: "Latest Quest build + release notes." },
      { id: "res-cp2-2", label: "Asset library", url: "https://drive.google.com/folder/museum-assets", type: "storage", description: "Scans, textures, renders." },
      { id: "res-cp2-3", label: "Analytics dashboard", url: "https://looker.com/dashboards/museum", type: "analytics", description: "Visitor funnel + engagement." }
    ],
    tasks: [
      { id: "task-cp2-1", title: "Accessibility QA sweep", status: "in_progress", owner: "Elena Rodriguez", dueDate: "2024-06-12", highlight: "VoiceOver + captions across scenes." },
      { id: "task-cp2-2", title: "Lighting pass for Hall B", status: "done", owner: "Yuki Tanaka", dueDate: "2024-05-26" },
      { id: "task-cp2-3", title: "Client content approvals", status: "todo", owner: "Miguel Torres", dueDate: "2024-06-05", highlight: "Need sign-off on 32 artifacts." }
    ],
    timeline: [
      { id: "tl-cp2-1", label: "Photogrammetry batch 1", date: "2024-02-20", status: "complete", description: "150 artifacts scanned." },
      { id: "tl-cp2-2", label: "Prototype walkthrough", date: "2024-04-15", status: "complete", description: "First end-to-end experience shared." },
      { id: "tl-cp2-3", label: "Final content ingest", date: "2024-06-20", status: "active", description: "Client delivery of remaining assets." },
      { id: "tl-cp2-4", label: "Launch + training", date: "2024-07-15", status: "upcoming", description: "Playbooks, training, and go-live." }
    ],
    updates: [
      { id: "upd-cp2-1", title: "Heatmap insights", date: "2024-05-27", author: "Hassan Reid", summary: "Visitors cluster around Hall B \u2014 retuning pathing to balance flow.", type: "note" },
      { id: "upd-cp2-2", title: "Risk: content approvals slipping", date: "2024-05-24", author: "Elena Rodriguez", summary: "Approval queue backlog may push artifact ingest by ~4 days.", type: "risk", impact: "High" },
      { id: "upd-cp2-3", title: "New haptics demoed", date: "2024-05-21", author: "Elena Rodriguez", summary: "Client loved tactile feedback on artifact interaction.", type: "win" }
    ],
    links: [
      { id: "link-cp2-1", label: "Miro story map", url: "https://miro.com/app/board/museum-journey", type: "doc", description: "Visitor journey and storyboard." },
      { id: "link-cp2-2", label: "QA bug list", url: "https://linear.app/cindral/board/museum", type: "ticket", description: "QA and UAT bugs." }
    ]
  },
  {
    id: "cp3",
    projectId: "p4",
    clientName: "Cindral Entertainment Partners",
    name: "Neon Odyssey Live Ops",
    summary: "Seasonal live operations and content drops for Neon Odyssey.",
    status: "Behind",
    health: "red",
    progress: 41,
    budgetUsed: 48,
    startDate: "2023-11-01",
    endDate: "2024-07-30",
    nextMilestone: "Season 2 balance patch on Jun 18",
    team: ["t4", "t8", "t9", "t19"],
    resources: [
      { id: "res-cp3-1", label: "Game design doc", url: "https://docs.cindral.dev/neon-odyssey", type: "doc", description: "Latest mechanics, economy, and balance sheet." },
      { id: "res-cp3-2", label: "Steam telemetry dashboard", url: "https://looker.com/dashboards/neon", type: "analytics", description: "Retention, churn, and economy KPIs." },
      { id: "res-cp3-3", label: "Live build changelog", url: "https://neon.cindral.app/changelog", type: "prototype", description: "Patch notes and release cadence." }
    ],
    tasks: [
      { id: "task-cp3-1", title: "Server load test (APAC)", status: "in_progress", owner: "Omar Farooq", dueDate: "2024-06-08", highlight: "Simulate 50k CCU." },
      { id: "task-cp3-2", title: "Seasonal skins art pass", status: "in_progress", owner: "Zoe O'Connell", dueDate: "2024-06-05" },
      { id: "task-cp3-3", title: "Balance telemetry review", status: "done", owner: "Sophie Dubois", dueDate: "2024-05-22" }
    ],
    timeline: [
      { id: "tl-cp3-1", label: "Season 1 post-mortem", date: "2024-03-10", status: "complete", description: "Findings fed into roadmap." },
      { id: "tl-cp3-2", label: "LiveOps Sprint 1", date: "2024-04-05", status: "complete", description: "Stability and matchmaking fixes." },
      { id: "tl-cp3-3", label: "Season 2 balance patch", date: "2024-06-18", status: "active", description: "Economy tuning and new tracks." },
      { id: "tl-cp3-4", label: "Console launch planning", date: "2024-07-30", status: "upcoming", description: "Scope + feasibility." }
    ],
    updates: [
      { id: "upd-cp3-1", title: "Matchmaking crash fixed", date: "2024-05-26", author: "Vikram Singh", summary: "Resolved packet loss crash on cross-region lobbies.", type: "win" },
      { id: "upd-cp3-2", title: "Risk: asset pipeline lag", date: "2024-05-23", author: "Zoe O'Connell", summary: "Asset import pipeline slowing art delivery; GPU farm upgrade scheduled.", type: "risk", impact: "Medium" },
      { id: "upd-cp3-3", title: "Community sentiment dip", date: "2024-05-20", author: "Lia Zhang", summary: "Forum sentiment dipped after balance tweaks; social plan drafted.", type: "note" }
    ],
    links: [
      { id: "link-cp3-1", label: "Prod status board", url: "https://status.neonodyssey.game", type: "analytics", description: "Live status + incidents." },
      { id: "link-cp3-2", label: "Incident log", url: "https://linear.app/cindral/board/neon-ops", type: "ticket", description: "Incident playbooks and follow-ups." }
    ]
  }
];
var CLIENT_INVOICES = [
  { id: "INV-2024-041", projectId: "p2", amount: 42e3, currency: "USD", status: "due", issuedOn: "2024-05-15", dueOn: "2024-06-15", description: "Milestone 3 - Beta delivery", downloadUrl: "#" },
  { id: "INV-2024-042", projectId: "p3", amount: 18e3, currency: "USD", status: "paid", issuedOn: "2024-04-15", dueOn: "2024-04-30", description: "Content digitization batch", downloadUrl: "#" },
  { id: "INV-2024-043", projectId: "p3", amount: 22e3, currency: "USD", status: "due", issuedOn: "2024-05-25", dueOn: "2024-06-24", description: "VR training module", downloadUrl: "#" },
  { id: "INV-2024-044", projectId: "p4", amount: 15e3, currency: "USD", status: "overdue", issuedOn: "2024-05-01", dueOn: "2024-05-20", description: "LiveOps sprint 1", downloadUrl: "#" }
];
var INITIATIVES = [
  {
    id: "tech-for-future",
    title: "Tech For Future",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600",
    description: "Bridging the digital divide by equipping the next generation with coding skills and hardware. We partner with rural schools to provide bootcamps, mentorship, and resources.",
    fullContent: 'In a world increasingly driven by technology, access to digital education is a fundamental right. "Tech For Future" is our flagship educational initiative designed to democratize access to computer science education. We focus on underfunded rural schools where students often lack access to modern hardware and mentorship.\n\nOur program goes beyond just donating laptops. We provide a structured 12-week coding bootcamp where Cindral engineers volunteer their weekends to teach Python and JavaScript. We also sponsor high-speed internet connections for these schools for a full year.',
    iconName: "BookOpen",
    color: "text-blue-400",
    bgHover: "group-hover:bg-blue-500/20",
    textHover: "group-hover:text-blue-400",
    stats: [
      { label: "Students Mentored", value: 1240 },
      { label: "Bootcamps Held", value: 45 },
      { label: "Scholarships", value: 200 }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
    ],
    milestones: [
      { date: "December 2025", title: "National Rollout", description: "Expanding curriculum to 500+ schools nationwide.", status: "upcoming" },
      { date: "June 2025", title: "Advanced Lab Setup", description: "Installing high-perf compute nodes in partner schools.", status: "upcoming" },
      { date: "March 2024", title: "Pilot Launch", description: "First cohort of 50 students graduated with distinction.", status: "completed" }
    ]
  },
  {
    id: "bonsai-project",
    title: "The Bonsai Project",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600",
    description: "A commitment to patience and growth. For every commercial project we complete, we plant a Bonsai tree and fund reforestation efforts in biodiversity hotspots.",
    fullContent: "The Bonsai Project is our symbolic and practical commitment to the environment. Bonsai trees represent patience, long-term vision, and careful nurturing\u2014values that mirror our approach to software engineering. But we know symbolism isn't enough.\n\nFor every project delivered, we not only plant a commemorative Bonsai in our headquarters greenhouse but also donate to plant 100 native trees in deforested regions via our partners. This ensures a tangible, positive carbon impact that scales with our business success.",
    iconName: "Sprout",
    color: "text-green-400",
    bgHover: "group-hover:bg-green-500/20",
    textHover: "group-hover:text-green-400",
    stats: [
      { label: "Trees Planted", value: 8500 },
      { label: "CO2 Offset", value: 120 },
      { label: "Species Protected", value: 14 }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
      // Bonsai
      "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&q=80&w=800",
      // Forest
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800"
      // Tree planting
    ],
    milestones: [
      { date: "September 2025", title: "Biodiversity Index", description: "Partnering with ecologists to track species return rates.", status: "upcoming" },
      { date: "March 2025", title: "10,000th Tree", description: "Hitting the major milestone of 10k trees planted.", status: "completed" },
      { date: "June 2023", title: "Seedling Project", description: "Started our own nursery for native species.", status: "completed" }
    ]
  },
  {
    id: "npo-digital",
    title: "NPO Digital Transformation",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1600",
    description: "Empowering non-profits with enterprise-grade tech. We offer pro-bono digital transformation services to NGOs to help them scale their impact.",
    fullContent: 'Non-profits often do the most important work with the fewest resources. Our "NPO Digital Transformation" initiative aims to fix this efficiency gap. We identify high-impact NGOs and treat them exactly like our Fortune 500 clients\u2014providing them with custom software, data analytics dashboards, and cloud infrastructure optimization.\n\nEverything is provided pro-bono. By streamlining their operations and donor management systems, we help them spend less time on administration and more time on their core mission.',
    iconName: "Laptop",
    color: "text-purple-400",
    bgHover: "group-hover:bg-purple-500/20",
    textHover: "group-hover:text-purple-400",
    stats: [
      { label: "NGOs Digitized", value: 18 },
      { label: "Volunteer Hours", value: 4200 },
      { label: "Cost Saved", value: 1.2 }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
      // Tech meeting
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      // Computer lab
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
      // Collaboration
    ],
    milestones: [
      { date: "December 2025", title: "AI for Good Hackathon", description: "Global event connecting devs with NPO challenges.", status: "upcoming" },
      { date: "June 2024", title: "Cloud Migration", description: "Moved 10 partner NGOs to secure cloud infra.", status: "completed" },
      { date: "March 2024", title: "Program Start", description: "Officially launched the pro-bono division.", status: "completed" }
    ]
  }
];

// server/src/controllers/dataController.ts
var seedData = () => ({
  divisions: JSON.parse(JSON.stringify(DIVISIONS)),
  projects: JSON.parse(JSON.stringify(PROJECTS)),
  team: JSON.parse(JSON.stringify(TEAM)),
  contactSubmissions: [],
  clientProjects: JSON.parse(JSON.stringify(CLIENT_PORTAL_PROJECTS)),
  clientInvoices: JSON.parse(JSON.stringify(CLIENT_INVOICES)),
  clientUsers: [],
  initiatives: JSON.parse(JSON.stringify(INITIATIVES))
});
var exportData = async (_req, res) => {
  try {
    const data = {
      divisions: await Division_default.find(),
      projects: await Project_default.find(),
      team: await TeamMember_default.find(),
      contactSubmissions: await ContactSubmission_default.find(),
      clientProjects: await ClientProject_default.find(),
      clientInvoices: await ClientInvoice_default.find(),
      clientUsers: await ClientUser_default.find(),
      initiatives: await Initiative_default.find()
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var importData = async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload.divisions) || !Array.isArray(payload.projects) || !Array.isArray(payload.team)) {
      return res.status(400).json({ message: "Invalid data payload" });
    }
    await Promise.all([
      Division_default.deleteMany({}),
      Project_default.deleteMany({}),
      TeamMember_default.deleteMany({}),
      ContactSubmission_default.deleteMany({}),
      ClientProject_default.deleteMany({}),
      ClientInvoice_default.deleteMany({}),
      ClientUser_default.deleteMany({}),
      Initiative_default.deleteMany({})
    ]);
    await Promise.all([
      Division_default.insertMany(payload.divisions),
      Project_default.insertMany(payload.projects),
      TeamMember_default.insertMany(payload.team),
      ContactSubmission_default.insertMany(payload.contactSubmissions || []),
      ClientProject_default.insertMany(payload.clientProjects || []),
      ClientInvoice_default.insertMany(payload.clientInvoices || []),
      ClientUser_default.insertMany(payload.clientUsers || []),
      Initiative_default.insertMany(payload.initiatives || [])
    ]);
    res.json({ message: "Data imported successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var resetData = async (_req, res) => {
  try {
    const data = seedData();
    await Promise.all([
      Division_default.deleteMany({}),
      Project_default.deleteMany({}),
      TeamMember_default.deleteMany({}),
      ContactSubmission_default.deleteMany({}),
      ClientProject_default.deleteMany({}),
      ClientInvoice_default.deleteMany({}),
      ClientUser_default.deleteMany({}),
      Initiative_default.deleteMany({})
    ]);
    await Promise.all([
      Division_default.insertMany(data.divisions),
      Project_default.insertMany(data.projects),
      TeamMember_default.insertMany(data.team),
      // contactSubmissions is empty
      ClientProject_default.insertMany(data.clientProjects),
      ClientInvoice_default.insertMany(data.clientInvoices),
      // clientUsers is empty
      Initiative_default.insertMany(data.initiatives)
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/src/routes/dataRoutes.ts
var router8 = express8.Router();
router8.get("/export", requireAuth, exportData);
router8.post("/import", requireAuth, importData);
router8.post("/reset", requireAuth, resetData);
var dataRoutes_default = router8;

// server/src/index.ts
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });
dotenv.config();
db_default();
var app = express9();
var PORT = Number(process.env.API_PORT || process.env.PORT || 4e3);
app.use(cors());
app.use(express9.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/divisions", divisionRoutes_default);
app.use("/api/projects", projectRoutes_default);
app.use("/api/team", teamRoutes_default);
app.use("/api/initiatives", initiativeRoutes_default);
app.use("/api/data", dataRoutes_default);
app.use("/api", authRoutes_default);
app.use("/api", contactRoutes_default);
app.use("/api", clientRoutes_default);
var distPath = path.resolve(process.cwd(), "dist");
app.use(express9.static(distPath));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(PORT, () => {
  console.log(`Cindral API running on http://localhost:${PORT}`);
});
