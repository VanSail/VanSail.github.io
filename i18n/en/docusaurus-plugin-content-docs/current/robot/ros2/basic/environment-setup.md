---
sidebar_position: 10
---

# Environment Setup

This guide shows how to set up a ROS 2 development environment on Ubuntu.

## Recommended Version

ROS 2 currently maintains two stable releases:

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>
    - Ubuntu 22.04
  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

    - Ubuntu 24.04
  </TabItem>
</Tabs>

> 💡 **Recommendation**: Beginners should choose Humble (mature ecosystem); choose Jazzy if you want to learn the latest features.

## System Environment

Make sure the system Locale supports UTF-8 to avoid encoding issues during installation.

<Tabs groupId="locale">
  <TabItem value="check-locale" label="Check Locale" default>

```bash title="Ubuntu" showLineNumbers
locale
```

On a Chinese system, the output looks like `zh_CN.UTF-8`.

  </TabItem>
  <TabItem value="set-locale" label="Set Locale" >

If the system Locale does not support UTF-8, set it manually.

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install locales -y
sudo locale-gen en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

  </TabItem>
</Tabs>

## Enable Software Sources

### Enable the Universe Repository

`software-properties-common` provides the `add-apt-repository` tool; the `universe` repository contains community-maintained open-source software that some ROS 2 dependencies rely on.

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install software-properties-common -y
sudo add-apt-repository universe
```

### Add the ROS 2 Source

Install the `ros2-apt-source` deb package to automatically configure the official ROS 2 apt repository (repo.ros2.org). The version is fetched dynamically via the GitHub API, and the package adapts to the current Ubuntu codename automatically.

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install curl -y
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F'"' '{print $4}')
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

:::tip

If the downloaded `ros2-apt-source.deb` is very small and cannot be installed, check the following:

- Check whether ROS_APT_SOURCE_VERSION is correct

```bash title="Ubuntu" showLineNumbers
echo $ROS_APT_SOURCE_VERSION
```

If there is no output or it is empty, the version lookup failed. Check your network connection or the GitHub API rate limit.

- Specify ROS_APT_SOURCE_VERSION manually

Visit [ROS Apt Source Releases](https://github.com/ros-infrastructure/ros-apt-source/releases) to find an available version, then set it manually.

```bash title="Ubuntu" showLineNumbers
export ROS_APT_SOURCE_VERSION="1.2.0"
```

- Re-download \/ install the ROS 2 source

```bash title="Ubuntu" showLineNumbers
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

:::

## Install Development Tools

`ros-dev-tools` includes essential tools such as `colcon`, `rosdep`, and `catkin`.

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-dev-tools -y
```

## Install ROS 2

### Install the Base Version

Includes communication libraries (rclpy, rclcpp), message packages, and CLI tools, without GUI. Suitable for servers / headless scenarios.

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-humble-ros-base -y
```

  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-jazzy-ros-base -y
```

  </TabItem>
</Tabs>

### Install the Desktop Version

Includes the ROS core + RViz visualization + demos + tutorials. Suitable for desktop / development users.

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-humble-desktop -y
```

  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-jazzy-desktop -y
```

  </TabItem>
</Tabs>

## Configure Environment Variables

Load the ROS 2 `workspace` into the current `shell` environment — setting key variables such as `ROS_DISTRO`, `ROS_PACKAGE_PATH`, `PATH`, and `LD_LIBRARY_PATH`.

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>

```bash title="Ubuntu" showLineNumbers
source /opt/ros/humble/setup.bash
```

  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

```bash title="Ubuntu" showLineNumbers
source /opt/ros/jazzy/setup.bash
```

  </TabItem>
</Tabs>

## Verify the ROS 2 Environment

Open two terminals and run the commands below:

- Terminal 1

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>

```bash title="Ubuntu" showLineNumbers
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp talker
```

  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

```bash title="Ubuntu" showLineNumbers
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_cpp talker
```

  </TabItem>
</Tabs>

- Terminal 2

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>

```bash title="Ubuntu" showLineNumbers
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_py listener
```

  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

```bash title="Ubuntu" showLineNumbers
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_py listener
```

  </TabItem>
</Tabs>

The `talker` (C++) publishes string messages, and the `listener` (Python) subscribes to the same topic.

If they communicate correctly, it means ROS 2's publish/subscribe mechanism, topic discovery, and the C++ and Python client libraries are all working properly.
