CAREERFLOW — COMPLETE FRONTEND BUILD + EXISTING BACKEND INTEGRATION

You are building the production frontend for an existing career platform called CAREERFLOW.

IMPORTANT:
This is NOT a request to create a generic landing page, a static UI mockup, or a disconnected prototype.

Build a real, functional React frontend that consumes the existing backend API.

The frontend must use real API calls, real authentication, real persisted data, loading states, error states, empty states, and authenticated user flows.

Do NOT replace working backend functionality with mock data.

Do NOT create fake APIs.

Do NOT hardcode CVs, users, jobs, businesses, or analytics as permanent static data.

Where an API endpoint does not yet exist for a new feature, create the frontend structure in a way that can be connected to the backend later, but clearly separate it from functionality that already exists.

==================================================
1. PRODUCT OVERVIEW
==================================================

CareerFlow is a complete career platform.

It combines:

1. CV Builder
2. AI Cover Letter Generator
3. Find Jobs
4. AI-powered job discovery
5. Jobs posted by registered businesses
6. Business registration and business profiles
7. Recruitment assistance
8. CareerFlow Recruitment Team
9. User career dashboard
10. Admin dashboard
11. Admin analytics
12. User/business support and issue management

The platform should feel like ONE connected ecosystem.

A user should be able to:

Create account
→ enter CareerFlow
→ manage their career profile
→ create/edit CV
→ choose CV template
→ generate/download CV
→ generate cover letter
→ find jobs
→ search/filter jobs
→ save jobs
→ eventually apply
→ track career activity.

Businesses should be able to:

Register
→ create company profile
→ post vacancies
→ manage vacancies
→ receive/manage candidates where applicable
→ request recruitment assistance from CareerFlow Recruitment Team.

Administrators should be able to:

Manage the entire platform
→ users
→ CVs
→ businesses
→ jobs
→ recruitment requests
→ support issues
→ analytics
→ platform activity.

==================================================
2. EXISTING FRONTEND/BACKEND — DO NOT BREAK THIS
==================================================

There is already an existing CVBuilder frontend and ASP.NET Core backend.

The new frontend must preserve the existing CVBuilder functionality and connect to the existing API.

The existing backend technology is:

- ASP.NET Core
- C#
- Entity Framework Core
- PostgreSQL
- JWT authentication

The backend already contains models/entities including:

- User
- Cv
- CvSkill
- CvExperience
- CvProject
- CvEducation
- UsageEvent

The backend already has authentication and CV functionality.

DO NOT create another authentication architecture.

DO NOT create a second CV database model.

DO NOT replace the existing API.

Extend the existing architecture where necessary.

==================================================
3. EXISTING AUTHENTICATION
==================================================

The existing authentication API supports:

POST:

/api/Auth/register

and

/api/Auth/login

Registration and login return:

- token
- userId
- fullName
- email

The JWT contains the authenticated user's:

- NameIdentifier
- Name
- Email

The frontend currently stores authentication information using:

localStorage.setItem('careerflow_token', data.token);

and:

localStorage.setItem(
    'careerflow_user',
    JSON.stringify({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email
    })
);

The frontend must continue using this authentication approach unless there is a strong technical reason to change it.

For authenticated API requests, use:

Authorization: Bearer {token}

If there is no token:

- do not call protected endpoints
- redirect the user to login
- show an appropriate authentication message.

If the API returns 401:

- treat the session as expired/invalid
- clear authentication state when appropriate
- return the user to the login page.

IMPORTANT:

The user should remain logged in after refreshing the browser.

When the user logs out:

- clear the authentication data
- return them to the public landing page.

==================================================
4. EXISTING CVBUILDER
==================================================

The CVBuilder is already the foundation of CareerFlow.

Do NOT redesign it into a completely different product.

Preserve its existing workflow, presentation style, visual language, templates, section structure and user experience.

The CVBuilder must live inside the CareerFlow user workspace.

The user should not feel like they are leaving CareerFlow to use a separate product.

==================================================
5. CV DATA ALREADY SUPPORTED
==================================================

The existing CV backend supports:

CV basic information:

- Full Name
- Professional Title
- Short Bio
- Email
- Phone
- Location
- LinkedIn URL
- GitHub URL

CV sections:

- Skills
- Experience
- Projects
- Education

The CV API supports operations for:

Create CV
Get CV
Update CV
Delete CV

Skills:

