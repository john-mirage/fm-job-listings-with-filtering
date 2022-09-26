import jobApi from "@api/job-api";
import JobTag from "@components/job-tag/component";
import classes from "./component.module.css";

class JobTagList extends HTMLElement {
  #initialMount = true;
  #jobFilters?: string[];
  #jobTags?: string[];
  #listElement = document.createElement("ul");
  #jobTagElement = <JobTag>document.createElement("li", { is: "job-tag" });

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobCardTags__list"]);
  }

  get jobFilters(): string[] | undefined {
    return this.#jobFilters;
  }

  set jobFilters(newJobFilters: string[] | undefined) {
    this.#jobFilters = newJobFilters;
    this.handleJobTagStates();
  }

  get jobTags(): string[] | undefined {
    return this.#jobTags;
  }

  set jobTags(newJobTags: string[] | undefined) {
    this.#jobTags = newJobTags;
    this.handleJobTags();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobCardTags"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
    this.jobFilters = jobApi.jobFilters;
    jobApi.subscribe("jobFilters", this);
  }

  disconnectedCallback() {
    jobApi.unsubscribe("jobFilters", this);
  }

  handleJobTagStates() {
    const jobFilters = this.jobFilters;
    const jobTags = this.jobTags;
    if (jobFilters && jobTags) {
      const jobTagElements = <JobTag[]>Array.from(this.#listElement.children);
      jobTagElements.forEach((jobTagElement) => {
        if (jobTagElement.jobTag && jobFilters.includes(jobTagElement.jobTag)) {
          jobTagElement.setAttribute("disabled", "");
        } else if (jobTagElement.hasAttribute("disabled")) {
          jobTagElement.removeAttribute("disabled");
        }
      });
    }
  }

  handleJobTags() {
    const jobTags = this.jobTags;
    if (jobTags) {
      this.#listElement.replaceChildren(
        ...jobTags.map((jobTag) => {
          const jobTagElement = <JobTag>this.#jobTagElement.cloneNode(true);
          jobTagElement.jobTag = jobTag;
          return jobTagElement;
        })
      );
    } else {
      this.#listElement.replaceChildren();
    }
  }
}

export default JobTagList;