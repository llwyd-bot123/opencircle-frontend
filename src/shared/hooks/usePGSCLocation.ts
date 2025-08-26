import { useState, useCallback } from 'react';
import axios from 'axios';

// Types for PSGC API responses
interface PGSCRegion {
  code: string;
  name: string;
  regionName: string;
}

interface PGSCProvince {
  code: string;
  name: string;
  regionCode: string;
}

interface PGSCCity {
  code: string;
  name: string;
  provinceCode: string;
}

interface PGSCBarangay {
  code: string;
  name: string;
  cityCode: string;
}

// Option type for select fields
export interface LocationOption {
  value: string;
  label: string;
  code?: string; // Used for API calls
}

// Selected location data
export interface LocationData {
  region: LocationOption | null;
  province: LocationOption | null;
  city: LocationOption | null;
  barangay: LocationOption | null;
}

// Loading states for each select
export interface LoadingStates {
  regions: boolean;
  provinces: boolean;
  cities: boolean;
  barangays: boolean;
}

// Error states for each select
export interface ErrorStates {
  regions: string | null;
  provinces: string | null;
  cities: string | null;
  barangays: string | null;
}

/**
 * Custom hook for fetching and managing Philippine location data from PSGC API
 */
export const usePGSCLocation = () => {
  // Options for each select field
  const [regionOptions, setRegionOptions] = useState<LocationOption[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<LocationOption[]>([]);
  const [cityOptions, setCityOptions] = useState<LocationOption[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<LocationOption[]>([]);

  // Selected values
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    region: null,
    province: null,
    city: null,
    barangay: null,
  });

  // Loading states
  const [loading, setLoading] = useState<LoadingStates>({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false,
  });

  // Error states
  const [errors, setErrors] = useState<ErrorStates>({
    regions: null,
    provinces: null,
    cities: null,
    barangays: null,
  });

  /**
   * Fetch regions from PSGC API
   */
  const fetchRegions = useCallback(async () => {
    setLoading((prev) => ({ ...prev, regions: true }));
    setErrors((prev) => ({ ...prev, regions: null }));

    try {
      const response = await axios.get<PGSCRegion[]>('https://psgc.gitlab.io/api/regions');
      const options = response.data.map((region) => ({
        value: region.code,
        label: region.name,
        code: region.code,
      }));
      setRegionOptions(options);
    } catch (error) {
      console.error('Error fetching regions:', error);
      setErrors((prev) => ({ ...prev, regions: 'Failed to load regions' }));
    } finally {
      setLoading((prev) => ({ ...prev, regions: false }));
    }
  }, []);

  /**
   * Fetch provinces by region code
   */
  const fetchProvinces = useCallback(async (regionCode: string) => {
    if (!regionCode) return;

    setLoading((prev) => ({ ...prev, provinces: true }));
    setErrors((prev) => ({ ...prev, provinces: null }));

    try {
      const response = await axios.get<PGSCProvince[]>(
        `https://psgc.gitlab.io/api/regions/${regionCode}/provinces`
      );
      const options = response.data.map((province) => ({
        value: province.code,
        label: province.name,
        code: province.code,
      }));
      setProvinceOptions(options);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setErrors((prev) => ({ ...prev, provinces: 'Failed to load provinces' }));
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }));
    }
  }, []);

  /**
   * Fetch cities by province code
   */
  const fetchCities = useCallback(async (provinceCode: string) => {
    if (!provinceCode) return;

    setLoading((prev) => ({ ...prev, cities: true }));
    setErrors((prev) => ({ ...prev, cities: null }));

    try {
      const response = await axios.get<PGSCCity[]>(
        `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities`
      );
      const options = response.data.map((city) => ({
        value: city.code,
        label: city.name,
        code: city.code,
      }));
      setCityOptions(options);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setErrors((prev) => ({ ...prev, cities: 'Failed to load cities' }));
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }));
    }
  }, []);

  /**
   * Fetch barangays by city code
   */
  const fetchBarangays = useCallback(async (cityCode: string) => {
    if (!cityCode) return;

    setLoading((prev) => ({ ...prev, barangays: true }));
    setErrors((prev) => ({ ...prev, barangays: null }));

    try {
      const response = await axios.get<PGSCBarangay[]>(
        `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays`
      );
      const options = response.data.map((barangay) => ({
        value: barangay.code,
        label: barangay.name,
        code: barangay.code,
      }));
      setBarangayOptions(options);
    } catch (error) {
      console.error('Error fetching barangays:', error);
      setErrors((prev) => ({ ...prev, barangays: 'Failed to load barangays' }));
    } finally {
      setLoading((prev) => ({ ...prev, barangays: false }));
    }
  }, []);

  /**
   * Handle region selection
   */
  const handleRegionChange = useCallback(
    (option: LocationOption | null) => {
      // Clear lower-level selections
      setSelectedLocation({
        region: option,
        province: null,
        city: null,
        barangay: null,
      });

      // Clear lower-level options
      setProvinceOptions([]);
      setCityOptions([]);
      setBarangayOptions([]);

      // Fetch provinces if a region is selected
      if (option?.code) {
        fetchProvinces(option.code);
      }
    },
    [fetchProvinces]
  );

  /**
   * Handle province selection
   */
  const handleProvinceChange = useCallback(
    (option: LocationOption | null) => {
      // Update province and clear lower-level selections
      setSelectedLocation((prev) => ({
        ...prev,
        province: option,
        city: null,
        barangay: null,
      }));

      // Clear lower-level options
      setCityOptions([]);
      setBarangayOptions([]);

      // Fetch cities if a province is selected
      if (option?.code) {
        fetchCities(option.code);
      }
    },
    [fetchCities]
  );

  /**
   * Handle city selection
   */
  const handleCityChange = useCallback(
    (option: LocationOption | null) => {
      // Update city and clear barangay selection
      setSelectedLocation((prev) => ({
        ...prev,
        city: option,
        barangay: null,
      }));

      // Clear barangay options
      setBarangayOptions([]);

      // Fetch barangays if a city is selected
      if (option?.code) {
        fetchBarangays(option.code);
      }
    },
    [fetchBarangays]
  );

  /**
   * Handle barangay selection
   */
  const handleBarangayChange = useCallback((option: LocationOption | null) => {
    setSelectedLocation((prev) => ({
      ...prev,
      barangay: option,
    }));
  }, []);

  return {
    // Options
    regionOptions,
    provinceOptions,
    cityOptions,
    barangayOptions,
    
    // Selected values
    selectedLocation,
    setSelectedLocation,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Fetch functions
    fetchRegions,
    fetchProvinces,
    fetchCities,
    fetchBarangays,
    
    // Change handlers
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
  };
};