Add
Get
Delete

Experience:

Add
Get
Update
Delete

Projects:

Add
Get
Update
Delete

Education:

Add
Get
Update
Delete

The CV is associated with the authenticated user through UserId.

The existing endpoint:

GET /api/Cv/my-cvs

returns the authenticated user's CVs.

Use the authenticated user rather than exposing another user's CV.

==================================================
6. CV BUILDER USER FLOW
==================================================

The CV Builder should use a clear guided workflow.

The user should be able to move through the CV creation process step by step.

Recommended structure:

STEP 1 — Personal Information

- Full Name
- Professional Title
- Email
- Phone
- Location
- LinkedIn
- GitHub
- Professional Summary / Short Bio

STEP 2 — Experience

Allow the user to:

- add experience
- edit experience
- delete experience
- mark current position
- enter job title
- company
- location
- start date
- end date
- description

STEP 3 — Education

Allow:

- institution
- degree
- field of study
- location
- start date
- end date
- current education

STEP 4 — Skills

Allow users to:

- add skills
- remove skills
- manage their skill list.

STEP 5 — Projects

Allow:

- project title
- role
- description
- technologies
- project URL

Allow adding, editing and deleting projects.

STEP 6 — Template

The user should be able to select from the existing CV templates.

DO NOT remove the existing templates.

Present templates visually with professional previews.

The template selector should feel premium and modern.

STEP 7 — Preview

Show a professional live CV preview.

The preview should update as the user changes their information.

STEP 8 — Download

Allow the user to download the finished CV.

The interface should make it obvious when the CV has been successfully saved.

==================================================
7. CV AUTOSAVE / PERSISTENCE
==================================================

The existing system already persists CV information through the backend.

Use API persistence rather than relying only on browser state.

The interface should provide appropriate states:

Saving...
Saved
Unable to save
Retry

Avoid constantly displaying unnecessary notifications.

The user should be able to refresh the page and continue working with their existing CV.

If the user already has CVs, show them and allow them to continue editing.

==================================================
8. CV DASHBOARD
==================================================

Inside the user's CareerFlow dashboard, provide a CV section showing:

- My CVs
- Create New CV
- Continue Editing
- Duplicate where supported
- Download
- Delete
- Last updated date

Show useful empty states when the user has no CV.

Example:

"You haven't created a CV yet."

CTA:

"Create My CV"

==================================================
9. AI COVER LETTER GENERATOR
==================================================

CareerFlow already has an AI-powered cover letter feature.

Do not remove it.

The user should be able to generate a cover letter based on a job description.

The experience should be:

User selects:

"Generate Cover Letter"

Then provide:

Job title
Company
Job description

The system uses the user's CV/profile information together with the job description.

The generated cover letter should appear in an editable professional editor.

Allow:

- regenerate
- edit
- copy
- download
- save where supported.

The interface should clearly communicate that AI is assisting the user.

Do not make the AI experience look like a generic chatbot.

It should feel like a professional career tool.

==================================================
10. USER HOME / CAREER DASHBOARD
==================================================

Every authenticated user should have a central CareerFlow home.

This is extremely important.

The dashboard should NOT simply be a profile page.

It is the user's career command center.

Suggested dashboard:

HEADER:

Good morning, [First Name]

"Let's move your career forward."

Then useful cards:

My CV
- Current CV
- Completion status
- Edit CV

Cover Letter
- Generate a cover letter

Find Jobs
- Search available opportunities

Saved Jobs
- Number of saved jobs

Applications
- Application activity where available

Career Profile
- Profile completion

Recruitment Assistance
- Request help finding opportunities/candidates where applicable.

Also include recent activity.

==================================================
11. USER PROFILE
==================================================

The user should have a complete profile area.

Include:

Personal information
Email
Phone
Location
Professional title
Skills
Career information
Social links
Profile completion

Include account settings.

The user's account should remain separate from the public CV data while allowing the CV builder to use relevant profile information.

==================================================
12. FIND JOBS
==================================================

Find Jobs is one of the major parts of CareerFlow.

This is NOT a static job listing page.

It will eventually use backend services and AI to discover jobs.

There are TWO major job sources:

SOURCE A:
AI-discovered / aggregated jobs from external job platforms.

SOURCE B:
Jobs posted directly by registered businesses on CareerFlow.

Both should appear in one unified job-search experience.

==================================================
13. JOB SEARCH EXPERIENCE
==================================================

