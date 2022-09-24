import JobApp from "@components/job-app";
import JobCard from "@components/job-card";
import JobCardList from "@components/job-card-list";
import JobFilter from "@components/job-filter";
import JobFilterList from "@components/job-filter-list";
import JobTag from "@components/job-tag";
import JobTagList from "@components/job-tag-list";
import JobBadgeList from "@components/job-badge-list";
import JobBadge from "@components/job-badge";
import "./main.css";

customElements.define("job-app", JobApp);
customElements.define("job-card-list", JobCardList);
customElements.define("job-card", JobCard, { extends: "li" });
customElements.define("job-filter-list", JobFilterList);
customElements.define("job-filter", JobFilter, { extends: "li" });
customElements.define("job-tag-list", JobTagList);
customElements.define("job-tag", JobTag, { extends: "li" });
customElements.define("job-badge-list", JobBadgeList);
customElements.define("job-badge", JobBadge, { extends: "li" });

