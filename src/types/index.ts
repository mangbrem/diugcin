/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectIndex {
  projectId: string;
  productName: string;
  lastModified: string;
}

export interface ProjectState {
  projectId: string;
  storyboard: StoryboardItem[];
  canvasData: any; // Konva stage data
}

export interface StoryboardItem {
  id: string;
  type: 'image' | 'video' | 'text';
  content: string;
  startTime: number;
  duration: number;
}