The job search should feel similar in quality and usability to LinkedIn/Indeed-style search.

Users should be able to search by:

- Job title
- Keywords
- Skills
- Company
- Location

Filters should include:

- Remote
- Hybrid
- On-site
- Employment type
- Full-time
- Part-time
- Contract
- Internship
- Experience level
- Salary range
- Date posted
- Industry
- Company
- Skills

Allow sorting by:

- Relevance
- Most recent
- Salary where available

The UI must be designed so additional search/filter parameters can be added later without redesigning the page.

==================================================
14. AI JOB DISCOVERY
==================================================

AI will eventually assist the backend in discovering and matching jobs.

The frontend should therefore support:

AI-powered job recommendations.

Example:

"Recommended for you"

Based on:

- CV
- skills
- experience
- preferred location
- job title
- career interests.

The AI layer will be implemented in the backend.

Do NOT fake AI responses.

Create the UI and API service architecture so real AI results can be plugged in.

==================================================
15. JOB CARDS
==================================================

Each job card should clearly display:

Company
Company logo
Job title
Location
Work arrangement
Employment type
Experience level
Salary where available
Date posted
Required skills
Job source

Clearly identify jobs posted directly by CareerFlow businesses.

Allow:

Save Job
View Job
Apply

For external jobs:

"Apply on company/job platform"

For CareerFlow jobs:

"Apply on CareerFlow"

Do not invent application behavior that the backend does not support yet.

==================================================
16. JOB DETAILS
==================================================

Job details page should contain:

Job title
Company
Company profile
Location
Work arrangement
Salary
Employment type
Experience level
Description
Responsibilities
Requirements
Skills
Benefits
Date posted

Primary CTA:

Apply

Secondary:

Save Job

Also provide:

"Generate Cover Letter"

This should connect the job description directly to the existing AI cover-letter workflow when implemented.

==================================================
17. SAVED JOBS
==================================================

Authenticated users should have:

Saved Jobs

Show:

- job title
- company
- date saved
- location
- status

Allow removing jobs from saved jobs.

Build this around API calls rather than static state.

==================================================
18. BUSINESS PLATFORM
==================================================

CareerFlow will also support registered businesses.

Create a dedicated business experience.

A business should be able to:

Register
Create company profile
Manage company profile
Post jobs
Manage vacancies
View vacancy status
Manage candidates/applications when supported
Request recruitment assistance.

Business registration should capture appropriate information such as:

Company name
Industry
Company description
Location
Website
Company contact
Business information.

==================================================
19. BUSINESS JOB POSTING
==================================================

Businesses should be able to create job vacancies.

Job posting should support:

Job title
Description
Responsibilities
Requirements
Skills
Location
Remote/Hybrid/On-site
Employment type
Experience level
Salary
Application method
Closing date
Company information.

Provide a professional job-posting form.

Show a preview before publishing.

Allow:

Save draft
Publish
Edit
Close vacancy.

==================================================
20. RECRUITMENT ASSISTANCE
==================================================

CareerFlow should have a service where businesses can request help finding qualified candidates.

Call this service:

CareerFlow Recruitment Team

The business should be able to submit:

Company
Position
Number of candidates required
Job description
Required skills
Experience level
Location
Employment type
Salary range
Urgency
Additional requirements.

CTA:

"Request Recruitment Support"

After submission, the request should enter the CareerFlow recruitment/admin workflow.

The business should be able to see request status where supported.

Possible statuses:

Submitted
Under Review
In Progress
Candidates Being Sourced
Candidates Presented
Completed
Closed

==================================================
21. CAREERFLOW RECRUITMENT TEAM
==================================================

The recruitment service should feel like a professional business service, not a simple contact form.

Create a dedicated section explaining:

"Need qualified candidates?"

CareerFlow Recruitment Team helps businesses identify and connect with qualified candidates.

CTA:

"Request Recruitment Support"

Show:

- how it works
- what businesses can request
- recruitment process
- request status
- contact/support.

==================================================
22. ADMIN DASHBOARD
==================================================

CRITICAL:

CareerFlow must have a complete ADMIN DASHBOARD.

This is NOT optional.

Do not forget this section.

The admin dashboard is separate from the normal user dashboard.

Only authorized administrators should access it.

The admin controls the entire CareerFlow platform.

==================================================
23. ADMIN OVERVIEW
==================================================

Admin dashboard should show:

