import type {ReactNode} from 'react';
import CategoryPage from '@site/src/components/CategoryPage';
import {robots} from '@site/src/data/cards';

const meta = {
  title: {zh: '机器人 - VanSail', en: 'Robotics - VanSail'},
  desc: {zh: 'ROS 机器人开发资源', en: 'ROS robotics development resources'},
};

export default function RobotsPage(): ReactNode {
  return <CategoryPage heroType="robots" meta={meta} items={robots} />;
}
