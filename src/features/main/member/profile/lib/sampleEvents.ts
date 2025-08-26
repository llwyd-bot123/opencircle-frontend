/**
 * Sample event data for calendar demonstration
 */
export const sampleEvents = {
  rsvped_events: [
    {
      event_id: 16,
      event_organization_id: 4,
      title: "Active event 123456",
      event_date: "2025-08-27T23:26:00",
      address_id: 20,
      description: "dayasdoaskdw",
      image: {
        id: 56,
        directory: "uploads",
        filename: "e211f945e3b0488e8582e2a287b1126c_2405094115284f518fb5f083c3d09721.jpg"
      },
      created_date: "2025-08-27T23:22:43",
      last_modified_date: "2025-08-26T21:25:53",
      rsvp_status: "pending",
      address: {
        id: 20,
        country: "Ilocos Region",
        province: "La Union",
        city: "City of San Fernando",
        barangay: "Apaleng",
        house_building_number: "adsadasa",
        country_code: "010000000",
        province_code: "013300000",
        city_code: "013314000",
        barangay_code: "013314002"
      },
      organization: {
        id: 4,
        name: "caress org1",
        description: "description",
        logo: {
          id: 37,
          directory: "uploads",
          filename: "e211f945e3b0488e8582e2a287b1126c_004637e6b2ff4015bcedac2a0181d9cb.webp"
        },
        category: "non-profit"
      }
    },
    // Additional sample events with different dates for testing
    {
      event_id: 17,
      event_organization_id: 4,
      title: "Team Building Workshop",
      event_date: "2025-08-15T14:30:00",
      address_id: 20,
      description: "Annual team building workshop for all employees",
      image: {
        id: 57,
        directory: "uploads",
        filename: "team_building.jpg"
      },
      created_date: "2025-08-01T10:22:43",
      last_modified_date: "2025-08-02T11:25:53",
      rsvp_status: "confirmed",
      address: {
        id: 20,
        country: "Ilocos Region",
        province: "La Union",
        city: "City of San Fernando",
        barangay: "Apaleng",
        house_building_number: "adsadasa",
        country_code: "010000000",
        province_code: "013300000",
        city_code: "013314000",
        barangay_code: "013314002"
      },
      organization: {
        id: 4,
        name: "caress org1",
        description: "description",
        logo: {
          id: 37,
          directory: "uploads",
          filename: "e211f945e3b0488e8582e2a287b1126c_004637e6b2ff4015bcedac2a0181d9cb.webp"
        },
        category: "non-profit"
      }
    },
    {
      event_id: 18,
      event_organization_id: 5,
      title: "Charity Fundraiser",
      event_date: "2025-08-20T18:00:00",
      address_id: 21,
      description: "Annual charity fundraiser for local community projects",
      image: {
        id: 58,
        directory: "uploads",
        filename: "charity_event.jpg"
      },
      created_date: "2025-08-05T09:30:43",
      last_modified_date: "2025-08-06T14:15:53",
      rsvp_status: "pending",
      address: {
        id: 21,
        country: "Ilocos Region",
        province: "La Union",
        city: "City of San Fernando",
        barangay: "Central West",
        house_building_number: "123 Main St",
        country_code: "010000000",
        province_code: "013300000",
        city_code: "013314000",
        barangay_code: "013314003"
      },
      organization: {
        id: 5,
        name: "Community Helpers",
        description: "Local community support organization",
        logo: {
          id: 38,
          directory: "uploads",
          filename: "community_helpers_logo.webp"
        },
        category: "non-profit"
      }
    }
  ]
};