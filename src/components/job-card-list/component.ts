import Job from "@interfaces/job";
import JobCardInterface from "@interfaces/job-card";

class JobCardList extends HTMLDivElement {
  _jobList: Job[] | false;
  initialCall: boolean;
  jobCards: JobCardInterface[];

  constructor() {
    super();
    this._jobList = false;
    this.initialCall = true;
    this.jobCards = [];
  }

  get jobList() {
    if (this._jobList) {
      return this._jobList;
    } else {
      throw new Error("The job card list is not defined");
    }
  }

  set jobList(jobList: Job[]) {
    this._jobList = jobList;
    this.displayJobCards();
  }

  connectedCallback() {
    if (this.initialCall) {
      this.classList.add("card-list");
      this.initialCall = false;
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

  createJobCard(job: Job) {
    const jobCard = <JobCardInterface>document.createElement("article", { is: "job-card" });
    jobCard.job = job;
    return jobCard;
  }
}

export default JobCardList;