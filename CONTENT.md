# Portfolio Content: Danial Azmi

> Source of truth for the portfolio copy.
> Sources: the current danbyte.my (home + /projects) and Danial's resume (career section).

## Decisions

| Topic | Decision |
|---|---|
| Purpose | Personal brand + job hunting |
| Stack | FastAPI + Jinja2 (as today) |
| Theme | Terminal v2 (`themes/01-terminal-v2.html`) |
| Metrics | None for now. Don't invent any. |
| Company names | Named in the career section. **Anonymous on project cards** ("a major Malaysian media group", "an edtech platform"). |
| Project years | Inferred from role dates. Confirmed OK. |
| LinkedIn | Not needed. Career section comes from the resume. |
| Writing section | No |
| Photo | None (ASCII portrait tried and dropped) |
| Resume / CV | Not on the site |
| Side projects | Not shown (professional work only) |

---

## 1. Identity

| Field | Value |
|---|---|
| Name | Danial Azmi |
| Title | Data Scientist & AI Engineer |
| Location | Petaling Jaya, Selangor, Malaysia |
| Current role | Data Scientist @ Tupai AI |
| Status line | Open to interesting problems. |
| Domain | danbyte.my |

### Hero

> **Hello, I'm Danial Azmi.**
> Data Scientist & AI Engineer working across the full data stack, from data platforms to ML models to GenAI applications.

---

## 2. About

I'm a data scientist working across the full data stack: building data platforms, training ML models, and shipping GenAI applications in production. My focus is bridging the gap between advanced AI/ML systems and real business needs, **making models useful, not just accurate.**

Over the past ~4.5 years I've worked across fintech, media, consulting and edtech. I've migrated pipelines, stood up MLOps on the cloud and built recommendation engines. Lately I've been building RAG chatbots and AI agents that talk to company data through MCP.

---

## 3. Experience

### Data Scientist: Tupai AI (AI Teacher Sdn. Bhd.)
*Kuala Lumpur · Sep 2025 – Present*
- Built the full analytics stack serving Marketing, Product and other teams, from data collection through to analysis, using PostHog, GA4, BigQuery, dbt, Prefect and Metabase on a medallion architecture.
- Developed a Bayesian recommendation system that creates customised learning plans for students.
- Created an AI agent with custom MCP servers (Gemini, Haystack, FastAPI) that works as an internal data analyst. It talks to Metabase, PostHog and BigQuery, so teammates can build simple analyses and dashboards themselves.

### Data Scientist: REV Media Group
*Kuala Lumpur · Sep 2023 – Sep 2025*
- Developed an end-to-end RAG question-answering chatbot (Python, FastAPI, Haystack, GCP), improving customer engagement across multiple channels.
- Introduced CI/CD tooling and best practices, significantly streamlining the development lifecycle.
- Migrated on-premise ML models to GCP for better monitoring and observability.
- Developed a geo-located hyper-personalisation recommendation engine that drove a substantial increase in organic user engagement across products.

### Data Science Consultant: DataMicron Systems Sdn. Bhd.
*Kuala Lumpur · Feb 2023 – Sep 2023*
- Led research and POCs to identify and validate AI/ML business use cases.
- Worked directly with clients to understand their challenges and propose AI/ML solutions to complex problems.
- Oversaw end-to-end project lifecycles, from model development and deployment to post-launch maintenance.

### Data Scientist: MoneyLion Malaysia Sdn. Bhd.
*Kuala Lumpur · Mar 2022 – Dec 2022*
- Migrated the team's Airflow and dbt ETL pipelines from AWS to Snowflake as part of a cloud database provider change.
- Designed, ran and monitored A/B tests to improve the NLU model and reduce operational costs.
- Analysed unstructured text data to surface topics and pain points and quantify them, giving a clearer picture of consumer behaviour.
- Built interactive dashboards that helped stakeholders make data-driven strategic decisions.

