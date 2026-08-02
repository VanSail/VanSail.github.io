---
sidebar_position: 4
---

# Volume Commands

Containers are ephemeral — data written inside them is lost on restart. A **volume** is Docker-managed persistent storage, independent of the container lifecycle. Even if the container is removed, the volume's data remains.

## Create and list

```bash title="Linux" showLineNumbers
docker volume create ros-data
docker volume ls
```

## Mount into a container

Use `-v volume-name:container-path` (the volume is auto-created if missing):

```bash title="Linux" showLineNumbers
docker run -d --name ros-node -v ros-data:/root/.ros ros:humble
```

You can also bind-mount a host directory, useful for hot-reloading code during development:

```bash title="Linux" showLineNumbers
docker run -d --name ros-node -v $PWD/src:/workspace/src ros:humble
```

## Clean up volumes

Remove a specific volume (errors if still in use by a container):

```bash title="Linux" showLineNumbers
docker volume rm ros-data
```

Remove all unused volumes:

```bash title="Linux" showLineNumbers
docker volume prune
```

> ⚠️ Removing a volume is irreversible — back up data first. See [Network Commands](/docs/docker/commands/network) for how volumes differ from networks.
