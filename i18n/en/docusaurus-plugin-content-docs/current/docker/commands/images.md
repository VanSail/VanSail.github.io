---
sidebar_position: 2
---

# Image Commands

An image is the read-only template of a container. This page covers the common commands for pulling, building, inspecting, and cleaning up images.

## Pull an image

Download an image from a registry (Docker Hub by default) to your local machine:

```bash title="Linux" showLineNumbers
docker pull ubuntu:22.04
```

Without a tag, `latest` is pulled by default. Always pin a concrete tag for reproducibility:

```bash title="Linux" showLineNumbers
docker pull ros:humble
```

> 💡 If the pull fails with `i/o timeout`, configure a [registry mirror from the install guide](/docs/docker/basics/install#configure-a-registry-mirror-required-on-restricted-networks) first.

## List local images

List downloaded images with repository, tag, image ID, and size:

```bash title="Linux" showLineNumbers
docker images
```

Show only image IDs (handy for scripted batch operations):

```bash title="Linux" showLineNumbers
docker images -q
```

## Build an image

Build from a `Dockerfile`. `-t` sets `name:tag`; the trailing `.` is the build context (current directory):

```bash title="Linux" showLineNumbers
docker build -t my-ros-app:1.0 .
```

For multi-stage builds or cache control, add `--no-cache`:

```bash title="Linux" showLineNumbers
docker build --no-cache -t my-ros-app:1.0 .
```

## Tag an image

To rename or push to a private registry, add a new tag (no data copy, just a new reference):

```bash title="Linux" showLineNumbers
docker tag my-ros-app:1.0 registry.example.com/my-ros-app:1.0
```

## Save and load

To move images across offline hosts, save to a tarball then load it:

```bash title="Linux" showLineNumbers
docker save -o my-ros-app.tar my-ros-app:1.0
docker load -i my-ros-app.tar
```

## Remove an image

Remove by image ID or tag; `-f` force-removes an image still referenced by a container (not recommended — remove the container first):

```bash title="Linux" showLineNumbers
docker rmi my-ros-app:1.0
```

Clean up dangling images (tag `<none>`) not used by any container:

```bash title="Linux" showLineNumbers
docker image prune
```

:::::tip

**Free disk space in one command**

Remove all unused images, containers, networks, and build cache (use with care):

```bash title="Linux" showLineNumbers
docker system prune -a
```

:::::
