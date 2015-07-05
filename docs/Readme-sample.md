![Image of MedCheck](https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/images/logo.png?raw=true)
# Introduction #
MedCheck is a responsive web application developed by Octo Consulting Group in response to the solicitation released by 18F for Agile Delivery Services (ADS).  MedCheck leverages the APIs offered by fda.gov and provides analysis of adverse events and recalls of various drugs.  Octo’s team of agile experts, developers, testers, user interface/experience designers and dev-ops engineers used a user centric approach and followed an agile delivery process (as illustrated by Figure 1) in delivering the MedCheck application in multiple releases.  The key highlights of our approach include:
*	Focus on user experience through the creation of user personas, user testing and market surveys
*	Use of Kanban for managing the backlog for User Interface and User Experience (UI/UX) and DevOps teams
*	Use of Scrum to manage the backlog and delivery of the development team
*	Use of docker containers, docker hub and Jenkins to automate continuous integration and delivery

# Our Approach #
The following diagram (Figure 1) outlines Octo team’s approach in continuous delivering MedCheck application in multiple releases and sprints.

![Image of MedCheck](https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/images/approach.png?raw=true)

## Planning Phase ##

Upon the release of 18F solicitation for ADS, Octo assembled a project team consisting of experienced agile experts, developers, UI/UX designers and devops engineers.  The team matrix and roles are documented here (on Github – provide URL).  The team also engaged a group of Octo employees to serve as “users” during the development of the prototype.  The designated user team reviewed the FDA API and datasets, and crafted a problem statement for the project team (saved on GitHub – provide URL) that served as the primary scope for the project team.


## Agile Development Phase ##

### Sprint # 0 (Planning) ###
During this planning sprint, the project team spent some team analyzing the dataset to understand the API and data at a high level.  This analysis was key in guiding the architecture definition and development of initial user experience artifacts (such as personas).  A modern technology stack that is based on the principles of open standards and open architecture was selected and the devops team stood up the initial development and production environments.  

In addition, the team performed the following activities during this sprint:
* Reviewed the Problem Statement (saved on GitHub)
* Created a Product Vision (saved on GitHub)
* Began identifying high level features required to meet the needs of the users
* Decomposed the features into user and technical stories that could be completed in a single sprint
* Created a roadmap for delivery of features in multiple releases (saved on GitHub)
* Decided that the sprints are two hours long and documented the definitions of “done” and “ready” (artifacts on GitHub).

### Sprint # 1..N (Sprinting) ###
Octo team built the prototype iteratively using Agile methodologies as recommended by Digital Services play #4.  The development team used a Scrum based approach The UI/UX and DevOps teams tracked their work using Kanban to ensure they stay ahead of the development team ((pictures in GitHub). 

The team initially planned for 3 production releases of the prototype.  Features were planned for each Release, and individual stories for each feature were slotted in sprints within each Release.  Pictures of the features initially planned in the first 3 releases are saved on GitHub.  Applying Agile principles to embrace change and conduct frequent user reviews, the team adjusted course on several occasions:
* When the dataset couldn’t provide usable contextual information on medications, the team proposed an alternate set of features to our users and gained their agreement to change the requested product features.  
* The team conducted a product demonstration at the end of each release, and added/reprioritized features and user stories based on user feedback
* After the team completed all desired functionality in Release 3, the team planned and executed a fourth release to incorporate additional functionality requested by our users 

User stories were documented in a product backlog, with multiple versions reflecting the changing features identified by our users.  Each version of the backlog is stored on GitHub.  The team planned stories to be completed in each sprint, estimating each story using points, and reviewed completed stories with the Product Manager.  At the end of each sprint, the team conducted a sprint review and retrospective.  Documentation from each retrospective is saved on GitHub.

<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/Agile/Teamwork.JPG" width="300">
<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/Agile/Epic Feature Story Breakdown - Day 3.JPG" width="300">
<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/Agile/Kanban Board - End of Sprint 1.JPG" width="300">

#### User Experience Approach ####

In developing the prototype, Octo took a user centric approach in accordance with play #1 in the Digital Services Playbook. The information gathered from the users was used to continually refine the design of the prototype.  After every engagement with the user, UX and UI specialists continued to perform heuristic evaluations, and usability tests to refine the wireframes and final product.  Throughout the process, the UX/UI team worked very closely with the development team to ensure all changes to the user interface were implemented in the prototype.

