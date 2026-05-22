const [major, minor] = process.versions.node.split('.').map(Number);

if (major !== 20 || minor < 19) {
  console.error(
    `Expected Node.js 20.19.x for frontend commands. Got v${process.versions.node}.`
  );
  console.error('Use the frontend .node-version or .nvmrc file before running frontend install/build/test commands.');
  process.exit(1);
}
