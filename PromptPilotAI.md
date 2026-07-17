

# **PromptPilot AI — Full Project Requirements**

## **1\. Project Overview**

**PromptPilot AI** is a full-stack Agentic AI web application that helps users write better prompts for AI tools such as ChatGPT, Claude, Gemini, Groq, and other LLMs.

Users can submit a prompt, define their goal, select a target AI model, choose tone, length, language, and output style. The AI agent then analyzes the prompt, detects weaknesses, asks follow-up questions when needed, improves the prompt, generates multiple optimized versions, scores the prompt, and saves the prompt history.

The app should demonstrate full-stack development, authentication, authorization, AI integration, agent workflows, database management, secure API design, responsive UI/UX, and real-world product quality.

---

# **2\. Project Name**

## **PromptPilot AI**

### **Tagline**

**Analyze, optimize, and organize powerful AI prompts with an intelligent agentic workflow.**

---

# **3\. Main Objective**

The objective of PromptPilot AI is to help users create high-quality prompts using an AI-powered workflow that goes beyond simple text generation.

The system should:

* Analyze user prompts.  
* Identify weaknesses and missing context.  
* Ask smart follow-up questions.  
* Generate improved prompts.  
* Create multiple optimized versions.  
* Score prompts based on quality.  
* Recommend better roles, constraints, tone, and output formats.  
* Save prompt history.  
* Allow users to organize prompts into collections.  
* Provide analytics about prompt usage and improvement.

---

# **4\. Target Users**

PromptPilot AI is useful for:

* Students  
* Developers  
* Content creators  
* Marketers  
* Researchers  
* Freelancers  
* AI enthusiasts  
* Teams using AI tools for productivity

---

# **5\. Technology Stack**

## **Frontend**

Required:

* Next.js  
* TypeScript  
* Tailwind CSS  
* TanStack Query  
* Recharts  
* Gravity UI Icons \- Icon library  
* BetterAuth \- Authentication

## **Backend**

Required:

* Node.js  
* Express.js  
* TypeScript  
* MongoDB (do NOT use Mongoose, use native MongoDB driver)  
* Better Auth

## **AI Provider**

* **Gemini**  
* **Groq**

---

# **6\. Core Concept**

The core feature is the **Prompt Workspace**.

A user enters:

* Prompt title  
* Original prompt  
* Goal or task objective  
* Target AI model  
* Tone  
* Output length  
* Language  
* Audience  
* Output format  
* Extra context  
* Constraints  
* Examples, if any

Then clicks **Analyze Prompt**.

The AI system performs a multi-step agentic workflow:

1. Planner Agent understands the user’s goal.  
2. Prompt Analyzer checks clarity and completeness.  
3. Context Checker identifies missing information.  
4. Weakness Detector finds ambiguity, vague instructions, and missing constraints.  
5. Follow-up Question Agent asks questions if needed.  
6. Optimization Agent rewrites the prompt.  
7. Variant Generator creates multiple versions.  
8. Quality Evaluator scores the prompt.  
9. Recommendation Agent suggests improvements.  
10. History Manager saves the result.

---

# **7\. Agentic AI Workflow**

## **Basic Flow**

User submits prompt.

The system processes it through multiple AI agents:

User Input  
   ↓  
Planner Agent  
   ↓  
Prompt Analyzer Agent  
   ↓  
Context Checker Agent  
   ↓  
Weakness Detection Agent  
   ↓  
Follow-up Question Agent  
   ↓  
Prompt Optimization Agent  
   ↓  
Variant Generator Agent  
   ↓  
Quality Evaluation Agent  
   ↓  
Recommendation Agent  
   ↓  
Saved Prompt Result

## **Agent Responsibilities**

### **1\. Planner Agent**

Understands:

* What the user wants to achieve.  
* The purpose of the prompt.  
* The expected output.  
* The target AI platform.

Output:

* Prompt intent  
* Task type  
* Required context  
* Recommended optimization path

### **2\. Prompt Analyzer Agent**

Analyzes:

* Clarity  
* Specificity  
* Role definition  
* Context quality  
* Constraints  
* Output format  
* Tone  
* Missing details  
* Ambiguity  
* Completeness

Output:

* Analysis summary  
* Weakness list  
* Strength list  
* Improvement opportunities

### **3\. Context Checker Agent**

Checks whether the prompt includes enough context.

Output:

* Missing context points  
* Required follow-up questions  
* Optional improvement questions

