---
sidebar_position: 10
---

# 搭建环境

本篇介绍如何在 Ubuntu 上快速搭建 ROS 2 开发环境。

## 版本推荐

ROS 2 目前主要维护两个稳定版本：

<Tabs groupId="ros">
  <TabItem value="humble" label="Humble" default>
    - Ubuntu 22.04
  </TabItem>
  <TabItem value="jazzy" label="Jazzy" >
    - Ubuntu 24.04
  </TabItem>
</Tabs>

> 💡 **选择建议**：新手推荐 Humble（生态成熟），想学习最新特性推荐 Jazzy。

## 系统环境

确保系统 Locale 支持 UTF-8，避免安装过程出现编码问题。

<Tabs groupId="locale">
  <TabItem value="check-locale" label="检查 Locale" default>

```bash title="Ubuntu" showLineNumbers
locale
```

若系统是中文环境，会显示类似 `zh_CN.UTF-8` 的输出。

  </TabItem>
  <TabItem value="set-locale" label="设置 Locale" >

如果系统 Locale 不支持 UTF-8，需要进行设置。

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install locales -y
sudo locale-gen en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

  </TabItem>
</Tabs>

## 启用软件源

### 启用 Universe 源

`software-properties-common` 提供 `add-apt-repository` 工具；`universe` 源包含 Ubuntu 社区维护的开源软件，ROS 2 依赖的部分库在这里。

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install software-properties-common -y
sudo add-apt-repository universe
```

### 添加 ROS2 源

通过下载安装 `ros2-apt-source` deb 包，自动配置 ROS 2 官方仓库（repo.ros2.org）的 apt 源。版本号通过 GitHub API 动态获取，安装包根据当前 Ubuntu 代号自动适配。

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install curl -y
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F'"' '{print $4}')
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

:::tip

若下载的 `ros2-apt-source.deb` 文件很小且无法安装，可以按照下面步骤检查：

- 检查 ROS_APT_SOURCE_VERSION 是否正确

```bash title="Ubuntu" showLineNumbers
echo $ROS_APT_SOURCE_VERSION
```

若无输出或输出为空，说明版本号获取失败，需要手动检查网络连接或 GitHub API 限制。

- 指定 ROS_APT_SOURCE_VERSION

可以访问 [ROS Apt Source Releases](https://github.com/ros-infrastructure/ros-apt-source/releases) 查看可用的版本号，然后手动指定。

```bash title="Ubuntu" showLineNumbers
export ROS_APT_SOURCE_VERSION="1.2.0"
```

- 重新下载 \/ 安装 ROS2 源

```bash title="Ubuntu" showLineNumbers
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

:::

## 安装开发工具

`ros-dev-tools` 包含 `colcon`、`rosdep`、`catkin` 等开发必备工具。

```bash title="Ubuntu" showLineNumbers
sudo apt install ros-dev-tools -y
```

## 安装 ROS2

### 安装基础版

包含通信库（rclpy, rclcpp）、message 包和命令行工具，无 GUI，适合服务器/headless 场景。

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

### 安装桌面版

包含 ROS 核心 + RViz 可视化 + demos + tutorials，适合桌面/开发用户。

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

## 配置环境变量

将 ROS 2 的 `workspace` 加载到当前 `shell` 环境——设置 `ROS_DISTRO`、`ROS_PACKAGE_PATH`、`PATH`、`LD_LIBRARY_PATH` 等关键变量。

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

## 验证 ROS2 环境

打开了两个终端分别运行下面命令：

- 终端 1

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

- 终端 2

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

通过 `talker（C++）`发布字符串消息，`listener（Python）`订阅同一话题。

两者能正常通信，说明 ROS 2 的发布/订阅机制、话题发现、C++ 和 Python 客户端库都工作正常。
