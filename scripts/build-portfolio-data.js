import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const sourcePath = path.join(root, "content", "portfolio.yaml");
const schemaPath = path.join(root, "schema", "portfolio.schema.json");
const outputPath = path.join(root, "generated", "portfolio-data.json");

const [yamlSource, schemaSource] = await Promise.all([
  fs.readFile(sourcePath, "utf8"),
  fs.readFile(schemaPath, "utf8")
]);

const source = YAML.parse(yamlSource);
const schema = JSON.parse(schemaSource);

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!validate(source)) {
  console.error("Portfolio knowledge base validation failed:");
  for (const error of validate.errors ?? []) {
    console.error(`- ${error.instancePath || "/"} ${error.message}`);
  }
  process.exit(1);
}

const facts = [];
const seenIds = new Set();

function addFacts(items, context = {}) {
  for (const fact of items ?? []) {
    if (seenIds.has(fact.id)) {
      throw new Error(`Duplicate fact id: ${fact.id}`);
    }
    seenIds.add(fact.id);

    if (!fact.public) continue;

    facts.push({
      id: fact.id,
      topics: [...fact.topics],
      text: fact.text,
      source: fact.source,
      confidence: fact.confidence,
      context
    });
  }
}

addFacts(source.profile.facts, { section: "profile" });

for (const item of source.experience) {
  addFacts(item.facts, {
    section: "experience",
    experienceId: item.id,
    company: item.company
  });
}

for (const [group, items] of Object.entries(source.skills)) {
  addFacts(items, {
    section: "skills",
    skillGroup: group
  });
}

for (const project of source.projects) {
  addFacts(project.facts, {
    section: "projects",
    projectId: project.id,
    projectName: project.name,
    links: project.links ?? {}
  });
}

for (const [group, items] of Object.entries(source.positioning)) {
  addFacts(items, {
    section: "positioning",
    positioningGroup: group
  });
}

facts.sort((a, b) => a.id.localeCompare(b.id));

const runtime = {
  version: source.version,
  person: source.person,
  facts
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(runtime, null, 2) + "\n", "utf8");

console.log(`Built ${facts.length} public facts → ${path.relative(root, outputPath)}`);
