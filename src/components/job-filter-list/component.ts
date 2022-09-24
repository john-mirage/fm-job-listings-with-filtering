import classes from "./component.module.css";

class JobFilterList extends HTMLElement {
  #initialMount = true;
  #jobFilterList: string[] | undefined;
  #listElement = document.createElement("ul");
  #buttonElement = document.createElement("button");

  constructor() {
    super();
    this.#listElement.classList.add(classes.list);
    this.#buttonElement.classList.add(classes.button);
  }

  get jobFilterList(): string[] | undefined {
    return this.#jobFilterList;
  }

  set jobFilterList(newJobFilterList: string[] | undefined) {
    this.#jobFilterList = newJobFilterList;
    this.displayJobFilters();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes.host);
      this.append(this.#listElement, this.#buttonElement);
      this.#initialMount = false;
    }
    this.#buttonElement.addEventListener("click", this.handleClearButton);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleClearButton);
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