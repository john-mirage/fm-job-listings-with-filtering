import JobTag from "@components/job-tag/component";
import classes from "./component.module.css";

class JobTagList extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #jobTags?: string[];
  #listElement = document.createElement("ul");
  #jobTagElement = <JobTag>document.createElement("li", { is: "job-tag" });

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobCardTags__list"]);
  }

  get jobTags(): string[] | undefined {
    return this.#jobTags;
  }

  set jobTags(newJobTags: string[] | undefined) {
    this.#jobTags = newJobTags;
    if (this.#jobTags) {
      this.#listElement.replaceChildren(
        ...this.#jobTags.map((jobTag) => {
          const jobTagElement = <JobTag>this.#jobTagElement.cloneNode(true);
          jobTagElement.jobTag = jobTag;
          return jobTagElement;
        })
      );
    } else {
      this.#listElement.replaceChildren();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobCardTags"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobTags");
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

export default JobTagList;