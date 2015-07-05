

<p align="center">
  <img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/images/logo.png?raw=true">
</p>

# Introduction #
MedCheck is a responsive web application developed by Octo Consulting Group in response to the solicitation released by 18F for Agile Delivery Services (ADS).  MedCheck leverages the APIs offered by fda.gov and provides analysis of adverse events and recalls of various drugs.  Octo’s team used a user centric approach and followed an agile delivery process in delivering the MedCheck application in multiple releases.  The key highlights of our approach include:
*	Focus on user experience through the creation of user personas, user testing and market surveys
*	Use of Kanban for managing the backlog for User Interface and User Experience (UI/UX) and DevOps teams
*	Use of Scrum to manage the backlog and delivery of the development team
*	Use of docker containers, docker hub and Jenkins to automate continuous integration and delivery

# Our Approach #
The following diagram outlines Octo team’s overall approach for responding to the solicitation and for continuous delivery of MedCheck application in multiple releases and sprints.

![Image of MedCheck](https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/images/approach.png?raw=true)

## Planning Phase ##

Upon the release of 18F solicitation for ADS, Octo assembled a project team consisting of experienced agile experts, developers, user experience designers (UX), visual designers (UI), analysts and devops engineers.  The team also engaged a group of Octo employees to serve as “users” during the development of the prototype.  The designated user team reviewed the FDA API and crafted a problem statement for the project team (Link to Problem) that served as the primary scope for the project team.


## Agile Development Phase ##

### Sprint # 0 (Planning) ###
During this sprint, the project team reviewed the problem statement and analyzed the dataset to understand the API and data at a high level.  This analysis was key in guiding the architecture definition and development of initial user experience artifacts (such as personas).  An open, modern technology stack was selected and the devops team stood up the initial development, integration and production environments.  

In addition, the team performed the following activities during this sprint:
* Began identifying high level features required to meet the needs of the users
* Decomposed the features into user and technical stories that could be completed in a single sprint
* Created a product vision and roadmap for delivery of features in multiple releases (Link)

### Sprint # 1..N (Sprinting) ###
Octo team built the prototype iteratively using an Agile approach.  The development team used a Scrum based approach where as the UI/UX and DevOps teams tracked their work using Kanban to ensure they stay ahead of the development team. 

The team initially planned for 3 production releases of the prototype.  Features were planned for each Release, and individual stories for each feature were slotted in sprints within each Release (Links to pictures).  The team made adjustments to the product based on user feedback after each demo to the users.  Team also made adjustments to the product as needed during the implementation by collaborating with the users closely and worked within the constraints offered by FDA API.  For example, team proposed alternate set of features to the users when FDA API could not provide some of the data needed for a specific feature requested by the users.

User stories were documented in a product backlog, with multiple versions reflecting the changing features identified by our users (Link to backlog).  The team planned stories to be completed in each sprint, estimating each story using points, and reviewed completed stories with the Product Manager.  At the end of each sprint, a product demo was conducted, feedback collected, product deployed to production and the team conducted a sprint review and retrospective (Link to retrospectives).  All the user and design documentation necessary for the execution of the sprint was constantly updated.

<p align="center">
|<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/Agile/Teamwork.JPG" width="250"/>
|<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/Agile/Epic Feature Story Breakdown - Day 3.JPG" width="250"/>
|<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/Agile/Kanban Board - End of Sprint 1.JPG" width="250"/>|
</p>

#### User Experience Approach ####

The information gathered from users was used to continuously refine the the prototype.  After every interation with the user, UX and UI specialists performed heuristic evaluations, and conducted usability tests to refine the wireframes and final product.  Throughout the process, the UX/UI team worked very closely with the development team to ensure all changes to the user interface were implemented in the prototype.

The project team captured user feedback in several ways and produced multiple UX/UI artifacts to ensure the prototype is developed in alignment with user needs:
* Met with the user to ensure that the problem statement was fully understood and to discuss desired features and the priority for all features
* Created user personas to capture the demographics and needs of different users of the prototype (Link to personas)
* Distributed an electronic survey desired features and expected usage of the prototype (Link to survey results).  
* Generated Workflows to document how a user progresses through the prototype (Link to workflows)
* Created a basic wireframe and prototype of the homepage to lay a foundation for the prototype (Link to wireframes)
* Created an information architecture to organize site content and enriched content using visualizations and metadata

#### Technical Approach ####

Octo implemented the prototype using modern and fully open technology stacks with a focus on mobile first and API first approaches.  Node.js and Loopback frameworks were selected as the primary stack for the service layer with Angular.js and Bootstrap serving as the front-end frameworks. Angular.js based front end exchanged data with Loopback based service layer using secure Restful services with json as the primary data exchange format (Link for Architecture Diagram).

Karma test framework was used to write test cases for front end and a combination of Mocha, Supertest and Should were used to write test cases for the service layer.  All test cases are automatically executed when new code is checked into the repository via a Jenkins hook for GitHub.  Once all test cases pass successfully, the Jenkins based automated build and promotion script deploys the code to the integration server. The Octo DevOps team used Docker and Chef to code the infrastructure, and the prototype is deployed within a Docker container available publicly on Docker Hub. The integration and production environments are deployed on Amazon Web Services (AWS) EC2 instances.

Nagios is used to monitor the health of the infrastructure and the deployed prototype code.  Automatic email alerts are sent to the administrator when predetermined thresholds on response time, concurrent users, disk usage, or server load are exceeded. (Links to screenshots) 

<p align="center">
<img src="https://github.com/OctoConsulting/18f-ads-pool-3/blob/master/docs/images/techstack.png?raw=true">
</p>

### Sprint # X (Hardening) ###

During this sprint, the team performed final field testing to ensure the application met the needs of the users and conducted usability testing with a broader Octo employee base.  The team also conducted final security testing to ensure all the security and accessibility needs are met, and made the necessary adjustments.  DevOps team developed final deployment documentation.

## Closeout Phase ##

During this phase, the team closed out the execution of the prototype by completing the documentation necessary (Readme.md, pricing, etc.) for submitting the solicitation response to the government.

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