Total Users
Active Users
Total CVs
CVs Created Today
Registered Businesses
Active Businesses
Total Jobs
Active Jobs
Applications
Recruitment Requests
Open Support Issues
Platform Activity

Use professional analytics cards and charts.

==================================================
24. ADMIN ANALYTICS
==================================================

There is already an admin analytics concept/functionality in the existing CareerFlow system.

PRESERVE IT.

Do not remove it.

Expand it where necessary.

Analytics should include:

User growth
CV creation
Job posting activity
Business registration
Job applications/activity
Recruitment requests
Platform engagement
User activity
Business activity.

Provide:

- daily
- weekly
- monthly
- yearly

views where supported.

Use charts and clear trend indicators.

==================================================
25. ADMIN USER MANAGEMENT
==================================================

Admin should be able to:

View users
Search users
Filter users
View user profile
View user activity
View CV information
Deactivate users
Reactivate users
Investigate user issues.

Use confirmation dialogs for destructive actions.

==================================================
26. ADMIN CV MANAGEMENT
==================================================

Admin should be able to:

View CV records
Search CVs
View CV details
Investigate problematic CV records
Manage/remove records where authorized.

Do not allow admins to accidentally modify user data without confirmation.

==================================================
27. ADMIN BUSINESS MANAGEMENT
==================================================

Admin should be able to:

View businesses
Search businesses
Review business information
Approve businesses where approval is required
Deactivate businesses
Reactivate businesses
View business vacancies
View recruitment requests.

==================================================
28. ADMIN JOB MANAGEMENT
==================================================

Admin should be able to:

View all jobs
Search jobs
Filter jobs
Review job details
View business that posted job
Edit where authorized
Remove inappropriate jobs
Close jobs
Change job status.

==================================================
29. ADMIN RECRUITMENT REQUESTS
==================================================

Admin/recruitment team should receive all recruitment requests.

Dashboard should show:

Request ID
Business
Position
Date submitted
Priority
Status
Assigned staff/team member where applicable.

Admin should be able to open a request and see full details.

Allow statuses:

Submitted
Under Review
In Progress
Candidates Being Sourced
Candidates Presented
Completed
Rejected
Closed

==================================================
30. ADMIN SUPPORT / ISSUES
==================================================

CareerFlow must have a place where user/business problems can be received and managed.

Users should eventually be able to report:

- account problems
- CV problems
- job problems
- application problems
- business problems
- technical issues.

Admin should see:

Issue
User/business
Category
Priority
Date
Status
Assigned person
Resolution.

Statuses:

Open
In Progress
Waiting for User
Resolved
Closed.

==================================================
31. ADMIN PLATFORM ACTIVITY
==================================================

Provide an activity/log section showing important platform actions.

Examples:

User registered
CV created
CV updated
Business registered
Job posted
Job updated
Recruitment request submitted
Issue reported
Admin action performed.

This should eventually connect to backend usage/activity data.

==================================================
32. NAVIGATION STRUCTURE
==================================================

PUBLIC NAVIGATION:

Home
Find Jobs
CV Builder
Career Tools
For Businesses
About
Login
Get Started

AUTHENTICATED USER NAVIGATION:

Dashboard
My CVs
Cover Letters
Find Jobs
Saved Jobs
Applications
Career Profile
Recruitment/Support
Settings

BUSINESS NAVIGATION:

Business Dashboard
Company Profile
Jobs
Post a Job
Candidates
Recruitment Support
Settings

ADMIN NAVIGATION:

Admin Dashboard
Analytics
Users
CVs
Businesses
Jobs
Applications
Recruitment Requests
Support Issues
Activity
Settings

Do not show admin navigation to normal users.

==================================================
33. DESIGN SYSTEM
==================================================

Preserve the existing CareerFlow/CVBuilder visual identity.

Do not introduce an unrelated color palette.

Use the same colors, typography, spacing language, card styling, buttons, borders, radius, shadows and general visual personality already established by the existing CVBuilder.

The new pages must look like they belong to the same product.

The design should be:

Modern
Professional
Clean
Trustworthy
Premium
Career-focused
Easy to navigate.

Avoid:

Overly flashy gradients
Excessive animations
Generic AI-looking interfaces
Unnecessary glassmorphism
Crowded dashboards
Huge empty spaces
Stock-template appearance.

The interface should feel like a serious career technology platform.

