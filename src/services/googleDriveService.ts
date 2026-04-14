/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectIndex, ProjectState } from '../types';

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files';

export class GoogleDriveService {
  private accessToken: string | null = null;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Finds or creates the projects_index.json file in appDataFolder
   */
  async getOrCreateIndex(): Promise<ProjectIndex[]> {
    try {
      // Search for the file in appDataFolder
      const query = encodeURIComponent("name = 'projects_index.json' and 'appDataFolder' in parents");
      const response = await fetch(`${DRIVE_API_URL}?q=${query}&spaces=appDataFolder&fields=files(id, name)`, {
        headers: this.headers,
      });

      const data = await response.json();
      const file = data.files?.[0];

      if (file) {
        // File exists, fetch content
        const contentResponse = await fetch(`${DRIVE_API_URL}/${file.id}?alt=media`, {
          headers: this.headers,
        });
        return await contentResponse.json();
      } else {
        // File doesn't exist, create it
        const initialIndex: ProjectIndex[] = [];
        await this.createFile('projects_index.json', initialIndex);
        return initialIndex;
      }
    } catch (error) {
      console.error('Error in getOrCreateIndex:', error);
      throw error;
    }
  }

  /**
   * Creates a new file in the appDataFolder
   */
  async createFile(name: string, content: any): Promise<string> {
    const metadata = {
      name,
      parents: ['appDataFolder'],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

    const response = await fetch(`${UPLOAD_API_URL}?uploadType=multipart`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: form,
    });

    const data = await response.json();
    return data.id;
  }

  /**
   * Updates an existing file
   */
  async updateFile(fileId: string, content: any): Promise<void> {
    await fetch(`${UPLOAD_API_URL}/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
  }

  /**
   * Saves a project state
   */
  async saveProject(project: ProjectState): Promise<void> {
    const fileName = `project_${project.projectId}_state.json`;
    
    // Check if file exists
    const query = encodeURIComponent(`name = '${fileName}' and 'appDataFolder' in parents`);
    const response = await fetch(`${DRIVE_API_URL}?q=${query}&spaces=appDataFolder&fields=files(id)`, {
      headers: this.headers,
    });
    
    const data = await response.json();
    const fileId = data.files?.[0]?.id;

    if (fileId) {
      await this.updateFile(fileId, project);
    } else {
      await this.createFile(fileName, project);
    }

    // Update index
    const index = await this.getOrCreateIndex();
    const existingIndex = index.findIndex(p => p.projectId === project.projectId);
    
    const projectMeta: ProjectIndex = {
      projectId: project.projectId,
      productName: (project as any).productName || 'Untitled Project',
      lastModified: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      index[existingIndex] = projectMeta;
    } else {
      index.push(projectMeta);
    }

    // Save index back
    const indexQuery = encodeURIComponent("name = 'projects_index.json' and 'appDataFolder' in parents");
    const indexSearch = await fetch(`${DRIVE_API_URL}?q=${indexQuery}&spaces=appDataFolder&fields=files(id)`, {
      headers: this.headers,
    });
    const indexData = await indexSearch.json();
    const indexFileId = indexData.files?.[0]?.id;
    
    if (indexFileId) {
      await this.updateFile(indexFileId, index);
    }
  }
}
