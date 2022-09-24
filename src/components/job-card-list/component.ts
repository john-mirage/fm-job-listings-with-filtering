import JobCard from "@components/job-card";
import classes from "./component.module.css";

class JobCardList extends HTMLElement {
  #initialMount = true;
  #jobList?: AppData.Job[];
  #listElement = document.createElement("ul");

  constructor() {
    super();
    this.#listElement.classList.add(classes.list);
  }

  get jobList(): AppData.Job[] | undefined {
    return this.#jobList;
  }

  set jobList(newJobList: AppData.Job[] | undefined) {
    this.#jobList = newJobList;
    this.displayJobCards();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes.host);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
  }

  displayJobCards() {
    this.innerHTML = "";
    this.jobList.forEach((job) => {
      const jobCardElement = this.jobCards.find((jobCard) => jobCard.job.id === job.id);
      if (jobCardElement) {
        this.append(jobCardElement);
      } else {
        const newJobCardElement = this.createJobCard(job);
        this.jobCards = [...this.jobCards, newJobCardElement];
        this.append(newJobCardElement);
      }
    });
  }

  createJobCard(job: AppData.Job) {
    const jobCard = <JobCard>document.createElement("article", { is: "job-card" });
    jobCard.job = job;
    return jobCard;
  }
}

export default JobCardList;