==================================================
34. RESPONSIVE DESIGN
==================================================

The entire application must work properly on:

Desktop
Laptop
Tablet
Mobile.

Do not simply shrink desktop layouts.

Create proper mobile navigation.

Forms must remain usable on small screens.

Tables should become responsive cards or horizontally scroll where appropriate.

==================================================
35. REAL API INTEGRATION
==================================================

CRITICAL:

The frontend must consume the existing backend API.

Do not use mock data for functionality that already exists.

Create a centralized API service layer.

For example:

api/
  authApi
  cvApi
  jobsApi
  businessApi
  recruitmentApi
  adminApi
  userApi

Use the existing backend base URL through environment configuration.

Example:

VITE_API_BASE_URL

Do not hardcode localhost URLs throughout components.

==================================================
36. AUTHENTICATED REQUESTS
==================================================

Create a reusable authenticated API mechanism.

Every protected request should automatically use:

Authorization: Bearer {careerflow_token}

Do not manually duplicate token logic in every component.

Handle:

200
201
400
401
403
404
409
422
500

appropriately.

Show useful user-facing error messages.

Do not expose raw backend exceptions to normal users.

==================================================
37. LOADING STATES
==================================================

Every API-driven page needs appropriate loading states.

Examples:

Loading CVs...
Loading jobs...
Saving CV...
Updating profile...
Submitting request...
Publishing vacancy...

Use skeletons/spinners where appropriate.

Never leave the user staring at a blank page.

==================================================
38. EMPTY STATES
==================================================

Create polished empty states.

Examples:

No CVs yet
No saved jobs
No applications
No recruitment requests
No job vacancies
No support issues.

Every empty state should have a useful explanation and CTA.

==================================================
39. ERROR STATES
==================================================

If an API request fails:

Show a professional error message.

Example:

"Something went wrong while loading your CVs."

CTA:

"Try Again"

Do not crash the entire application.

==================================================
40. SECURITY / OWNERSHIP
==================================================

The frontend must respect authentication and authorization.

A user must only see their own:

CVs
Saved jobs
Applications
Profile
Activity.

Businesses must only manage their own:

Business profile
Jobs
Candidates
Recruitment requests.

Admins have elevated access according to their role.

Never trust frontend IDs for ownership decisions.

The backend remains the source of truth.

==================================================
41. API-FIRST ARCHITECTURE
==================================================

Build the frontend so every major data operation is separated from presentation.

Do not put large amounts of API logic directly inside UI components.

Use reusable hooks/services where appropriate.

Example:

useAuth()
useMyCvs()
useCv()
useJobs()
useSavedJobs()
useBusiness()
useRecruitmentRequests()
useAdminAnalytics()

This will make the frontend easier to maintain as the backend grows.

==================================================
42. DO NOT INVENT EXISTING ENDPOINTS
==================================================

This is extremely important.

For functionality that already exists in the backend, use the real endpoints.

For new functionality where the backend has not yet been built:

Create the UI and service abstraction, but clearly isolate the API implementation.

Do NOT pretend an endpoint exists.

Do NOT hardcode fake successful API responses.

Do NOT store permanent fake jobs/users/businesses as if they came from the backend.

The backend will be expanded after the frontend architecture is complete.

==================================================
43. EXISTING CV API STRUCTURE
==================================================

The frontend should support the existing CV API structure.

Existing CV controller:

/api/Cv

Existing operations include:

POST /api/Cv

GET /api/Cv/{id}

PUT /api/Cv/{id}

DELETE /api/Cv/{id}

GET /api/Cv/my-cvs

Skills:

POST /api/Cv/{cvId}/skills

GET /api/Cv/{cvId}/skills

DELETE /api/Cv/{cvId}/skills/{skillId}

Experience:

POST /api/Cv/{cvId}/experiences

GET /api/Cv/{cvId}/experiences

PUT /api/Cv/{cvId}/experiences/{experienceId}

DELETE /api/Cv/{cvId}/experiences/{experienceId}

Projects:

POST /api/Cv/{cvId}/projects

GET /api/Cv/{cvId}/projects

PUT /api/Cv/{cvId}/projects/{projectId}

DELETE /api/Cv/{cvId}/projects/{projectId}

Education:

POST /api/Cv/{cvId}/educations

GET /api/Cv/{cvId}/educations

PUT /api/Cv/{cvId}/educations/{educationId}

DELETE /api/Cv/{cvId}/educations/{educationId}

