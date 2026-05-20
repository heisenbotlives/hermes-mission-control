import assert from "node:assert/strict";
import test from "node:test";

import { getMissionData } from "../src/lib/mission-data";

test("Mission Control is the first managed project", () => {
  const data = getMissionData();
  const firstProject = data.projects[0];

  assert.equal(firstProject.name, "Hermes Mission Control");
  assert.equal(firstProject.owner, "Hermes + Luke");
  assert.match(firstProject.detail, /first managed project/i);
  assert.match(firstProject.path, /hermes-mission-control$/);
});
