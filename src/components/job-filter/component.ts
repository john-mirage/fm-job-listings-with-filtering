class JobFilter extends HTMLDivElement {
  _jobFilter: string | false;
  initialCall: boolean;
  fragment: DocumentFragment;
  labelElement: HTMLSpanElement;
  buttonElement: HTMLButtonElement;

  constructor() {
    super();
    this._jobFilter = false;
    this.initialCall = true;
    const template = <HTMLTemplateElement>document.getElementById("template-filter");
    this.fragment = <DocumentFragment>template.content.cloneNode(true);
    this.labelElement = <HTMLSpanElement>this.fragment.querySelector('[data-name="tag"]');
    this.buttonElement = <HTMLButtonElement>this.fragment.querySelector('[data-name="button"]');
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
  }

  get jobFilter() {
    if (this._jobFilter) {
      return this._jobFilter;
    } else {
      throw new Error("The job filter is not defined");
    }
  }

  set jobFilter(jobFilter: string) {
    this._jobFilter = jobFilter;
  }

  connectedCallback() {
    if (this.initialCall) {
      this.classList.add("filter");
      this.labelElement.textContent = this.jobFilter;
      this.buttonElement.dataset.name = this.jobFilter;
      this.append(this.fragment);
      this.initialCall = false;
    }
    this.buttonElement.addEventListener("click", this.handleDeleteButton);
  }

  disconnectedCallback() {
    this.buttonElement.removeEventListener("click", this.handleDeleteButton);
  }

  handleDeleteButton(event: Event) {
    const filter = (<HTMLButtonElement>event.currentTarget).dataset.name;
    const customEvent = new CustomEvent("delete-job-filter", { detail: { filter }, bubbles: true });
    this.dispatchEvent(customEvent);
  }
}

export default JobFilter;