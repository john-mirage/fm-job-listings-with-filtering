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
    this.handleJobCardElements();
  }

  get jobs(): AppData.Job[] | undefined {
    return this.#jobs;
  }

  set jobs(newJobs: AppData.Job[] | undefined) {
    this.#jobs = newJobs;
    this.handleJobs();
  }

  get jobFilters(): string[] | undefined {
    return this.#jobFilters;
  }

  set jobFilters(newJobFilters: string[] | undefined) {
    this.#jobFilters = newJobFilters;
    this.handleJobFilters();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobCardList"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
    this.jobFilters = jobApi.jobFilters;
    this.jobs = jobApi.jobs;
    jobApi.subscribe("jobs", this);
    jobApi.subscribe("jobFilters", this);
  }

  disconnectedCallback() {
    jobApi.unsubscribe("jobs", this);
    jobApi.unsubscribe("jobFilters", this);
  }

  scrollWindowToTheTop() {
    if (window.scrollY > 0) {
      window.scroll(0, 0)
    };
  }

  checkJobCardElement(jobCardElement: JobCard, jobFilters: string[]) {
    if (jobCardElement.job) {
      const tags = [
        jobCardElement.job.role,
        jobCardElement.job.level,
        ...jobCardElement.job.languages,
        ...jobCardElement.job.tools
      ];
      if (jobCardElement.job.new) tags.push("New");
      if (jobCardElement.job.featured) tags.push("Featured");
      return jobFilters.every((jobFilter) => tags.includes(jobFilter));
    } else {
      throw new Error("The job card element has no job property");
    }
  }

  insertJobCardElement(jobCardElement: JobCard, previousJobCardElement: JobCard | undefined) {
    if (!jobCardElement.isConnected) {
      if (previousJobCardElement) {
        previousJobCardElement.after(jobCardElement);
      } else {
        this.#listElement.prepend(jobCardElement);
      }
    }
  }

  handleJobCardElements() {
    const jobFilters = this.jobFilters;
    const jobCardElements = this.jobCardElements;
    if (jobFilters && jobCardElements && (jobCardElements.length > 0)) {
      this.scrollWindowToTheTop();
      if (jobFilters.length > 0) {
        this.handleJobFilters();
      } else {
        this.#listElement.replaceChildren(...jobCardElements);
      }
    } else {
      this.#listElement.replaceChildren();
    }
  }

  handleJobs() {
    const jobs = this.jobs;
    if (jobs && jobs.length > 0) {
      this.jobCardElements = jobs.map((job) => {
        const jobCardElement = <JobCard>this.#jobCardElement.cloneNode(true);
        jobCardElement.job = job;
        return jobCardElement;
      });
    } else {
      this.jobCardElements = undefined;
    }
  }

  handleJobFilters() {
    const jobFilters = this.jobFilters;
    const jobCardElements = this.jobCardElements;
    if (jobCardElements && (jobCardElements.length > 0) && jobFilters) {
      this.scrollWindowToTheTop();
      let previousJobCardElement: JobCard | undefined;
      jobCardElements.forEach((jobCardElement) => {
        if (jobFilters.length > 0) {
          const jobCardElementIsValid = this.checkJobCardElement(jobCardElement, jobFilters);
          if (jobCardElementIsValid) {
            this.insertJobCardElement(jobCardElement, previousJobCardElement);
            previousJobCardElement = jobCardElement;
          } else if (jobCardElement.isConnected) {
            jobCardElement.remove();
          }
        } else {
          this.insertJobCardElement(jobCardElement, previousJobCardElement);
          previousJobCardElement = jobCardElement;
        }
      });
    }
  }
}

export default JobCardList;