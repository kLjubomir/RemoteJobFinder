# Remote Job Finder Software Requirement Specification

## Filtering behaviour:
- [ ] As a remote job seeker I want to have a filtering tool so that I can filter out "on site" adverts from my remote job search
- [ ] As a remote job seeker I want to have a filtering tool so that I can filter out non english ads on LinkedIn
- [ ] As a remote job seeker I want to have a filtering tool so that I can filter ads that only include a keyword
- [ ] As a remote job seeker I want to have a filtering tool so that I can filter ads that exclude a keyword
- [ ] As a remote job seeker I want to have a file generated for ads that have a salary range included
- [ ] As a remote job seeker I want to have a file generated for ads that don't include a salary range

## Software behaviour:
- [ ] As a remote job filtering software I want to have a login function so that I can login to job seeking platforms that require it
- [ ] As a remote job filtering software I want to navigate to the page that lets me search for jobs so that I can search for jobs
- [ ] As a remote job filtering software I want to have CLI defined parameters so that I can dynamically adjust the filters: job title, description including, description not including


## Chronological Behaviour Driven Development Steps mapped to user stories

When possible use API to reduce the time complexity of operations

### - [ ] As a remote job filtering software I want to have a login function so that I can login to job seeking platforms that require it

**Scenario: Login to LinkedIn**
  **Given** job seeking platform requires login to query ads
  **When** login to LinkedIn completed
  **Then** home page is displayed

### - [ ] As a remote job filtering software I want to navigate to the page that lets me search for jobs so that I can search for jobs

**Scenario: Access search in LinkedIn**
  **Given** logged in to LinkedIn
  **When** navigated to /jobs/
  **Then** job searching functionality is displayed

**Scenario: Access search in Indeed**
  **Given** navigated to indeed
  **Then** job search displayed 

### - [ ] As a remote job seeker I want to have a filtering tool so that I can filter out non english ads on LinkedIn

**Scenario: Disregard non english adverts**
  **Given** Advert description is fetched
  **When** Random words from advert description are taken
  **Then** 80% of those words should be detected as english using the Compact Language Detector (CLD2) library from Google.

### - [ ] As a remote job seeker I want to have a filtering tool so that I can filter out "on site" adverts from my remote job search

**Scenario: Disregard false remote adverts**
  **Given** Advert description is fetched
  **When** description text include words like "on site", "onsite", "U.S. Citizen" etc..
  **Then** the adverts are not truly remote adverts.

### - [ ] As a remote job seeker I want to have a filtering tool so that I can filter ads that only include a keyword

**Scenario: Include only jobs with keyword in description**
  **Given** Advert description is fetched
  **When** description text includes an end user described inclusion keyword
  **Then** the adverts are filtered as matching

### - [ ] As a remote job seeker I want to have a filtering tool so that I can filter ads that exclude a keyword

**Scenario: Exclude jobs with keyword in description**
  **Given** Advert description is fetched
  **When** description text includes an end user described exclusion keyword
  **Then** the adverts are filtered as non-matching

### - [ ] As a remote job seeker I want to have a file generated for ads that have a salary range included

**Scenario: Store advert URL in advertHasSalaryRange.json**
  **Given** Advert description from LinkedIn is fetched
  **When** The filters set by end user all return true
  **And** description text includes keywords indicating salary disclosure
  **Then** the advert URLS are stored in advertHasSalaryRange.json

_salary indicator: words like "per hour" "/h" "€" "$" "eur" "dollar" "anual", "a number between 5 digits separated by dot or comma (utils)", "number between 6 digits separated by dot or comma (utils)"_


### - [ ] As a remote job seeker I want to have a file generated for ads that don't include a salary range

**Scenario: Store advert URL in advertWithoutSalaryRange.json**
  **Given** Advert description from LinkedIn is fetched
  **When** The filters set by end user all return true
  **And** description text doesn't include keywords indicating salary disclosure
  **Then** the advert URLS are stored in advertWithoutSalaryRange.json

### - [ ] As a remote job filtering software I want to have CLI defined parameters so that I can dynamically adjust the filters: job title, description including, description excluding

use dotenv .env with defaults that would be overwritten when starting the suite over CLI process.env.jobTitle, process.env.descIncludes, process.env.descExcludes, null skip.
