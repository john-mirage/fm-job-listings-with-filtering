import JobFilterInterface from "@interfaces/job-filter";

class JobFilterList extends HTMLDivElement {
  _jobFilterList: string[] | false;
  initialCall: boolean;
  jobFilters: JobFilterInterface[];
  tagsSectionElement: HTMLDivElement;
  buttonSectionElement: HTMLDivElement;
  buttonElement: HTMLButtonElement;

  constructor() {
    super();
    this._jobFilterList = false;
    this.initialCall = true;
    this.jobFilters = [];
    this.tagsSectionElement = document.createElement("div");
    this.buttonSectionElement = document.createElement("div");
    this.buttonElement = document.createElement("button");
    this.tagsSectionElement.classList.add("filter-list__section", "filter-list__section--tags");
    this.buttonSectionElement.classList.add("filter-list__section", "filter-list__section--button");
    this.buttonElement.classList.add("filter-list__button");
    this.buttonElement.textContent = "Clear";
  }

  get jobFilterList() {
    if (this._jobFilterList) {
      return this._jobFilterList;
    } else {
      throw new Error("The job filter list is not defined");
    }
  }

  set jobFilterList(jobFilterList: string[]) {
    this._jobFilterList = jobFilterList;
    this.displayJobFilters();
  }

  connectedCallback() {
    if (this.initialCall) {
      this.classList.add("filter-list");
      this.buttonSectionElement.append(this.buttonElement);
      this.append(this.tagsSectionElement, this.buttonSectionElement);
      this.initialCall = false;
    }
    this.buttonElement.addEventListener("click", this.handleClearButton);
  }

  disconnectedCallback() {
    this.buttonElement.removeEventListener("click", this.handleClearButton);
  }

  handleClearButton() {
    const customEvent = new CustomEvent("clear-job-filter-list", { bubbles: true });
    this.dispatchEvent(customEvent);
  }

  displayJobFilters() {
    this.tagsSectionElement.innerHTML = "";
    this.jobFilterList.forEach((jobFilter) => {
      const jobFilterElement = this.jobFilters.find((jobFilterElement) => jobFilterElement.jobFilter === jobFilter);
      if (jobFilterElement) {
        this.tagsSectionElement.append(jobFilterElement);
      } else {
        const newJobFilterElement = this.createJobFilter(jobFilter);
        this.jobFilters = [...this.jobFilters, newJobFilterElement];
        this.tagsSectionElement.append(newJobFilterElement);
      }
    });
  }

  createJobFilter(jobFilter: string) {
    const jobFilterElement = <JobFilterInterface>document.createElement("div", { is: "job-filter" });
    jobFilterElement.jobFilter = jobFilter;
    return jobFilterElement;
  }
}

export default JobFilterList;