### **4\. Follow-up Question Agent**

Generates intelligent follow-up questions when the original prompt is incomplete.

Example questions:

* Who is the target audience?  
* What format should the answer follow?  
* Should the output be short, detailed, technical, or beginner-friendly?  
* Do you want examples included?  
* What tone should the AI use?

### **5\. Prompt Optimization Agent**

Generates an improved version of the prompt.

Output:

* Optimized prompt  
* Explanation of changes  
* Why the improved version is better

### **6\. Variant Generator Agent**

Creates multiple versions:

* Beginner-friendly version  
* Professional version  
* Short version  
* Detailed version  
* Claude-optimized version  
* Gemini-optimized version  
* ChatGPT-optimized version  
* Few-shot version  
* Structured JSON output version

### **7\. Quality Evaluator Agent**

Scores the prompt from 0 to 100\.

Score categories:

* Clarity: 20  
* Context: 20  
* Specificity: 20  
* Constraints: 15  
* Output format: 15  
* Tone and audience alignment: 10

Output:

* Total score  
* Category-wise score  
* Grade: Poor, Average, Good, Excellent  
* Explanation

### **8\. Recommendation Agent**

Suggests:

* Better role  
* Better tone  
* Missing constraints  
* Better output format  
* Better examples  
* Better model-specific formatting

---

# **8\. Required AI Features**

Your assignment requires at least two substantial Agentic AI features. PromptPilot AI should include more than two to make the project stronger.

## **Feature 1: AI Prompt Analyzer**

Users submit a prompt, and the AI analyzes it.

### **Requirements**

The analyzer should detect:

* Unclear instructions  
* Missing context  
* Weak role definition  
* Ambiguous words  
* Missing output format  
* Missing constraints  
* Missing examples  
* Tone mismatch  
* Lack of target audience  
* Overly broad task description

### **Output**

The system should show:

* Prompt score  
* Strengths  
* Weaknesses  
* Missing information  
* Improvement suggestions  
* Follow-up questions

---

## **Feature 2: AI Prompt Optimizer**

The AI rewrites the prompt into a better version.

### **Requirements**

The optimizer should generate:

* Improved prompt  
* Short version  
* Detailed version  
* Beginner-friendly version  
* Professional version  
* Few-shot version  
* Model-specific version

### **User Controls**

Users can adjust:

* Tone  
* Length  
* Language  
* Target AI model  
* Output format  
* Creativity level  
* Audience type

### **Additional Actions**

Users can:

* Regenerate response  
* Copy optimized prompt  
* Save to history  
* Add to favorites  
* Add to collection

---

## **Feature 3: AI Chat Assistant**

A conversational assistant helps users understand and improve prompts.

### **Capabilities**

The assistant can:

* Explain why a prompt is weak.  
* Suggest improvements.  
* Rewrite for a specific model.  
* Answer questions about prompt engineering.  
* Remember previous messages in the same conversation.  
* Suggest follow-up prompts.  
* Help users navigate the app.

### **Requirements**

* Conversation history  
* Typing indicator  
* Suggested follow-up questions  
* Context-aware responses  
* Optional streaming response

---

## **Feature 4: AI Smart Recommendation Engine**

The AI recommends better prompt structures based on user behavior and saved prompts.

### **Recommendations May Include**

* Suggested templates  
* Better prompt formats  
* Frequently missing constraints  
* Best-performing prompt styles  
* Recommended tone  
* Recommended output format  
* Recommended target model

### **Requirements**

* Use saved prompt history.  
* Use previous prompt scores.  
* Improve recommendations based on user interactions.  
* Support filtering by category, model, tone, and score.

---

## **Feature 5: AI Auto Tagging and Classification**

When users save a prompt, the AI automatically generates tags and categories.

### **Example Tags**

* Coding  
* Marketing  
* Academic  
* Research  
* Email  
* Blog  
* Business  
* Social Media  
* Data Analysis  
* Image Generation

### **Requirements**

* Automatic tag generation  
* Editable tags  
* Category suggestion  
* Bulk classification for saved prompts

---

# **9\. Main Functional Requirements**

## **9.1 Landing Page**

The landing page should be public and accessible to all users.

### **Navbar**

Requirements:

* Full-width background  
* Sticky or fixed position  
* Fully responsive  
* Logo included  
* Active route indicator  
* Login/Register buttons for logged-out users  
* Dashboard/Profile/Logout for logged-in users

### **Logged-out Routes**

Minimum 3 routes:

