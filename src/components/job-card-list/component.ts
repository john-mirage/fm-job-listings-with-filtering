import JobCard from "@components/job-card";
import classes from "./component.module.css";

class JobCardList extends HTMLElement {
  #initialMount = true;
  #jobs: Map<number, AppData.Job> = new Map();
  #listElement = document.createElement("ul");
  #jobCardElement = <JobCard>document.createElement("li", { is: "job-card" });
  #jobCardElementCache: Map<number, JobCard> = new Map();

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobCardList__list"]);
  }

  get jobs(): Map<number, AppData.Job> {
    return this.#jobs;
  }

  set jobs(newJobs: Map<number, AppData.Job>) {
    this.#jobs = newJobs;
    if (this.#jobs.size > 0) {
      this.displayJobCards();
    } else {
      if (this.#listElement.children.length > 0) this.#listElement.replaceChildren();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobCardList"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
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

  displayJobCards() {
    const jobCards = <JobCard[]>Array.from(this.#listElement.children);
    jobCards.forEach((jobCard) => {
      const jobHasNotBeenFound = !this.jobs.has(jobCard.job.id);
      if (jobHasNotBeenFound) jobCard.remove();
    });

    [...this.jobs.values()].forEach((job, index) => {
      const jobCard = <JobCard | null>this.#listElement.querySelector(`[data-id="${job.id}"]`);
      if (!jobCard) {
        const newJobCard = this.getJobCard(job);
        this.insertJobCard(newJobCard, index);
      }
    });
  }
}

export default JobCardList;