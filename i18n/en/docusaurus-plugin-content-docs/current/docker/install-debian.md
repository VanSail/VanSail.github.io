---
sidebar_position: 10
---

# Install Docker Engine

This guide shows how to install Docker Engine (Community Edition) on Debian and Ubuntu. It follows the [official Docker install docs](https://docs.docker.com/engine/install/debian/) and works on dev boards (Radxa, Raspberry Pi, and other ARM devices) as well as x86 servers and workstations.

## Supported versions

The official Docker repository provides prebuilt packages for these releases:

<Tabs groupId="distro">
  <TabItem value="debian" label="Debian" default>
    - Debian 12 (bookworm)
    - Debian 11 (bullseye)
  </TabItem>
  <TabItem value="ubuntu" label="Ubuntu">
    - Ubuntu 24.04 (noble)
    - Ubuntu 22.04 (jammy)
    - Ubuntu 20.04 (focal)
  </TabItem>
</Tabs>

> 💡 **Architecture note**: Docker ships prebuilt packages for both `amd64` and `arm64` (e.g. Radxa Rock 4D, Raspberry Pi). The install commands are identical; apt picks the package matching your current architecture.

## Uninstall old versions

If Docker was previously installed from your distribution's repository (usually `docker.io` or `docker-compose`), remove it first to avoid conflicts. This step does **not** delete image or container data under `/var/lib/docker`.

```bash title="Linux" showLineNumbers
sudo apt remove -y docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc
```

## Set up the Docker apt repository

### Install prerequisite tools

```bash title="Linux" showLineNumbers
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
```

### Add Docker's official GPG key

```bash title="Linux" showLineNumbers
sudo curl -fsSL https://download.docker.com/linux/$(. /etc/os-release && echo "$ID")/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### Add the apt source

Write the repository address for your distribution (Debian and Ubuntu use different paths).

<Tabs groupId="distro">
  <TabItem value="debian" label="Debian" default>

```bash title="Debian" showLineNumbers
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

  </TabItem>
  <TabItem value="ubuntu" label="Ubuntu">

```bash title="Ubuntu" showLineNumbers
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

  </TabItem>
</Tabs>

> ⚠️ **Derivative distros**: On Debian testing or derivatives like Kali, the `VERSION_CODENAME` from `/etc/os-release` may not map to a stable suite. Replace `$(. /etc/os-release && echo "$VERSION_CODENAME")` with a concrete stable codename (e.g. `trixie`, `bookworm`).

## Install Docker Engine

Install the latest Docker Engine and its core components:

```bash title="Linux" showLineNumbers
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

After installation, the Docker daemon normally starts via socket activation. Check its status:

```bash title="Linux" showLineNumbers
sudo systemctl status docker --no-pager
```

If it is not running, start it and enable boot-time startup:

```bash title="Linux" showLineNumbers
sudo systemctl enable --now docker
```

::::tip

To install a **specific version** instead of the latest, list the available versions first:

```bash title="Linux" showLineNumbers
apt list -a docker-ce
```

Then install the pinned version (replace `<VERSION_STRING>` with a string like `5:27.1.1-1~debian.12~bookworm`):

```bash title="Linux" showLineNumbers
sudo apt install -y docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io docker-buildx-plugin docker-compose-plugin
```

::::

## Verify the installation

Run the official `hello-world` image to confirm Docker can pull and start a container:

```bash title="Linux" showLineNumbers
sudo docker run hello-world
```

If you see `Hello from Docker!` followed by an explanatory message, the installation succeeded.

## Run as a non-root user (recommended)

By default only `root` and members of the `docker` group can run `docker` commands. To avoid typing `sudo` every time, add your user to the `docker` group:

```bash title="Linux" showLineNumbers
sudo usermod -aG docker $USER
```

**Log out and back in** (or reboot) for the group change to take effect. You can then run Docker without `sudo`:

```bash title="Linux" showLineNumbers
docker run hello-world
```

> ⚠️ Adding a user to the `docker` group is effectively equivalent to granting `root` privileges (container mounts can escape), so only do this on trusted hosts.

## Uninstall Docker Engine

To remove Docker completely:

```bash title="Linux" showLineNumbers
sudo apt purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
sudo rm -rf /var/lib/docker /var/lib/containerd
sudo rm /etc/apt/sources.list.d/docker.list
```

> ⚠️ `rm -rf /var/lib/docker` **permanently deletes** all images, containers, and volumes. Back up your data before running it.
