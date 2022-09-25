import jobApi from "@api/job-api";
import JobCard from "@components/job-card";
import classes from "./component.module.css";

class JobCardList extends HTMLElement {
  #initialMount = true;
  #listElement = document.createElement("ul");
  #jobCardElement = <JobCard>document.createElement("li", { is: "job-card" });
  #jobCardElementCache: Map<number, JobCard> = new Map();
  #jobs?: AppData.Job[];
  #jobFilters?: string[];

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobCardList__list"]);
  }

  get jobs(): AppData.Job[] | undefined {
    return this.#jobs;
  }

  set jobs(newJobs: AppData.Job[] | undefined) {
    this.#jobs = newJobs;
    this.displayJobCards();
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

  insertJobCard(jobCard: JobCard, index: number) {
    if (index <= 0) {
      this.#listElement.prepend(jobCard);
    } else {
      this.#listElement.children[index - 1].after(jobCard);
    }
  }

  getJobCard(job: AppData.Job) {
    if (this.#jobCardElementCache.has(job.id)) {
      return <JobCard>this.#jobCardElementCache.get(job.id);
    } else {
      const jobCardElement = <JobCard>this.#jobCardElement.cloneNode(true);
      jobCardElement.job = job;
      this.#jobCardElementCache.set(job.id, jobCardElement);
      return jobCardElement;
    }
  }

  handleJobCardsDeletion(jobs: AppData.Job[]) {
    const jobCards = <JobCard[]>Array.from(this.#listElement.children);
    jobCards.forEach((jobCard) => {
      const jobHasNotBeenFound = !jobs.find((job) => job.id === jobCard.job.id);
      if (jobHasNotBeenFound) jobCard.remove();
    });
  }

  handleJobCardsAddition(jobs: AppData.Job[]) {
    jobs.forEach((job, index) => {
      const jobCard = <JobCard | null>this.#listElement.children.namedItem(String(job.id));
      if (!jobCard) {
        const newJobCard = this.getJobCard(job);
        this.insertJobCard(newJobCard, index);
      }
    });
  }

  handleJobCardsClear() {
    if (this.#listElement.children.length > 0) {
      this.#listElement.replaceChildren();
    }
  }

  displayJobCards() {
    if (window.scrollY > 0) window.scroll(0, 0);
    const jobs = this.jobs;
    const jobFilters = this.jobFilters;
    if (jobs && jobFilters) {
      const filteredJobs = jobs.filter((job) => {
        const tags = [job.role, job.level, ...job.languages, ...job.tools];
        if (job.new) tags.push("new!");
        if (job.featured) tags.push("featured");
        return jobFilters.every((jobFilter) => tags.includes(jobFilter));
      });
      if (filteredJobs.length > 0) {
        this.handleJobCardsDeletion(filteredJobs);
        this.handleJobCardsAddition(filteredJobs);
      } else {
        this.handleJobCardsClear();
      }
    } else {
      this.handleJobCardsClear();
    }
  }
}

export default JobCardList;