* Home  
* Explore Templates  
* About  
* Contact  
* Login  
* Register

### **Logged-in Routes**

Minimum 5 routes:

* Dashboard  
* Prompt Workspace  
* Explore Templates  
* History  
* Collections  
* Analytics  
* Profile  
* Add Template  
* Manage Templates

### **Hero Section**

Requirements:

* Height between 60–70% of screen  
* Clear headline  
* Short description  
* Primary CTA  
* Secondary CTA  
* Interactive element

Example hero content:

**Headline:**

Write better AI prompts with an intelligent prompt optimization agent.

**Description:**

PromptPilot AI analyzes your prompts, finds weaknesses, asks smart questions, and generates optimized versions for ChatGPT, Claude, Gemini, and more.

### **Hero Interactive Element Ideas**

Choose one:

* Animated prompt improvement preview  
* Before/after prompt slider  
* Live typing animation  
* Prompt score animation  
* CTA demo input box

---

## **9.2 Landing Page Sections**

Minimum 7 meaningful sections are required.

Recommended sections:

1. Hero  
2. Features  
3. How It Works  
4. AI Agent Workflow  
5. Prompt Templates  
6. Statistics  
7. Testimonials  
8. Use Cases  
9. FAQ  
10. Newsletter  
11. Final CTA

You can include more than 7\.

### **Features Section**

Show key features:

* Prompt analysis  
* Prompt scoring  
* AI optimization  
* Follow-up questions  
* Prompt history  
* Collections  
* AI chat assistant  
* Analytics dashboard

### **How It Works Section**

Steps:

1. Write your prompt.  
2. Add your goal and target AI.  
3. Let the AI agent analyze it.  
4. Answer follow-up questions.  
5. Get optimized versions.  
6. Save, organize, and reuse.

### **AI Agent Workflow Section**

Show visual workflow:

Input → Analyze → Ask → Optimize → Score → Recommend → Save

### **Statistics Section**

Use real database-driven stats, not dummy content.

Examples:

* Total prompts optimized  
* Average improvement score  
* Total templates available  
* Number of active users  
* Most used target model

### **Testimonials Section**

No dummy content allowed.

Options:

* Allow real users to submit testimonials.  
* Show testimonials only after actual data exists.  
* If there are no testimonials, hide the section or show a message like: “User stories will appear here after real feedback is submitted.”

### **FAQ Section**

Include real FAQs about the app.

Example questions:

* What is PromptPilot AI?  
* Which AI models does it support?  
* Can I save my prompts?  
* Can I use it for ChatGPT, Claude, or Gemini?  
* Is my prompt history private?  
* Can I organize prompts by category?

### **Footer**

Requirements:

* Functional links only  
* Contact email  
* Social links  
* Copyright  
* Privacy Policy  
* Terms of Service  
* Responsive layout

---

# **10\. Authentication Requirements**

## **Pages**

* Register page  
* Login page  
* Profile page  
* Optional forgot password page

## **Authentication Methods**

Required:

* Email/password login  
* Google login  
* Demo login

## **Register Form Fields**

* Name  
* Email  
* Password  
* Confirm password

## **Login Form Fields**

* Email  
* Password

## **Demo Login**

The demo login button should auto-fill or directly authenticate with demo credentials.

Example:

Email: demo@promptpilot.ai  
Password: Pa$$w0rd\!

## **Validation Requirements**

Use proper validation:

* Required fields  
* Valid email format  
* Minimum password length  
* Password confirmation match  
* Clear error messages  
* Loading states  
* Success messages

## **Authorization**

Protected pages should only be accessible when logged in.

Protected routes:

* Dashboard  
* Prompt Workspace  
* History  
* Collections  
* Analytics  
* Add Template  
* Manage Templates  
* Profile

If a user is not logged in, redirect to:

/login

---

# **11\. Prompt Workspace Requirements**

This is the main feature of the application.

## **Route**

/workspace

or

/prompts/new

## **Form Fields**

Required:

* Prompt title  
* Original prompt  
* Goal  
* Target AI model  
* Tone  
* Output length  
* Language  
* Output format  
* Audience  
* Category

Optional:

* Extra context  
* Constraints  
* Examples  
* Creativity level  
* Tags

## **Actions**

* Analyze Prompt  
* Optimize Prompt  
* Generate Variants  
* Save Prompt  
* Regenerate  
* Copy Result  
* Add to Favorite  
* Export as TXT / PDF