Use these real endpoints.

==================================================
44. EXISTING USER CV OWNERSHIP
==================================================

The backend now associates CVs with authenticated users.

The authenticated user's ID comes from:

ClaimTypes.NameIdentifier

The CV has:

UserId

Therefore:

GET /api/Cv/my-cvs

must show only the current user's CVs.

Do not bypass this.

==================================================
45. DATA FLOW
==================================================

The expected architecture is:

React UI
↓
API service layer
↓
ASP.NET Core API
↓
Entity Framework Core
↓
PostgreSQL

Authentication:

Login/Register
↓
JWT
↓
localStorage
↓
Authenticated API requests
↓
Backend authorization
↓
User-specific data.

==================================================
46. EXISTING FUNCTIONALITY MUST BE TESTABLE
==================================================

After generating the frontend, I will immediately test:

1. Register
2. Login
3. Refresh browser
4. Confirm user remains logged in
5. Create CV
6. Save CV
7. Refresh
8. Retrieve CV
9. Edit CV
10. Add skill
11. Add experience
12. Add education
13. Add project
14. Delete/edit records
15. View My CVs
16. Logout
17. Login again
18. Confirm existing CV is still available.

Therefore the generated frontend must actually call the API for these operations.

==================================================
47. NO DEMO-ONLY IMPLEMENTATION
==================================================

Do NOT deliver:

- static dashboard
- fake job data presented as real
- fake CV persistence
- fake login
- fake authentication
- fake analytics
- fake API responses.

The frontend must be structured as a real application.

==================================================
48. FINAL PRODUCT EXPERIENCE
==================================================

CareerFlow should ultimately feel like:

A combination of:

Professional CV Builder
+
AI Career Assistant
+
Job Discovery Platform
+
Business Recruitment Platform
+
Recruitment Service
+
Career Management Workspace.

The user experience should be simple:

LANDING PAGE
↓
SIGN UP / LOGIN
↓
CAREERFLOW DASHBOARD
↓
BUILD CV
↓
GENERATE COVER LETTER
↓
FIND JOBS
↓
SAVE / APPLY
↓
TRACK CAREER ACTIVITY

Businesses:

BUSINESS REGISTRATION
↓
BUSINESS DASHBOARD
↓
POST VACANCY
↓
MANAGE VACANCIES
↓
REQUEST RECRUITMENT SUPPORT
↓
CAREERFLOW RECRUITMENT TEAM

Administrators:

ADMIN LOGIN
↓
ADMIN DASHBOARD
↓
ANALYTICS
↓
USERS
↓
CVS
↓
BUSINESSES
↓
JOBS
↓
RECRUITMENT REQUESTS
↓
SUPPORT / ISSUES
↓
PLATFORM ACTIVITY

==================================================
49. IMPLEMENTATION PRIORITY
==================================================

PRIORITY 1 — PRESERVE AND CONNECT EXISTING FUNCTIONALITY

- Authentication
- JWT
- User session
- CV creation
- CV retrieval
- CV update
- CV deletion
- My CVs
- Skills
- Experience
- Projects
- Education
- Existing CV templates
- Existing CV preview/download
- Existing AI cover-letter workflow.

PRIORITY 2 — USER CAREER WORKSPACE

- Dashboard
- Profile
- Saved jobs
- Career activity
- Navigation.

PRIORITY 3 — JOB PLATFORM

- Find Jobs
- Search
- Filters
- Job details
- Save job
- Application architecture
- AI recommendations
- External/aggregated jobs
- Business-posted jobs.

PRIORITY 4 — BUSINESS PLATFORM

- Business registration
- Company profile
- Job posting
- Vacancy management
- Recruitment support request.

PRIORITY 5 — ADMIN

- Admin dashboard
- Existing analytics
- User management
- CV management
- Business management
- Job management
- Recruitment requests
- Support/issues
- Activity logs.

==================================================
50. MOST IMPORTANT RULE
==================================================

Do not destroy or replace what already works.

The existing CVBuilder and authentication are the foundation.

Extend them into CareerFlow.

The frontend must be designed so that I can immediately run it, configure the backend URL, log in with a real account, and test the existing CV API.

Use real API integration wherever the backend already supports the feature.

For future features, create clean API-ready architecture without pretending the backend already supports them.

The final result should be a cohesive, production-quality CareerFlow frontend rather than a collection of unrelated screens.