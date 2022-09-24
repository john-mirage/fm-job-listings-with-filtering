import JobCardList from "@components/job-card-list";
import JobFilterList from "@components/job-filter-list";

class JobApp extends HTMLElement {
  #initialMount = true;
  webCardList: JobCardList;
  webFilterList: JobFilterList;

  constructor() {
    super();
    this.webCardList = <JobCardList>document.createElement("div", { is: "job-card-list" });
    this.webFilterList = <JobFilterList>document.createElement("div", { is: "job-filter-list" });
  }

  get jobList() {
    if (this._jobList) {
      return this._jobList;
    } else {
      throw new Error("The job list is not defined");
    }
  }

  get jobFilterList() {
    if (this._jobFilterList) {
      return this._jobFilterList;
    } else {
      throw new Error("The job filter list is not defined");
    }
  }

  set jobList(jobList) {
    this._jobList = jobList;
    this.jobCardListElement.jobList = jobList;
  }

  set jobFilterList(jobFilterList) {
    this._jobFilterList = jobFilterList;
    this.jobFilterListElement.jobFilterList = jobFilterList;
    this.handleJobFilterListVisibility();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add("page__container");
      this.append(this.titleElement, this.jobCardListElement);
      this.#initialMount = false;
    }
    this.addEventListener("add-job-filter", this.addJobFilter);
    this.addEventListener("delete-job-filter", this.deleteJobFilter);
    this.addEventListener("clear-job-filter-list", this.clearJobFilterList);
  }

  disconnectedCallback() {
    this.removeEventListener("add-job-filter", this.addJobFilter);
    this.removeEventListener("delete-job-filter", this.deleteJobFilter);
    this.removeEventListener("clear-job-filter-list", this.clearJobFilterList);
  }

  addJobFilter(event: Event) {
    const filterToAdd = (<CustomEvent>event).detail.filter;
    if (!this.jobFilterList.includes(filterToAdd)) {
      this.jobFilterList = [...this.jobFilterList, filterToAdd];
      this.filterJobList();
      this.scrollToTheTop();
    }
  }

  deleteJobFilter(event: Event) {
    const filterToDelete = (<CustomEvent>event).detail.filter;
    if (this.jobFilterList.includes(filterToDelete)) {
      this.jobFilterList = this.jobFilterList.filter((filter) => filter !== filterToDelete);
      this.filterJobList();
      this.scrollToTheTop();
    }
  }

  clearJobFilterList() {
    this.jobFilterList = [];
    this.filterJobList();
    this.scrollToTheTop();
  }

  scrollToTheTop() {
    if (window.scrollY > 0) {
      window.scroll(0, 0);
    }
  }

  filterJobList() {
    if (this.jobFilterList.length > 0) {
      this.jobCardListElement.jobList = this.jobList.filter((job) => {
        const tags = [job.role, job.level, ...job.languages, ...job.tools];
        return this.jobFilterList.every((jobFilter) => tags.includes(jobFilter));
      });
    } else {
      this.jobCardListElement.jobList = this.jobList;
    }
  }

  handleJobFilterListVisibility() {
    if (this.jobFilterList.length > 0 && !this.jobFilterListElement.isConnected) {
      this.jobCardListElement.before(this.jobFilterListElement);
    } else if (this.jobFilterList.length <= 0 && this.jobFilterListElement.isConnected) {
      this.removeChild(this.jobFilterListElement);
    }
  }
}

export default JobApp;