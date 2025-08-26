import { z } from 'zod';

// Schema for image data
export const imageSchema = z.object({
  id: z.number(),
  directory: z.string(),
  filename: z.string()
});

// Schema for address data
export const addressSchema = z.object({
  id: z.number(),
  country: z.string(),
  province: z.string(),
  city: z.string(),
  barangay: z.string(),
  house_building_number: z.string(),
  country_code: z.string(),
  province_code: z.string(),
  city_code: z.string(),
  barangay_code: z.string()
});

// Schema for organization data
export const organizationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  logo: imageSchema,
  category: z.string()
});

// Schema for calendar event data
export const calendarEventSchema = z.object({
  event_id: z.number(),
  event_organization_id: z.number(),
  title: z.string(),
  event_date: z.string(), // ISO date string
  address_id: z.number(),
  description: z.string(),
  image: imageSchema,
  created_date: z.string(),
  last_modified_date: z.string(),
  rsvp_status: z.string(),
  address: addressSchema,
  organization: organizationSchema
});

// Type for calendar event data
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

// Type for grouped events by date
export type EventsByDate = Record<string, CalendarEvent[]>;

// Type for the event response from API
export type EventResponse = {
  rsvped_events: CalendarEvent[];
};

// Schema for organization event image
export const organizationEventImageSchema = z.object({
  id: z.number(),
  directory: z.string(),
  filename: z.string()
});

// Schema for organization event address
export const organizationEventAddressSchema = z.object({
  id: z.number(),
  country: z.string(),
  province: z.string(),
  city: z.string(),
  barangay: z.string(),
  house_building_number: z.string(),
  country_code: z.string(),
  province_code: z.string(),
  city_code: z.string(),
  barangay_code: z.string()
});

// Schema for organization event data
export const organizationEventSchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  title: z.string(),
  event_date: z.string(), // ISO date string
  address_id: z.number(),
  description: z.string(),
  image: organizationEventImageSchema,
  created_date: z.string(),
  last_modified_date: z.string(),
  address: organizationEventAddressSchema
});

// Type for organization event data
export type OrganizationEvent = z.infer<typeof organizationEventSchema>;

// Type for the organization calendar response from API
export type OrganizationCalendarResponse = {
  past_events: OrganizationEvent[];
  active_events: OrganizationEvent[];
};