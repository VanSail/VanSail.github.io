---
sidebar_position: 3
---

# Image Slimming

Smaller images pull faster, shrink the attack surface, and deploy lighter. Three techniques, from easy to advanced.

## 1. Multi-stage builds (most common)

Separate the "build environment" from the "runtime environment": the build stage uses a large image with toolchains, and the final stage copies only the artifacts into a slim image, discarding build dependencies.

For a C++ ROS 2 package:

```dockerfile title="Dockerfile" showLineNumbers
# Stage 1: build
FROM ros:humble AS builder
WORKDIR /workspace
COPY . /workspace
RUN colcon build --packages-select my_pkg

# Stage 2: run (carry only the artifacts)
FROM ros:humble
WORKDIR /app
COPY --from=builder /workspace/install /app/install
CMD ["ros2", "run", "my_pkg", "node"]
```

The final image excludes source and intermediate build files, shrinking several times over.

## 2. Pick a slim base image

Prefer `-slim` or `-alpine` variants:

| Base image | Typical use |
| --- | --- |
| `python:3.12-slim` | Runtime only, no build headers |
| `node:20-alpine` | Minimal, runtime-only |
| `ros:humble` | ROS required, includes runtime |

> ⚠️ Alpine uses the `musl` libc. Some closed-source libraries depending on glibc (e.g. certain GPU drivers) are incompatible — test first.

## 3. Clean package-manager caches

Always clean caches after `apt`/`pip` installs, or they stay in the image layer:

```dockerfile title="Dockerfile" showLineNumbers
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3-pip && \
    rm -rf /var/lib/apt/lists/*
```

`--no-install-recommends` also avoids pulling in non-essential suggested packages.

## Inspect and compare size

After building, compare the slimming effect:

```bash title="Linux" showLineNumbers
docker images my-ros-app
docker history my-ros-app:1.0   # see per-layer size source
```

:::::tip

**Clean up unused resources in one go**

Remove intermediate images and caches produced during optimization:

```bash title="Linux" showLineNumbers
docker builder prune
```

:::::

## Summary

| Technique | Benefit |
| --- | --- |
| Multi-stage build | Drop build deps, shrink several times |
| Slim base image | Reduce system-layer size |
| Clean package cache | Save tens of MB per layer |

Back to [Writing a Dockerfile](/docs/docker/hands-on/dockerfile) for instruction details.
