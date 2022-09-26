import jobs from "@data/jobs.json";

class JobApi {
  [property: string]: any;
  #jobs: Map<number, AppData.Job> = new Map();
  #jobFilters: Set<string> = new Set();
  #subscribers: Map<string, any> = new Map();

  constructor(jobs: AppData.Job[]) {
    jobs.forEach((job) => {
      this.#jobs.set(job.id, job);
    });
  }

  get jobs() {
    return [...this.#jobs.values()];
  }

  get jobFilters() {
    return [...this.#jobFilters];
  }

  addJobFilter(filter: string) {
    this.#jobFilters.add(filter);
    this.dispatch("jobFilters");
  }

  deleteJobFilter(filter: string) {
    this.#jobFilters.delete(filter);
    this.dispatch("jobFilters");
  }

  clearJobFilter() {
    this.#jobFilters.clear();
    this.dispatch("jobFilters");
  }

  dispatch(propertyName: string) {
    if (!!this[propertyName]) {
      const propertySubscribers = this.#subscribers.get(propertyName);
      propertySubscribers.forEach((propertySubscriber: any) => {
        propertySubscriber[propertyName] = this[propertyName];
      });
    } else {
      throw new Error("The API do not contain the property name");
    }
  }

  subscribe(propertyName: string, element: any) {
    if (!!this[propertyName]) {
      if (this.#subscribers.has(propertyName)) {
        let propertySubscribers = this.#subscribers.get(propertyName);
        propertySubscribers.push(element);
        this.#subscribers.set(propertyName, propertySubscribers);
      } else {
        this.#subscribers.set(propertyName, [element]);
      }
    } else {
      throw new Error("The API do not contain the property name");
    }
  }

  unsubscribe(propertyName: string, element: any) {
    if (!!this[propertyName]) {
      if (this.#subscribers.has(propertyName)) {
        const propertySubscribers = this.#subscribers.get(propertyName);
        const filteredPropertySubscribers = propertySubscribers.filter((propertySubscriber: any) => propertySubscriber !== element);
        this.#subscribers.set(propertyName, filteredPropertySubscribers);
      }
    } else {
      throw new Error("The API do not contain the property name");
    }
  }
}

export default new JobApi(jobs);