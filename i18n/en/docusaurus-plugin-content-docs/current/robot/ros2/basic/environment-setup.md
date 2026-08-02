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

It is recommended to use the official ROS GPG key and apt source directly (the current official approach). This **does not depend on downloading a deb from GitHub Releases**, making it more reliable on restricted networks or ARM platforms.

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install curl gnupg lsb-release -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /tmp/ros.key
sudo install -m 0755 -d /etc/apt/keyrings
sudo mv /tmp/ros.key /etc/apt/keyrings/ros-archive-keyring.gpg
sudo chmod a+r /etc/apt/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}}) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
sudo apt update
```

::::tip

> ⚠️ **Alternative (ros2-apt-source deb)**: If your network can access GitHub Releases normally, you may use the older official method of downloading the `ros2-apt-source` deb to configure the source automatically. Note that when extracting the version, **do not use** the `awk -F'"'` style (it can fail under nested quoting); use the more robust `grep -oP` instead:
>
> ```bash title="Ubuntu" showLineNumbers
> sudo apt update && sudo apt install curl -y
> export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -oP '"tag_name":\s*"\K[^"]+')
> curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
> sudo dpkg -i /tmp/ros2-apt-source.deb
> sudo apt update
> ```
>
> If `ROS_APT_SOURCE_VERSION` is empty (GitHub API rate limit or no network), visit [ROS Apt Source Releases](https://github.com/ros-infrastructure/ros-apt-source/releases) to get a version and set it explicitly, e.g. `export ROS_APT_SOURCE_VERSION="1.2.0"`.

::::

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

> 💡 If you don't want to `source` manually in every new terminal, add it to `~/.bashrc` (pick the line matching your distro):
>
> ```bash title="Ubuntu" showLineNumbers
> echo "source /opt/ros/jazzy/setup.bash" >> ~/.bashrc
> ```
>
> Or make it apply to all users (root required):
>
> ```bash title="Ubuntu" showLineNumbers
> echo "source /opt/ros/jazzy/setup.bash" | sudo tee /etc/profile.d/ros2.sh > /dev/null
> ```

## Verify the ROS 2 Environment

> 📦 `ros-base` only includes the communication libraries and CLI tools — it does **not** ship the demo nodes `demo_nodes_cpp` / `demo_nodes_py`. Install the demo packages before running the talker/listener verification (pick the line matching your distro):

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-humble-demo-nodes-cpp ros-humble-demo-nodes-py -y
```

  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-jazzy-demo-nodes-cpp ros-jazzy-demo-nodes-py -y
```

  </TabItem>
</Tabs>

### Method 1: Two-Terminal Verification (recommended for understanding)

Open two terminals and run:

- Terminal 1 (talker, C++ publisher)

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

- Terminal 2 (listener, Python subscriber)

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

### Method 2: Single-Terminal One-Shot Verification (great for scripts/containers)

No need for two terminals — start talker and listener in one command:

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>

```bash title="Ubuntu" showLineNumbers
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp talker & sleep 2; ros2 run demo_nodes_py listener & sleep 4; kill %1 %2
```

  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >

```bash title="Ubuntu" showLineNumbers
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_cpp talker & sleep 2; ros2 run demo_nodes_py listener & sleep 4; kill %1 %2
```

  </TabItem>
</Tabs>

If the `listener` keeps printing `I heard: [Hello World: N]`, it means ROS 2's publish/subscribe, topic discovery, and the C++/Python client libraries are all working properly.