The project team captured user needs in multiple ways:
* Met with the user to ensure that the problem statement was fully understood and to discuss desired features and the priority for all features
* Created user personas to capture the demographics and needs of different users of the prototype (saved on GitHub)
* Conducted release reviews to see demonstration of features added in each release
* Distributed an electronic survey desired features and expected usage of the prototype.  Analysis of the survey responses are saved on GitHub
Following play #2 in the Digital Services Playbook, the UX/UI team utilized User-Centered Design techniques to address the entire user experience:
* Generated Workflows to document how a user progresses through the prototype (saved on GitHub)
* Created a basic wireframe and prototype of the homepage to lay a foundation for the prototype (multiple versions are saved on GitHub)
* Created an information architecture to organize content on the site, as well as the data structure and enriched content, including visualizations and metadata

In addition, Octo team also evaluated ten basic heuristic principles to review the end-to-end user experience  (saved in GitHub) and conducted multiple rounds of usability tests of the prototype to ensure the final product is simple and intuitive to the users.

#### Technical Approach ####

Following play #8 in the Digital Services playbook, Octo implemented the prototype using modern and fully open technology stacks with a focus on mobile first and API first approaches.  Node.js and Loopback were selected as the primary stack for the service layer with Angular.js and Bootstrap serving as the front-end implementation frameworks. NG boilerplate and Loopback are used for scaffolding the application. The stack is primarily javascript based and data is exchanged using Restful services and json for an API first approach. (Link for Architecture Diagram)

Octo followed a Test Driven Development approach to develop the prototype by using Karma to write test cases for Angular code and a combination of Mocha, Supertest and Should to write test cases for the service layer.  As prescribed in play #10 in the Digital Services playbook, test cases are automatically executed when new code is checked into the repository.  Whenever code is saved in the GitHub repository, a Jenkins hook automatically initiates the testing process.  If all test cases pass successfully, the automated build and promotion process deploys the code to the integration server. The Octo DevOps team used Docker and Chef to code the infrastructure of the prototype to any environment as needed.  

Octo’s prototype is deployed within a Docker container available publicly on Docker Hub. Following Digital Services play #9, the test and production environments utilize AWS EC2, which is a flexible hosting environment with the ability to adapt and scale as needed. 

Octo team utilized Nagios to monitor the health of the infrastructure and the deployed prototype code.  Automatic email alerts are sent to the administrator when predetermined thresholds on response time, concurrent users, disk usage, or server load are exceeded.  Screenshots demonstrating real-time monitoring are saved in GitHub. 

![Technical Stack](https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/Agile/Teamwork.JPG?raw=true)

### Sprint # X (Hardening) ###

Pending


## Closeout Phase ##

Pending

# Alignment to Digital Services Playbook #

| DSP Play  | Team Activities  |
|---|---|
| 1. Understand What People Need  | Conducted user interviews to capture needs and created user personas, Conducted release reviews to validate features after each release, Conducted user testing in-person and through surveys  |
| 2. Address the whole experience, from start to finish  | Generated Workflows to document how a user progresses through the prototype, Created a basic wireframe and prototype of the homepage to lay a foundation for the prototype, Created an information architecture to organize content on the site  |
| 3. Make it simple and intuitive  | Evaluated ten basic heuristic principles to review the end to end user experience, Conducted multiple rounds usability test of the prototype   |
| 4. Build the services using agile and iterative practices  | Conducted development using Scrum while UI/UX and DevOps followed Kanban  |
| 5. Structure budgets and contracts to support delivery  | A budget based was determined based on the scope and team stuck to the budget for the initial set of releases.  The budget and scope were revised after additional time was allowed  |
| 6. Assign one leader and hold that person accountable  | Mr. Joe Truppo is assigned as the leader of the team and was held accountable for the overall delivery of the prototype  |
| 7 Bring in experienced teams  | Average experience level of the members across the team is 8 years with each member specializing in multiple roles  |
| 8 Choose a modern technology stack  | A modern technology stack the includes node.js, Loopback.js, Angular.js and Bootstrap was selected with a Restful backend  |
| 9 Deploy in a flexible hosting environment  | Prototype deployed in AWS, which is a flexible IaaS environment with the ability to adapt and scale as needed  |
| 10 Automate testing and deployments  | Testing is automated using  Karma for front end and Mocha, Should and Supertest for the service layer.  Test cases are automatically executed when new code is checked into the repository  |
| 11 Manage security and privacy through reusable processes  | Nagios is used to monitor the health of the infrastructure and prototype for continuous monitoring.  HTTPS/SSL is used to encrypt the communications between browser and server  |
| 12 Use data to drive decisions  | Data collected during each sprint and release (Points considered, Team Velocity, API Capabilities, etc.) is used to work with users and adjust course as needed  |
| 13 Default to Open  | Technical stack selected is open source and the prototype is developed suing open standards such as Restful services and Json.  |