## **Result Sections**

After analysis, show:

* Prompt score  
* Strengths  
* Weaknesses  
* Missing context  
* Follow-up questions  
* Optimized prompt  
* Multiple prompt versions  
* Recommendations  
* Category and tags  
* Save button

---

# **12\. Prompt History Requirements**

## **Route**

/history

## **Data to Save**

Each prompt history item should include:

* User ID  
* Prompt title  
* Original prompt  
* Optimized prompt  
* Prompt variants  
* Score  
* Target AI model  
* Tone  
* Language  
* Category  
* Tags  
* Favorite status  
* Created date  
* Updated date

## **Features**

Users can:

* View prompt history  
* Search prompts  
* Filter prompts  
* Sort prompts  
* Delete prompts  
* Mark as favorite  
* View details  
* Re-optimize old prompts

---

# **13\. Collections Requirements**

## **Route**

/collections

Users can organize prompts into collections.

Default collections:

* Coding  
* Marketing  
* Writing  
* Study  
* Business  
* Research

Users can create custom collections.

## **Collection Features**

* Create collection  
* Edit collection  
* Delete collection  
* Add prompts to collection  
* Remove prompts from collection  
* View prompts by collection

---

# **14\. Dashboard Requirements**

## **Route**

/dashboard

The dashboard should show personalized user data.

## **Required Cards**

* Total prompts  
* Average prompt score  
* Saved templates  
* Favorite prompts  
* Most used AI model  
* Most used category

## **Charts Using Recharts**

Required:

* Prompt optimization history chart  
* Score improvement chart  
* Category usage pie chart  
* Target model usage bar chart

## **Recent Activity**

Show:

* Recently optimized prompts  
* Recently saved templates  
* Recent recommendations

---

# **15\. Core Listing / Card Section Requirement**

Your assignment requires a listing/card section. For PromptPilot AI, use **Prompt Templates** as the listing feature.

## **Public Explore Page**

Route:

/templates

or

/explore

This page lists prompt templates that users can browse.

Each card must include:

* Image or icon  
* Title  
* Short description  
* Meta info  
* View Details button

## **Card Meta Info Examples**

Use real values such as:

* Category  
* Rating  
* Usage count  
* Created date  
* Target AI model  
* Difficulty level

## **Card Rules**

* Same height  
* Same width  
* Same border radius  
* Same layout  
* Desktop view: 4 cards per row  
* Tablet view: 2 cards per row  
* Mobile view: 1 card per row  
* Skeleton loader while loading

---

# **16\. Template Details Page**

## **Route**

/templates/:id

This page must be publicly accessible.

## **Required Sections**

* Template title  
* Multiple images or visual previews, if applicable  
* Description / overview  
* Template prompt  
* Key information  
* Suggested use cases  
* Reviews / ratings  
* Related templates

## **Key Information Examples**

* Category  
* Target AI model  
* Difficulty  
* Tone  
* Output type  
* Created by  
* Created date  
* Usage count

## **Actions**

Logged-out users:

* View template  
* Copy template  
* Login to save

Logged-in users:

* Use template  
* Save to collection  
* Add to favorite  
* Rate template  
* Review template

---

# **17\. Listing / Explore Page Requirements**

## **Route**

/explore

or

/templates

## **Required Features**

* Search bar  
* Filtering with at least 2 fields  
* Sorting options  
* Pagination or infinite scroll  
* Fully functional filtering

## **Search Fields**

Search by:

* Template title  
* Description  
* Category  
* Tags  
* Target AI model

## **Filters**

At least 2 required, but recommended filters:

* Category  
* Target AI model  
* Difficulty  
* Rating  
* Date  
* Tone  
* Output type

## **Sorting Options**

* Newest first  
* Oldest first  
* Highest rated  
* Most used  
* A-Z  
* Z-A

## **Pagination**

Required options:

* Page size: 8 / 12 / 16  
* Previous button  
* Next button  
* Page number

---

# **18\. Protected Add Items Page**

Your assignment requires a protected Add Items page.

For this project, the item is a **Prompt Template**.

## **Route**

/items/add

or

/templates/add

Only logged-in users can access this page.

## **Form Fields**

Required assignment fields mapped to this project:

* Title  
* Short description  
* Full description  
* Category  
* Target AI model  
* Difficulty  
* Prompt template content  
* Optional image URL

Additional recommended fields:

* Tone  
* Output type  
* Tags  
* Example input  
* Example output  
* Public/private visibility

