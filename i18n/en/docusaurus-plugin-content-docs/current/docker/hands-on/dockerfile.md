---
sidebar_position: 2
---

# Writing a Dockerfile

A `Dockerfile` is the "recipe" for building an image — each instruction creates a layer. A clear, cache-friendly Dockerfile greatly improves build speed and maintainability.

## Minimal example

A typical Dockerfile for a ROS 2 workspace:

```dockerfile title="Dockerfile" showLineNumbers
# 1. Base image: pin a tag for reproducibility
FROM ros:humble

# 2. Environment variables (avoid interactive prompts)
ENV DEBIAN_FRONTEND=noninteractive
ENV ROS_DOMAIN_ID=1

# 3. Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3-pip && \
    rm -rf /var/lib/apt/lists/*

# 4. Copy code
WORKDIR /workspace
COPY . /workspace

# 5. Container start command
CMD ["ros2", "run", "demo_nodes_cpp", "talker"]
```

Build and run:

```bash title="Linux" showLineNumbers
docker build -t my-ros-app:1.0 .
docker run -d --name ros-node my-ros-app:1.0
```

## Common instructions

| Instruction | Purpose |
| --- | --- |
| `FROM <img>` | Base image (must be the first line) |
| `WORKDIR <path>` | Set working directory (created if missing) |
| `COPY <src> <dst>` | Copy files into the image |
| `RUN <cmd>` | Execute a command at build time (new layer) |
| `ENV <k>=<v>` | Set an environment variable |
| `EXPOSE <port>` | Declare an exposed port (documentation only) |
| `CMD [...]` | Default command at container start (overridable by `run`) |
| `ENTRYPOINT [...]` | Container entry point (pairs with `CMD`) |

> 💡 `CMD` and the command at the end of `docker run` are mutually exclusive — the latter overrides the former. `ENTRYPOINT` is best when you want the image to behave like a single executable.

## Build cache and layer order

Docker builds top-to-bottom and skips cached layers. Any instruction before `COPY` is reused as long as it is unchanged, so **put volatile content (your code) later**:

```dockerfile title="Dockerfile" showLineNumbers
# ✅ Install deps first (rarely change), copy code after (often change)
RUN apt-get update && apt-get install -y python3-pip
COPY . /workspace
```

If `COPY` comes before `RUN apt-get`, every code change invalidates all subsequent layers' cache, slowing builds.

## .dockerignore

Like `.gitignore`, it prevents irrelevant local files (e.g. `build/`, `node_modules`, `.git`) from entering the build context:

```text title=".dockerignore"
build/
.git
*.log
```

:::tip

**Why it matters**

The build context is sent entirely to the Docker daemon. Without `.dockerignore`, a large `node_modules` noticeably slows `docker build`.

:::

For image-size optimization, see [Image Slimming](/docs/docker/hands-on/image-slimming).
