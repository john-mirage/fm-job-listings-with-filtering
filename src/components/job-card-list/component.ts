import jobApi from "@api/job-api";
import JobCard from "@components/job-card";
import classes from "./component.module.css";

class JobCardList extends HTMLElement {
  #initialMount = true;
  #listElement = document.createElement("ul");
  #jobCardElement = <JobCard>document.createElement("li", { is: "job-card" });
  #jobs?: AppData.Job[];
  #jobFilters?: string[];
  #jobCardElements?: JobCard[];

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobCardList__list"]);
  }

  get jobCardElements(): JobCard[] | undefined {
    return this.#jobCardElements;
  }

  set jobCardElements(newJobCardElements: JobCard[] | undefined) {
    this.#jobCardElements = newJobCardElements;
    if (this.jobCardElements) {
      this.displayJobCards();
    } else {
      this.#listElement.replaceChildren();
    }
  }

  get jobs(): AppData.Job[] | undefined {
    return this.#jobs;
  }

  set jobs(newJobs: AppData.Job[] | undefined) {
    this.#jobs = newJobs;
    if (this.jobs && this.jobs.length > 0) {
      this.jobCardElements = this.jobs.map((job) => {
        const jobCardElement = <JobCard>this.#jobCardElement.cloneNode(true);
        jobCardElement.job = job;
        return jobCardElement;
      });
    } else {
      this.jobCardElements = undefined;
    }
  }

  get jobFilters(): string[] | undefined {
    return this.#jobFilters;
  }

  set jobFilters(newJobFilters: string[] | undefined) {
    this.#jobFilters = newJobFilters;
    this.displayJobCards();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobCardList"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
    this.jobs = jobApi.jobs;
    this.jobFilters = jobApi.jobFilters;
    jobApi.subscribe("jobs", this);
    jobApi.subscribe("jobFilters", this);
  }

  disconnectedCallback() {
    jobApi.unsubscribe("jobs", this);
    jobApi.unsubscribe("jobFilters", this);
  }

  checkJobCard(jobCardElement: JobCard, jobFilters: string[]) {
    const tags = [
      jobCardElement.job.role,
      jobCardElement.job.level,
      ...jobCardElement.job.languages,
      ...jobCardElement.job.tools
    ];
    if (jobCardElement.job.new) tags.push("New");
    if (jobCardElement.job.featured) tags.push("Featured");
    return jobFilters.every((jobFilter) => tags.includes(jobFilter));
  }

  displayJobCards() {
    if (window.scrollY > 0) window.scroll(0, 0);
    const jobCardElements = this.jobCardElements;
    const jobFilters = this.jobFilters;
    if (jobCardElements && jobFilters) {
      let previousJobCardElement: JobCard | undefined;
      jobCardElements.forEach((jobCardElement) => {
        const jobCardElementIsValid = this.checkJobCard(jobCardElement, jobFilters);
        if (jobCardElementIsValid) {
          if (!jobCardElement.isConnected) {
            if (previousJobCardElement) {
              previousJobCardElement.after(jobCardElement);
            } else {
              this.#listElement.prepend(jobCardElement);
            }
          }
          previousJobCardElement = jobCardElement;
        } else if (jobCardElement.isConnected) {
          jobCardElement.remove();
        }
      });
    }
  }
}

export default JobCardList;