## **Buttons**

* Submit  
* Reset  
* Preview

## **After Submit**

The template should be saved in MongoDB and visible on:

* Explore page  
* Manage Templates page  
* User profile

---

# **19\. Protected Manage Items Page**

Your assignment requires a protected Manage Items page.

For this project, users manage their prompt templates.

## **Route**

/items/manage

or

/templates/manage

## **Features**

Show all templates created by the logged-in user.

Each row/card should include:

* Title  
* Category  
* Target model  
* Rating  
* Created date  
* Visibility  
* Actions

## **Actions**

Required:

* View  
* Delete

Recommended:

* Edit  
* Duplicate  
* Make public/private

## **Layout**

Can be table or grid.

Requirements:

* Clean  
* Readable  
* Responsive  
* Confirmation modal before delete  
* Empty state if no templates exist

---

# **20\. Additional Pages**

At least 2 additional pages are required.

Recommended pages:

## **About Page**

Route:

/about

Content:

* What PromptPilot AI is  
* Why it was built  
* Who it helps  
* How the AI workflow works

## **Contact Page**

Route:

/contact

Content:

* Contact form  
* Email  
* Social links  
* Support message

## **Blog Page**

Route:

/blog

Content:

* Prompt engineering tips  
* AI productivity articles  
* Best prompt examples

## **Privacy Policy Page**

Route:

/privacy

Content:

* How user data is stored  
* Prompt privacy  
* AI provider usage  
* Account data

## **Terms Page**

Route:

/terms

Content:

* Usage rules  
* User responsibilities  
* AI limitations

Minimum recommended additional pages:

* About  
* Contact  
* Privacy  
* Terms

---

# **21\. Reviews and Ratings**

Prompt templates should support reviews and ratings.

## **Review Fields**

* User ID  
* Template ID  
* Rating  
* Review text  
* Created date

## **Features**

* Logged-in users can submit reviews.  
* Public users can view reviews.  
* Average rating should be displayed on cards and details page.  
* Users cannot review the same template multiple times.

---

# **22\. AI Chat Assistant Requirements**

## **Route**

/assistant

or inside workspace as a side panel.

## **Features**

* Chat with AI  
* Ask prompt-related questions  
* Explain suggestions  
* Rewrite prompts  
* Recommend templates  
* Use previous conversation context

## **UI Requirements**

* Chat bubbles  
* Typing indicator  
* Suggested prompts  
* Loading state  
* Error state  
* Conversation history

## **Suggested Follow-up Prompts**

Examples:

* Why is my prompt weak?  
* Rewrite this for Claude.  
* Make this prompt beginner-friendly.  
* Add examples to this prompt.  
* Improve the output format.  
* Make this prompt shorter.

---

# **23\. Analytics Requirements**

## **Route**

/analytics

Use Recharts to visualize user activity.

## **Required Charts**

* Prompt score over time  
* Number of prompts created per week  
* Category usage  
* Target AI model usage  
* Average score by category

## **Metrics**

* Total prompts  
* Average score  
* Highest scoring prompt  
* Most improved prompt  
* Most used model  
* Most used tone

---

# **24\. Database Collections**

Use MongoDB collections.

## **users**

Stores user account information.

Fields:

{  
  name: string;  
  email: string;  
  password?: string;  
  image?: string;  
  provider: "credentials" | "google";  
  role: "user" | "admin";  
  createdAt: Date;  
  updatedAt: Date;  
}

## **prompts**

Stores user prompts and optimized results.

{  
  userId: ObjectId;  
  title: string;  
  originalPrompt: string;  
  goal: string;  
  targetModel: string;  
  tone: string;  
  language: string;  
  outputLength: string;  
  outputFormat: string;  
  audience?: string;  
  category: string;  
  tags: string\[\];  
  optimizedPrompt: string;  
  variants: {  
    type: string;  
    content: string;  
  }\[\];  
  score: number;  
  scoreBreakdown: {  
    clarity: number;  
    context: number;  
    specificity: number;  
    constraints: number;  
    outputFormat: number;  
    toneAlignment: number;  
  };  
  strengths: string\[\];  
  weaknesses: string\[\];  
  recommendations: string\[\];  
  followUpQuestions: string\[\];  
  favorite: boolean;  
  collectionId?: ObjectId;  
  createdAt: Date;  
  updatedAt: Date;  
}

## **templates**

Stores public and private prompt templates.

