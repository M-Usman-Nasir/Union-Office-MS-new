// Communication API - Alias for Announcements API
// This file provides a unified interface for all communication features
// Currently, announcements are the primary communication method

import { announcementApi } from './announcementApi'

export const communicationApi = {
  // Announcements
  getAnnouncements: (params) => announcementApi.getAll(params),
  getAnnouncementById: (id) => announcementApi.getById(id),
  createAnnouncement: (data) => announcementApi.create(data),
  updateAnnouncement: (id, data) => announcementApi.update(id, data),
  deleteAnnouncement: (id) => announcementApi.remove(id),

  // Future: Add other communication methods like notifications, messages, etc.
}
