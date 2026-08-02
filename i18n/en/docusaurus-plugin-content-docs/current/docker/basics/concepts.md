---
sidebar_position: 3
---

# Core Concepts

Master four core objects and you have Docker's skeleton: **image, container, volume, network**.

## Image

An image is a **read-only template** containing everything needed to run an app. It is stored in layers, and identical lower layers are shared across images to save space.

- Source: pull from a registry (`docker pull`) or build from a `Dockerfile` (`docker build`).
- Analogy: like an "installation disc" — immutable, endlessly copyable.

## Container

A container is a **running instance** of an image. You start processes inside it; the container adds a thin writable layer on top of the image's read-only layers.

- Lifecycle: create → run → stop → remove.
- Analogy: like a "system installed from the disc" — the disc (image) is unchanged, the installed system (container) can be modified.

> 💡 Data written inside a container is lost when the container is removed by default. Use a **volume** for persistence.

## Volume

A volume is Docker-**managed persistent storage**, independent of the container lifecycle. Even if the container is deleted, the volume's data remains.

- Unlike a bind mount (host directory), a volume is created and managed by Docker, making it more portable across platforms.
- Typical uses: database files, config files, ROS workspace data.

## Network

Networks let containers talk to each other and to the host. Docker provides several drivers:

| Driver | Use |
| --- | --- |
| `bridge` (default) | Container communication on a single host |
| `host` | Container shares the host network stack directly |
| `none` | No network |
| custom bridge | Project-scoped isolation with container-name DNS |

:::tip

**How the four relate**

```text
        Registry
            │ pull / push
            ▼
         Image ──run──▶ Container
                         │ mount
                         ▼
                       Volume (persistence)
                         │ attach
                         ▼
                       Network (connectivity)
```

:::

Install from [Install Docker](/docs/docker/basics/install); command usage is in [Commands](/docs/docker/commands).
