# Remote Job Finder

Remote Job Finder is a **test automation framework** leveraged to automatically refine search results on the top job seeking platforms like LinkedIn and Indeed.

Even though there are Behavior Driven Development styled specifications alongside user stories in specifications.md, the framework is not using cucumber or any similar BDD wrapper in order to avoid the pitfall of having to execute a setup for each BDD statement, as they need to be able to work independently, thus ending up in code redundance. The BDD used in specifications.md function as development orientation for the framework, these are intentionally not written as end to end BDD tests.

The credentials for login originate from userCredentials.json which are gitignored