{  
  userId: ObjectId;  
  title: string;  
  shortDescription: string;  
  fullDescription: string;  
  promptContent: string;  
  category: string;  
  targetModel: string;  
  difficulty: "Beginner" | "Intermediate" | "Advanced";  
  tone?: string;  
  outputType?: string;  
  tags: string\[\];  
  imageUrl?: string;  
  visibility: "public" | "private";  
  usageCount: number;  
  averageRating: number;  
  createdAt: Date;  
  updatedAt: Date;  
}

## **collections**

Stores user-created folders.

{  
  userId: ObjectId;  
  name: string;  
  description?: string;  
  color?: string;  
  createdAt: Date;  
  updatedAt: Date;  
}

## **conversations**

Stores AI assistant conversations.

{  
  userId: ObjectId;  
  title: string;  
  createdAt: Date;  
  updatedAt: Date;  
}

## **messages**

Stores chat messages.

{  
  conversationId: ObjectId;  
  role: "user" | "assistant";  
  content: string;  
  createdAt: Date;  
}

## **recommendations**

Stores AI-generated recommendations.

{  
  userId: ObjectId;  
  promptId?: ObjectId;  
  type: string;  
  title: string;  
  description: string;  
  priority: "low" | "medium" | "high";  
  createdAt: Date;  
}

## **reviews**

Stores template reviews.

{  
  templateId: ObjectId;  
  userId: ObjectId;  
  rating: number;  
  comment: string;  
  createdAt: Date;  
}

## **analytics**

Stores user usage events.

{  
  userId: ObjectId;  
  eventType: string;  
  metadata: object;  
  createdAt: Date;  
}

---

# **25\. Backend API Requirements**

## **Auth APIs**

POST /api/auth/register  
POST /api/auth/login  
POST /api/auth/google  
POST /api/auth/demo-login  
POST /api/auth/logout  
GET  /api/auth/me

## **User APIs**

GET    /api/users/profile  
PATCH  /api/users/profile  
DELETE /api/users/account

## **Prompt APIs**

POST   /api/prompts  
GET    /api/prompts  
GET    /api/prompts/:id  
PATCH  /api/prompts/:id  
DELETE /api/prompts/:id  
PATCH  /api/prompts/:id/favorite

## **AI APIs**

POST /api/ai/analyze  
POST /api/ai/optimize  
POST /api/ai/generate-variants  
POST /api/ai/score  
POST /api/ai/recommend  
POST /api/ai/chat  
POST /api/ai/auto-tag

## **Template APIs**

POST   /api/templates  
GET    /api/templates  
GET    /api/templates/:id  
PATCH  /api/templates/:id  
DELETE /api/templates/:id  
POST   /api/templates/:id/use

## **Collection APIs**

POST   /api/collections  
GET    /api/collections  
GET    /api/collections/:id  
PATCH  /api/collections/:id  
DELETE /api/collections/:id  
POST   /api/collections/:id/prompts  
DELETE /api/collections/:id/prompts/:promptId

## **Review APIs**

POST   /api/templates/:id/reviews  
GET    /api/templates/:id/reviews  
PATCH  /api/reviews/:id  
DELETE /api/reviews/:id

## **Conversation APIs**

POST   /api/conversations  
GET    /api/conversations  
GET    /api/conversations/:id  
DELETE /api/conversations/:id  
GET    /api/conversations/:id/messages

## **Analytics APIs**

GET /api/analytics/summary  
GET /api/analytics/prompts-over-time  
GET /api/analytics/category-usage  
GET /api/analytics/model-usage  
GET /api/analytics/score-trends

---

# **26\. Prompt Engineering Templates**

Create reusable AI prompt templates in the backend.

## **Analyzer Prompt Template**

Purpose:

Analyze the quality of a user prompt.

Expected output:

{  
  "score": 82,  
  "strengths": \[\],  
  "weaknesses": \[\],  
  "missingContext": \[\],  
  "followUpQuestions": \[\],  
  "recommendations": \[\],  
  "scoreBreakdown": {}  
}

## **Optimizer Prompt Template**

Purpose:

Rewrite the prompt into a clearer, stronger, and more effective version.

Expected output:

{  
  "optimizedPrompt": "",  
  "explanation": "",  
  "changesMade": \[\]  
}

## **Variant Generator Prompt Template**

Purpose:

Generate multiple optimized versions.

Expected output:

