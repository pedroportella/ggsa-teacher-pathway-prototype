const [major, minor] = process.versions.node.split('.').map(Number);

if (major !== 20 || minor < 19) {
  console.error(
    `Expected Node.js >=20.19.0 <21.0.0 for frontend commands. Got v${process.versions.node}.`
  );
  console.error('Use the repository Volta toolchain or root .node-version/.nvmrc before running frontend install/build/test commands.');
  console.error('If Volta is installed but nvm is still being used, run: export PATH="$HOME/.volta/bin:$PATH"');
  process.exit(1);
}
