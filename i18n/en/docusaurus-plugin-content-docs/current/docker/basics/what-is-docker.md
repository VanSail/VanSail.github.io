---
sidebar_position: 2
---

# What is Docker

Docker is the most popular containerization platform. It packages an application and all its dependencies (code, runtime, system tools, libraries) into a single **lightweight, portable** unit, enabling "build once, run anywhere".

## Why containers

The classic pain is "it works on my machine": dev, test, and prod environments drift, causing dependency conflicts and version mismatches. Containers solve this with **isolation + standardization**:

- **Isolation**: each container has its own process space, filesystem, and network — no interference.
- **Standardization**: identical behavior on a laptop, a server, or a dev board.

## Containers vs Virtual Machines

| Aspect | Virtual Machine (VM) | Container |
| --- | --- | --- |
| Virtualization layer | Hardware + full Guest OS | OS process level |
| Startup speed | Seconds ~ minutes | Milliseconds ~ seconds |
| Resource cost | High (full OS per VM) | Low (shares host kernel) |
| Isolation strength | Strong (kernel-level) | Medium (namespace-level) |

> 💡 Containers share the host kernel, so they are lighter than VMs — but you cannot run a container whose kernel differs from the host (e.g. a Windows container on a Linux host needs extra setup).

## Core components

Docker uses a client-server architecture:

- **Docker client (CLI)**: the `docker` commands you run.
- **Docker daemon**: the background service that builds, runs, and distributes containers.
- **Docker registry**: the hub that stores images; Docker Hub by default.

:::tip

**Typical workflow**

```text
Write Dockerfile → docker build image → docker push to registry
                                      ↓
                          docker pull / docker run container
```

:::

Next, read [Core Concepts](/docs/docker/basics/concepts) to learn how images, containers, volumes, and networks relate.