{  
  "variants": \[  
    {  
      "type": "Beginner Friendly",  
      "content": ""  
    },  
    {  
      "type": "Professional",  
      "content": ""  
    },  
    {  
      "type": "Few-shot",  
      "content": ""  
    }  
  \]  
}

## **Recommender Prompt Template**

Purpose:

Suggest next improvements based on prompt history and current score.

Expected output:

{  
  "recommendations": \[  
    {  
      "title": "",  
      "description": "",  
      "priority": ""  
    }  
  \]  
}

## **Chat Assistant Prompt Template**

Purpose:

Answer user questions using app context and previous conversation.

Expected output:

{  
  "reply": "",  
  "suggestedFollowUps": \[\]  
}

---

# **27\. Security Requirements**

## **Authentication Security**

* Hash passwords using bcrypt.  
* Use JWT or Better Auth sessions.  
* Store tokens securely.  
* Protect private routes.  
* Validate user ownership before updating or deleting data.

## **API Security**

* Validate all request bodies.  
* Use rate limiting for AI endpoints.  
* Use CORS configuration.  
* Use Helmet.  
* Sanitize user input.  
* Do not expose API keys to frontend.  
* Store secrets in environment variables.

## **Authorization Rules**

Users can:

* View public templates.  
* Create their own prompts.  
* Manage only their own prompts.  
* Manage only their own templates.  
* Manage only their own collections.  
* View only their own analytics.

Admins can optionally:

* Manage public templates.  
* View platform analytics.  
* Moderate reviews.

---

# **28\. UI and Design Requirements**

## **Global Design Rules**

Assignment requirements:

* Use maximum 3 primary colors plus optional neutral color.  
* Maintain consistent layout, spacing, and alignment.  
* All cards and components must have the same size, border radius, and style.  
* Fully responsive for mobile, tablet, and desktop.  
* No placeholder or dummy content.

## **Recommended Color System**

Use only 3 primary colors:

1. Indigo / Blue — primary brand color  
2. Emerald / Green — success and score improvement  
3. Amber / Orange — warning or recommendation

Neutral:

* Slate / Zinc / Gray

Example:

Primary: \#4F46E5  
Secondary: \#10B981  
Accent: \#F59E0B  
Neutral: \#0F172A / \#F8FAFC

## **Typography**

Recommended:

* Font: Inter, Geist, or Plus Jakarta Sans  
* Clear heading hierarchy  
* Readable body text  
* Consistent spacing

## **Component Rules**

Use consistent:

* Button sizes  
* Card radius  
* Form input style  
* Shadow  
* Border  
* Spacing  
* Loading skeletons  
* Empty states  
* Error states

---

# **29\. Responsive Design Requirements**

The app must work on:

* Mobile  
* Tablet  
* Desktop

## **Mobile Requirements**

* Collapsible navbar  
* Single-column layout  
* Touch-friendly buttons  
* Responsive cards  
* Readable forms  
* Sticky bottom action if needed

## **Tablet Requirements**

* Two-column card layout  
* Optimized dashboard charts  
* Responsive sidebar

## **Desktop Requirements**

* 4 cards per row for listing page  
* Sidebar navigation for dashboard  
* Large workspace layout  
* Chat assistant side panel

---

# **30\. Page List**

## **Public Pages**

/  
 /about  
 /contact  
 /blog  
 /privacy  
 /terms  
 /explore  
 /templates  
 /templates/:id  
 /login  
 /register

## **Protected Pages**

/dashboard  
/workspace  
/history  
/prompts/:id  
/collections  
/analytics  
/assistant  
/profile  
/items/add  
/items/manage  
/templates/add  
/templates/manage

---

# **31\. User Roles**

## **Guest User**

Can:

* View landing page  
* Browse public templates  
* View template details  
* Read blogs  
* Register  
* Login

Cannot:

* Save prompts  
* Use prompt workspace  
* Access dashboard  
* Create templates  
* Review templates

## **Authenticated User**

Can:

* Use prompt analyzer  
* Use prompt optimizer  
* Chat with AI assistant  
* Save prompt history  
* Create collections  
* Add templates  
* Manage own templates  
* Review public templates  
* View analytics

## **Admin User — Optional**

Can:

* Manage users  
* Manage templates  
* Moderate reviews  
* View platform analytics

---

# **32\. No Placeholder Content Rule**

The assignment says no placeholder or dummy content.

For PromptPilot AI:

* Do not use Lorem Ipsum.  
* Do not show fake testimonials.  
* Do not show fake analytics.  
* Do not show fake user counts.  
* Do not show fake reviews.

