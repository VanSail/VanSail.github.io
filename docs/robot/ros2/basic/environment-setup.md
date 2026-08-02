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

### 添加 ROS 2 源

推荐直接使用 ROS 官方提供的 GPG 密钥与 apt 源（官方文档当前推荐方式），**不依赖从 GitHub Release 下载 deb 包**，在受限网络或 ARM 平台上更稳妥。

```bash title="Ubuntu" showLineNumbers
sudo apt update && sudo apt install curl gnupg lsb-release -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /tmp/ros.key
sudo install -m 0755 -d /etc/apt/keyrings
sudo mv /tmp/ros.key /etc/apt/keyrings/ros-archive-keyring.gpg
sudo chmod a+r /etc/apt/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}}) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
sudo apt update
```

:::tip

> ⚠️ **备选方案（ros2-apt-source deb）**：如果你所在网络能正常访问 GitHub Release，也可以用官方旧方案——下载 `ros2-apt-source` deb 包自动配置源。注意提取版本号时**不要使用** `awk -F'"'` 这种写法（在多层引号嵌套场景下容易解析失败），改用更稳健的 `grep -oP`：
>
> ```bash title="Ubuntu" showLineNumbers
> sudo apt update && sudo apt install curl -y
> export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -oP '"tag_name":\s*"\K[^"]+')
> curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
> sudo apt update
> ```
>
> 若 `ROS_APT_SOURCE_VERSION` 为空（GitHub API 限流或网络不通），可手动访问 [ROS Apt Source Releases](https://github.com/ros-infrastructure/ros-apt-source/releases) 获取版本号后显式指定，例如 `export ROS_APT_SOURCE_VERSION="1.2.0"`。

::::

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

> 💡 若每次打开新终端都要手动 `source`，可写入 `~/.bashrc` 自动加载（按实际发行版选择一行）：
>
> ```bash title="Ubuntu" showLineNumbers
> echo "source /opt/ros/jazzy/setup.bash" >> ~/.bashrc
> ```
>
> 或对所有用户生效（需 root）：
>
> ```bash title="Ubuntu" showLineNumbers
> echo "source /opt/ros/jazzy/setup.bash" | sudo tee /etc/profile.d/ros2.sh > /dev/null
> ```

## 验证 ROS2 环境

> 📦 `ros-base` 只包含通信库与命令行工具，**不包含**演示节点 `demo_nodes_cpp` / `demo_nodes_py`。在运行下面的 talker/listener 验证前，请先安装演示包（按实际发行版选择）：

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

### 方法一：双终端验证（推荐理解通信）

打开两个终端，分别运行：

- 终端 1（talker，C++ 发布消息）

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

- 终端 2（listener，Python 订阅消息）

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

### 方法二：单终端一键验证（适合脚本/容器）

无需开两个终端，用一个命令先后启动 talker 与 listener：

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

`listener` 若能持续打印 `I heard: [Hello World: N]`，说明 ROS 2 的发布/订阅、话题发现、C++/Python 客户端库均工作正常。

## 使用 Docker 快速搭建 ROS 2（推荐隔离环境）

如果你不想污染宿主机，或需要在 ARM（如树莓派、Radxa 等）平台快速获得可用的 ROS 2 环境，可以直接基于官方 `ubuntu:24.04` 镜像构建。以下步骤已验证可在 ARM64 平台（`ubuntu:24.04` + ROS 2 Jazzy）正常安装并通信。

```bash title="Host" showLineNumbers
# 1. 拉取 Ubuntu 24.04 基础镜像
docker pull ubuntu:24.04

# 2. 启动容器（保持运行）
docker run -d --name ros2_build ubuntu:24.04 sleep infinity

# 3. 在容器内执行安装（源配置见上文“添加 ROS 2 源”）
docker exec -it ros2_build bash
```

进入容器后，依次执行上文的 **locale 设置 → 添加 ROS 2 源 → 安装开发工具 → 安装 ROS 2**。完成后验证：

```bash title="Container" showLineNumbers
source /opt/ros/jazzy/setup.bash
ros2 run demo_nodes_cpp talker & sleep 2; ros2 run demo_nodes_py listener & sleep 4; kill %1 %2
```

验证通过后，把容器保存为可复用镜像：

```bash title="Host" showLineNumbers
# 让环境在任意 shell 自动生效
docker exec ros2_build bash -c 'echo "source /opt/ros/jazzy/setup.bash" >> /root/.bashrc'
# 提交为 ros2_jazzy 镜像
docker commit ros2_build ros2_jazzy
# 直接运行验证
docker run --rm ros2_jazzy bash -c 'source /opt/ros/jazzy/setup.bash && ros2 pkg list | wc -l'
```