### Web Developer & Software QA Tester (Intern): Funai Malaysia R&D Sdn. Bhd.
*Johor Bahru · Mar 2021 – Jun 2021*
- Maintained and extended an internal web-based management and testing system built on Django.
- Worked with the QA team testing software for Android TVs.

---

## 4. Education

**Bachelor of Computer Science (Data Science)**: Multimedia University, Cyberjaya · 2017 – 2021
- Yayasan Telekom Malaysia Scholar
- Final-year project: Aspect-Based Sentiment Analysis on Steam game reviews

---

## 5. Projects

Featured (shown on home page; companies anonymous):

1. **AI Analyst Agent (MCP)** · 2025: Internal AI data analyst built with Gemini, Haystack, FastAPI and custom MCP servers. Teammates query Metabase, PostHog and BigQuery in plain language and build simple analyses and dashboards themselves.
   `Gemini` `Haystack` `FastAPI` `MCP` `BigQuery` `PostHog`
2. **RAG Question-Answering Chatbot** · 2023–25: End-to-end production chatbot using retrieval-augmented generation for a major Malaysian media group, serving customer queries across digital channels on GCP.
   `RAG` `Haystack` `FastAPI` `GCP` `Python`
3. **Adaptive Learning Recommender** · 2025: Personalised learning-plan generator for an edtech platform. A Bayesian model adapts content order to each student's performance and history.
   `Python` `Bayesian` `ML` `BigQuery` `dbt`
4. **Geo-Localised Recommendation Engine** · 2023–25: Hyper-personalised recommendations combining geo-location signals with behavioural data to lift organic article engagement.
   `Python` `GCP` `RecSys` `BigQuery`

More:

5. **Medallion Analytics Stack**: Built the analytics stack for an edtech platform end to end, from event collection to dashboards, organised into bronze/silver/gold layers. `PostHog` `GA4` `BigQuery` `dbt` `Prefect` `Metabase`
6. **On-Prem → GCP MLOps Migration**: Moved legacy ML inference services to containerised deployments on Cloud Run, monitored via Vertex AI. `GCP` `Docker` `Kubernetes` `Kubeflow` `Vertex AI` `CI/CD`
7. **NLU A/B Testing Framework**: Designed and monitored experiments on NLU model variants; reduced inference cost and improved intent accuracy. `Python` `NLU` `A/B Testing` `Airflow`
8. **ETL Migration (AWS → Snowflake)**: Migrated Airflow-orchestrated ETL and dbt models from AWS Redshift to Snowflake with zero downtime and full data validation. `Airflow` `dbt` `Snowflake` `AWS`
9. **Aspect-Based Sentiment Analysis** (FYP): NLP on millions of Steam game reviews: validation, preprocessing, neural networks and classical ML. `NLP` `TensorFlow` `Scikit-learn` `Pandas`
10. **AI/ML Consulting POCs**: Client-facing POCs across computer vision, NLP and forecasting, covering scoping, building, hand-off and support. `Python` `ML` `FastAPI` `Docker`
11. **Internal QA Management System**: Django web app supporting QA workflows for Android TV software. `Django` `Python` `JavaScript`
12. **danbyte.my**: This portfolio. → github.com/danialazmie/danbyte.my

---

## 6. Skills

| Area | Tools |
|---|---|
| Languages | Python, SQL, JavaScript, Bash |
| AI / ML | LLMs, RAG, GenAI, NLP, MLOps, Haystack, LangChain, Hugging Face, PyTorch, TensorFlow, Scikit-learn, Pinecone, ChromaDB |
| Data Engineering | dbt, BigQuery, Airflow, Prefect, Fivetran, Snowflake, Redshift, Pandas, Metabase, PostHog, GA4 |
| Cloud | GCP, AWS, Azure |
| Infra & Tools | FastAPI, Docker, Kubernetes, Kubeflow, Nginx, Git, CI/CD |

---

## 7. Contact

- Email: danial.azmiee@gmail.com
- GitHub: github.com/danialazmie
- LinkedIn: linkedin.com/in/danial-azmi

---

## Open Questions

1. **Fivetran:** listed on the old site but not in the resume. Keep it in Skills?
