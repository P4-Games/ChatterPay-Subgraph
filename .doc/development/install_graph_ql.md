# Install The Graph CLI

You can install the Graph CLI globally in two ways.  
This tool provides the `graph` command used to build, test, and deploy subgraphs.

## **Option A — via npm (recommended)**

```bash
npm install -g @graphprotocol/graph-cli
# or
yarn global add @graphprotocol/graph-cli
````

> ⚠️ **Important for Linux users:**
> If you install it with **Yarn**, the `graph` command might not be immediately recognized because Yarn’s global `bin` directory isn’t always in your system’s `PATH`.
> If you see this message after installation:
>
> ```
> Command 'graph' not found, but can be installed with:
> sudo apt install plotutils
> ```
>
> Don’t install `plotutils` — that’s a completely different tool.

Fix it by adding Yarn’s global bin path to your environment:

```bash
# Find where Yarn installs global binaries
yarn global bin
# Example output: /home/youruser/.yarn/bin

# Add that path to your shell configuration
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.bashrc
source ~/.bashrc
```

If you use Zsh:

```bash
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Then verify again:

```bash
graph --version
```

You should see something like:

```
Graph CLI version: 0.97.1
```

If you prefer to skip that setup, simply install with **npm** instead of Yarn — npm automatically adds global binaries to your `PATH`.


## **Option B — via script (if npm or yarn install fails)**

If installation through npm or yarn fails (for example, on macOS ARM/M1, WSL, or restricted systems),
you can use the manual installer script included in this repository:

```bash
bash scripts/install-graph-cli.sh
```

This script:

* Detects your OS and architecture (macOS, Linux, ARM, x64, etc.)
* Downloads the latest **precompiled Graph CLI binary** from
  [https://github.com/graphprotocol/graph-tooling/releases](https://github.com/graphprotocol/graph-tooling/releases)
* Installs it into `/usr/local/lib/graph`
* Creates a symlink at `/usr/local/bin/graph` so the `graph` command is available globally

If you see a permissions error, rerun it with `sudo`:

```bash
sudo bash scripts/install-graph-cli.sh
```

Or install it to your user folder instead:

```bash
bash scripts/install-graph-cli.sh ~/.local
export PATH="$HOME/.local/graph/bin:$PATH"
```

This script is fully cross-platform and contains **no secrets** — it’s safe for public repositories and ensures that even minimal environments can run `graph` without Node global issues.


## **Verify installation**

Run the following to confirm everything is working:

```bash
graph --version
```

If it prints a version number (e.g., `Graph CLI version: 0.97.1`), you’re ready to continue.

