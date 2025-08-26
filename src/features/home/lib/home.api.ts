import { objectToFormData } from "@src/shared/utils/formDataConverter";
import axiosInstance from "@src/shared/api/axios";

// Send a request to join an organization
export const joinOrganization = async (organizationId: number) => {
  const formData = objectToFormData({ organization_id: organizationId });

  const response = await axiosInstance.post("/organization/join", formData);

  return response.data;
};

// Send a request to RSVP for an event
export const rsvpEvent = async (eventId: number) => {
  const formData = objectToFormData({ event_id: eventId });

  const response = await axiosInstance.post("/rsvp", formData);

  return response.data;
};

// Delete an RSVP for an event
export const deleteRsvp = async (rsvpId: number) => {
  const response = await axiosInstance.delete(`/rsvp/${rsvpId}`);

  return response.data;
};
