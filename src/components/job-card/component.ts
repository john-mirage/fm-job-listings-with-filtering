class JobCard extends HTMLElement {
  #initialMount = true;
  #job?: AppData.Job;

  constructor() {
    super();
  }

  get job(): AppData.Job | undefined {
    return this.#job;
  }

  set job(newJob: AppData.Job | undefined) {
    this.#job = newJob;
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add("card");
      this.#initialMount = false;
    }
  }

  disconnectedCallback() {

  }

  handleTag(event: Event) {
    const filter = (<HTMLButtonElement>event.currentTarget).dataset.name;
    const customEvent = new CustomEvent("add-job-filter", { detail: { filter }, bubbles: true });
    this.dispatchEvent(customEvent);
  }

  createBadge(name: string) {
    const badgeElement = document.createElement("button");
    badgeElement.classList.add("card__badge", `card__badge--${name}`);
    badgeElement.textContent = name === "new" ? "new!" : name;
    return badgeElement;
  }

  createTag(name: string) {
    const tagElement = document.createElement("button");
    tagElement.classList.add("card__tag");
    tagElement.textContent = name;
    tagElement.dataset.name = name;
    return tagElement;
  }
}

export default JobCard;