Instead:

* Use real database content.  
* Hide sections if no data exists.  
* Show meaningful empty states.

Example empty state:

No prompt templates found. Create your first template to start building your prompt library.

---

# **33\. Loading and Error States**

Every data-driven page should include:

## **Loading State**

* Skeleton loader  
* Spinner where appropriate  
* Disabled buttons during submit

## **Error State**

* Clear error message  
* Retry button  
* Form-level errors  
* Field-level validation errors

## **Empty State**

Examples:

* No prompts saved yet.  
* No templates found.  
* No collections created yet.  
* No analytics available yet.

---

# **34\. README.md Requirements**

If frontend and backend are in one monorepo, clearly document the structure.

Recommended README should include:

* Project overview  
* Features  
* Tech stack  
* Environment variables  
* Installation steps  
* API documentation  
* Live link  
* Demo login credentials  
* Screenshots  
* AI features explanation  
* Agentic workflow explanation

---

# **35\. Recommended Folder Structure**

## **Frontend**

frontend/  
  src/  
    app/  
      page.tsx  
      about/  
      contact/  
      blog/  
      login/  
      register/  
      dashboard/  
      workspace/  
      history/  
      collections/  
      analytics/  
      assistant/  
      templates/  
      items/  
    components/  
      shared/  
      ui/  
      layout/  
      cards/  
      forms/  
      charts/  
      ai/  
    hooks/  
    lib/  
    services/  
    types/  
    utils/

## **Backend**

backend/  
  src/  
    config/  
    controllers/  
    middlewares/  
    models/  
    routes/  
    services/  
      ai/  
      auth/  
      analytics/  
    prompts/  
    validators/  
    utils/  
    app.ts  
    server.ts

---

# **36\. Must-Have Features Checklist**

Use this as your final development checklist.

## **Assignment Requirement Coverage**

* \[ \] Next.js frontend  
* \[ \] TypeScript  
* \[ \] Tailwind CSS  
* \[ \] TanStack Query  
* \[ \] Recharts  
* \[ \] Node.js backend  
* \[ \] Express.js  
* \[ \] MongoDB  
* \[ \] JWT or Better Auth  
* \[ \] Google login  
* \[ \] Demo login  
* \[ \] Responsive navbar  
* \[ \] Minimum 7 landing page sections  
* \[ \] Functional footer  
* \[ \] Listing/card section  
* \[ \] 4 cards per row on desktop  
* \[ \] Skeleton loader  
* \[ \] Public details page  
* \[ \] Search  
* \[ \] At least 2 filters  
* \[ \] Sorting  
* \[ \] Pagination or infinite scroll  
* \[ \] Protected Add Items page  
* \[ \] Protected Manage Items page  
* \[ \] At least 2 additional pages  
* \[ \] At least 2 agentic AI features  
* \[ \] No dummy content  
* \[ \] Fully responsive design  
* \[ \] Live website  
* \[ \] GitHub repository

## **PromptPilot-Specific Features**

* \[ \] Prompt analyzer  
* \[ \] Prompt optimizer  
* \[ \] Prompt score  
* \[ \] Prompt variants  
* \[ \] Follow-up questions  
* \[ \] AI recommendations  
* \[ \] AI chat assistant  
* \[ \] Prompt history  
* \[ \] Collections  
* \[ \] Favorites  
* \[ \] Template explore page  
* \[ \] Template details page  
* \[ \] Reviews and ratings  
* \[ \] Analytics dashboard  
* \[ \] Auto tagging

---

# **37\. Recommended MVP Scope**

If you have limited time, build these first:

1. Landing page  
2. Authentication  
3. Prompt workspace  
4. AI analyzer  
5. AI optimizer  
6. Prompt history  
7. Explore templates page  
8. Template details page  
9. Add template page  
10. Manage template page  
11. Dashboard analytics  
12. Contact and About pages

Then add:

* AI chat assistant  
* Collections  
* Reviews  
* Auto tagging  
* Advanced recommendations

---

# **38\. Final Project Summary**

**PromptPilot AI** is a strong project idea because it naturally satisfies the Agentic AI assignment requirements. It includes a real-world use case, multi-step AI reasoning, prompt engineering, authentication, protected routes, database storage, analytics, listing pages, filtering, sorting, card design, and a professional UI.

The final app should feel like a complete SaaS product where users can analyze, improve, save, organize, and reuse high-quality prompts for different AI platforms.

